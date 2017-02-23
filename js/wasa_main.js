
var wasa_client;
var wasa_backend_host = '88.99.168.32';
var wasa_backend_port = '7379';

var username;
var game_id;
var game_session_id;

function createWasaBoardGame(p_username, p_game_id, p_game_session_id) {

    username = p_username;
    game_id = p_game_id;
    game_session_id = p_game_session_id;

    // First dynamically load all needed scripts for this game module
    loadGameModule(game_id, function () {

        // Create board game GUI
        layoutWasaBoardGaame(game_id, game_data);

        // Connect the client to the backend
        wasa_client = new WasaClient(wasa_backend_host, wasa_backend_port, game_session_id, username, game_event_notification_handler, game_event_handler);

        // Iniitalize the GUI, add event handlers etc.
        init_wasa_front();

        // And make this client up-to-date
        /**
         *
         * This piece may be a bit application specific
         *
         *   Load all events is a good start to get the player to the front, but there is room
         *   for a custom start here. Depending on supplied keys etc,
         *      - observer or player?
         *      - setup new scenario or continue?
        */
        wasa_client.load_events(function () {
            // Slow down animations after all existing elements was loaded
            animate_transformation = true;
            animate_duration = 400;
        });
    });

}

function loadGameModule(game_id, on_modules_loaded_callback) {

    // Add game script
    addScript('game_modules/'+game_id+'/components.js', function () {
        addScript('game_modules/'+game_id+'/config.js', on_modules_loaded_callback);
    });

    // Add game stylesheet
    addStylesheet('game_modules/'+game_id+'/style.css');
}

function addScript(script_src, on_script_loaded_callback) {
    var script = document.createElement('script');
    script.onload = function () {
        on_script_loaded_callback();
    };
    script.src = script_src;
    document.head.appendChild(script);

    console.log("Added script "+script_src);
}

function addStylesheet(stylesheet) {
    $('head').append('<link rel="stylesheet" type="text/css" href="'+stylesheet+'">');
}

function layoutWasaBoardGaame(game_id, game_data) {

    // 1) Layout the main page based on the game_data
    nunjucks.configure('templates', {autoescape: true});

    var template_data = {
        'module_path': 'game_modules/' + game_id,
        'game': game_data
    };
    
    $('#game_page')[0].innerHTML = nunjucks.render(nuinjucks_main_template, template_data);

    // 2) When done, add all components
    createComponentsForTray(component_list, 'game_modules/'+game_id + '/' + game_data['component_path_prefix'], 'main_tray');

}

function createComponentsForTray(component_list, component_path_prefix, tray_id) {

    var component_tray = $('#'+tray_id);

    for (var i=0; i<component_list.length; i++) {
        var file_name = component_list[i];

        var component_image_path = component_path_prefix+encodeURIComponent(file_name);

        // Create ID from the file name, make sure it is safe for ID also
        var new_id = 'C_'+file_name.split('.')[0];
        new_id = new_id.replace(/[^a-z0-9\-_:\.]|^[^a-z]+/gi, "");

        if (new_id.length == 0) {
            console.error("Failed to synthesize ID from file name = "+file_name);
            continue;
        } else {
            console.log("Adding component ("+file_name+") using ID = "+new_id);
        }

        var tray_component = $('<div class="new_component RW_component" id="'+new_id+'"></div>');

        tray_component.css('backgroundImage', 'url(' + component_image_path + ')');

        tray_component.appendTo(component_tray);

    }
}

function game_event_notification_handler(command_event) {
    /**
     * In case you have implemented game specific events, you can be notified of state changes
     *  the generic game logic (create, move, rotate etc.) has taken place already.
     */
    console.log("Application received command event:" + command_event);

    if (command_event['command'] == 'new_event') {
        var event_list_length = parseInt(command_event['parameters']['events']);

        // TODO: Load all events that the client has not yet seen, so could be load range or load single here!
        wasa_client.load_event(event_list_length);
    }
}

function game_event_handler(ge) {
    /**
     * WASA handles the basic stuff of chat, create, move, delete, rotate etc.
     *
     * But you could of course add game specific events here
     *
     */
    console.log("Application received event:" + JSON.stringify(ge));

    $('.game_board').addClass('board_flash_red');

    setTimeout(function () {
        $('.game_board').removeClass('board_flash_red');
    }, 300);

    if(ge['event_type'] == 'chat') {
        addChatMessage(ge);
    }
    else if (ge['event_type'] == 'create_component') {
        createAndAddComponentToGameBoard(ge);
    }
    else if (ge['event_type'] == 'move_component') {
        moveComponent(ge);
    }
    else if (ge['event_type'] == 'delete_component') {
        deleteComponent(ge);
    }
    else if (ge['event_type'] == 'rotate_component') {
        rotateComponent(ge);
    }
    else if (ge['event_type'] == 'rotate_component') {
        rotateComponent(ge);
    }
    else if (ge['event_type'] == 'mark_components') {
        markComponents(ge);
    }
    else if (ge['event_type'] == 'unmark_components') {
        unmarkComponents(ge);
    }
    else if (ge['event_type'] == 'dice_roll') {
        handleDiceRollEvent(ge);
    }
    else {
        console.error("Unhandled event type "+ge['event_type']);
    }
}
