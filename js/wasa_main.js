
var wasa_client;
var wasa_backend_host = '88.99.168.32';
var wasa_backend_port = '7379';

var email;
var username;
var game_id;
var game_session_id='';

function createWasaBoardGame() {

    var url = window.location.href;
    var uri = new URI(url);

    // Parse the URI
    var pq = URI.parseQuery(uri.query());

    // Try assign
    game_id = pq.game_id;
    game_session_id = pq.game_session_id;

    // Try get by cookie
    email = Cookies.get('email');

    // Render game lobby if no game_id was supplied
    if (typeof email === 'undefined') {
        // Ok, get by GET-parameter and then set Cookie
        email = pq.email;

        var email_ok = validateEmail(email);

        if (typeof email === 'undefined' || !email_ok ) {
            showEnterEmailModal(game_id, game_session_id);
            return;
        }
    }

    // Use first part as username
    username = email.split('@')[0];

    // Save for later
    Cookies.set('email', email);


    if (typeof game_id === 'undefined' || game_id.length == 0) {
        showGameLibrary();
    } else {
        // First dynamically load all needed scripts for this game module
        loadGameModule(game_id, function () {
            /* After the loadGameModule, a couple of global accessible variables should exist:
             *
             *      Variable name            From file       Explanation
             * ----------------------------------------------------------------------------------------------------
             *   nuinjucks_main_template ... config.js       The nunjucks template to use, from config.js
             *   game_data               ... config.js       Module creator set this up, from conig.js
             *   component_list          ... components.js   This can be manually created or genrated by a script
             *
             */

            try {
                verifyLoadedGameModule();
            } catch(err) {
                alert("Invalid game module, reason was: "+err);
                window.location = window.location.href.split("?")[0];
                return;
            }

            // Try get session from URL, if not, load by cookie.
            if (typeof game_session_id === 'undefined' || game_session_id.length == 0 ) {
                var current_game_session_id = Cookies.get(game_id+'_last_session');
                if (current_game_session_id != null && current_game_session_id.length > 0 ) {
                    game_session_id = current_game_session_id;
                }
            }

            // Create board game GUI
            layoutWasaBoardGaame(game_id, game_data);

            if (typeof game_session_id === 'undefined' || game_session_id.length == 0 ) {
                // No game session, dont load client or init wasa front yet
                $('#game_session_modal').modal('show');
            } else {

                // If here, the user selected a session, save it as current session_id
                Cookies.set(game_id+'_last_session', game_session_id);

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
            }

        });
    }
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function showEnterEmailModal() {
    var template_data = {
        'game_id': game_id,
        'game_session_id': game_session_id
    };

    $('#nunjucks_contents')[0].innerHTML = nunjucks.render('enter_email_modal.html', template_data);
}

function showGameLibrary() {

    var template_data = {
        'email': email,
        'username': username,
        'registered_modules': registered_modules
    };

    $('#nunjucks_contents')[0].innerHTML = nunjucks.render('game_library.html', template_data);
}

function verifyLoadedGameModule() {
    assertVariable(nuinjucks_main_template);
    assertVariable(game_data);
    assertVariable(component_list);
}

function assertVariable(variable) {
    // NOP function that will trigger ReferenceError if variable is not exsting when calling it.
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
    script.src = script_src;
    script.onload = on_script_loaded_callback;
    document.head.appendChild(script);

    console.log("Added script "+script_src);
}

function addStylesheet(stylesheet) {
    $('head').append('<link rel="stylesheet" type="text/css" href="'+stylesheet+'">');
}

function _get_base_template_data() {
    return {
        'game_id': game_id,
        'game_session_id': game_session_id,
        'email': email,
        'username': username,
        'module_path': 'game_modules/' + game_id,
        'game': game_data
    };
}

function layoutWasaBoardGaame(game_id, game_data) {

    // TODO: Use real sessions
    var available_sessions = [
        {
            'game_session_id': (fnv1Hash(game_id+'_DEMO_1')),
            'comment': 'Public demo game'
        },
        {
            'game_session_id': (fnv1Hash(game_id+'_DEMO_2')),
            'comment': 'Public demo game'
        },
        {
            'game_session_id': (fnv1Hash(game_id+'_DEMO_3')),
            'comment': 'Public demo game'
        }
    ];

    var template_data = _get_base_template_data();

    template_data['available_sessions'] = available_sessions;
    template_data['game'] = game_data;

    $('#nunjucks_contents')[0].innerHTML = nunjucks.render(nuinjucks_main_template, template_data);

    // Modify the page title to match the current game
    document.title = 'Wasa - ' + game_data['title'];

    // 2) When done, add all components
    createComponentsForTray(component_list, 'game_modules/'+game_id + '/' + game_data['component_path_prefix'], game_data['component_classes'], 'main_tray');

    if (typeof game_session_id === 'undefined' || game_session_id.length == 0 ) {
        // Show session modal then.
        $('#game_session_modal').modal('show');
    }

}

function createComponentsForTray(component_list, component_path_prefix, component_classes, tray_id) {

    var component_tray = $('#'+tray_id);

    for (var i=0; i<component_list.length; i++) {
        var file_name = component_list[i];

        var component_image_path = component_path_prefix+encodeURIComponent(file_name);

        // Handle parenthesis
        component_image_path = component_image_path.replace(/\(/g, "%28").replace(/\)/g, "%29");

        // Create ID from the file name, make sure it is safe for ID also
        var base_id = file_name.substring(0, file_name.lastIndexOf(".")).toLowerCase();
        var new_id = 'C_'+base_id.replace('.', '_');
        new_id = new_id.replace(/[^a-z0-9\-_:\.()]|^[^a-z]+/gi, "_");

        if (new_id.length == 0) {
            console.error("Failed to synthesize ID from file name = "+file_name);
            continue;
        } else {
            //console.log("Adding component ("+file_name+") using ID = "+new_id);
        }

        var tray_component = $('<div class="new_component '+component_classes+'" id="'+new_id+'" title="'+base_id+'"></div>');

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
