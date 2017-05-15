
// Application context
var wasa_client;
var wasa_backend_host = '88.99.168.32';
var wasa_backend_port = '7379';

// Session context
var email;
var username;
var game_id;
var game_session_id='';

// How many cards per pixel
var DECK_TILT = 2;

function createWasaBoardGame() {

    var url = window.location.href;
    var uri = new URI(url);

    // Parse the URI
    var pq = URI.parseQuery(uri.query());

    // Try assign
    game_id = pq.game_id;
    game_session_id = pq.game_session_id;

    // Try get by cookie
    email = localStorage.getItem('email');

    // Render game lobby if no game_id was supplied
    if (email == null) {
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
    localStorage.setItem('email', email);


    if (typeof game_id === 'undefined' || game_id.length == 0) {
        showGameLibrary();
    } else {

        // Try get session from URL, if not, load by cookie.
        if (typeof game_session_id === 'undefined' || game_session_id.length == 0 ) {
            var current_game_session_id = localStorage.getItem(game_id+'_last_session');
            if (current_game_session_id != null && current_game_session_id.length > 0 ) {
                // Redirect to update URL
                window.location = window.location.href.split("?")[0] + '?game_id='+game_id+'&game_session_id='+current_game_session_id;
                return;
            }
        }

        // First dynamically load all needed scripts for this game module
        loadGameModule(game_id, function () {
            /** After the loadGameModule, a couple of global accessible variables should exist:
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

            /**
             * Create board game GUI
             */
            layoutWasaBoardGaame(game_id, game_data, function () {
                /**
                 *  Find out what session should be activated
                 */
                if (typeof game_session_id === 'undefined' || game_session_id.length == 0 ) {
                    // No game session, dont load client or init wasa front yet
                    $('#game_session_modal').modal('show');
                } else {

                    if (typeof game_session_id === 'undefined' || game_session_id.length == 0 ) {
                        // Show session modal then.
                        $('#game_session_modal').modal('show');
                    }

                    // If here, the user selected a session, save it as current session_id
                    localStorage.setItem(game_id+'_last_session', game_session_id);

                    // Connect the client to the backend
                    wasa_client = new WasaClient(wasa_backend_host, wasa_backend_port, game_session_id, username, game_event_notification_handler, game_event_handler);

                    // Initialize the GUI, add event handlers etc.
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

// Note: Async load method, cant catch errors
function addScript(script_src, on_script_loaded_callback) {
    var script = document.createElement('script');
    script.src = script_src;
    // ASYNC!
    script.onload = on_script_loaded_callback;

    document.head.appendChild(script);
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

function layoutWasaBoardGaame(game_id, game_data, onComplete) {

    var available_sessions = [
        {
            'game_session_id': (fnv1Hash(game_id+'_PUBL_1')),
            'comment': 'Public demo game'
        },
        {
            'game_session_id': (fnv1Hash(email + game_id+'_GAME_1')),
            'comment': 'GAME 1 (Private, shareable)'
        },
        {
            'game_session_id': (fnv1Hash(email + game_id+'_GAME_2')),
            'comment': 'GAME 2 (Private, shareable)'
        }
    ];

    var template_data = _get_base_template_data();

    // Make some important data available to the template renderer
    template_data['available_sessions'] = available_sessions;
    template_data['game'] = game_data;

    $('#nunjucks_contents')[0].innerHTML = nunjucks.render(nuinjucks_main_template, template_data);

    // Modify the page title to match the current game
    document.title = 'Wasa - ' + game_data['title'];

    // 2) When done, add all components
    createComponentsForTray(component_list, 'game_modules/'+game_id + '/' + game_data['component_path_prefix'], game_data['component_classes'], 'main_tray');

    // 3) And add cards if possible
    if (game_data['cards'] != null) {
        addScript('game_modules/'+game_id+'/decks.js', function () {
            onCardsLoaded(onComplete);
        } );
    } else {
        onComplete();
    }
}

/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function onCardsLoaded(onComplete) {
    /**
     *  A couple of new variables are now accessible
     *
     *  card_back     ... the graphics representing the back of a card
     *  card_list     ... the graphics for all the cards
     */

    // Build card deck divs first

    // Since we are building a manifest card, add that class also, that will add some padding around the card
    var card_classes = game_data['card_classes']; // + " manifest_card";

    var card_abs_pos_top_start  = 300;
    var card_abs_pos_left_start = 20;

    var card_width = 200;
    var card_height = 400;

    // Offset each deck when placing them
    var deck_offs_top = 0;
    var deck_offs_left = 0;

    for (var d=0; d<decks.length; d++) {

        var deck_name = decks[d]['name'];
        var fronts = decks[d]['fronts'];
        var back = decks[d]['back'];

        console.log("Building Dec: "+deck_name);

        var card_deck = buildCardDeck(fronts, back, 'game_modules/' + game_id + '/' + game_data['component_path_prefix'], card_classes);

        // Suffle?
        card_deck = shuffleArray(card_deck);

        // Add to a holder
        var deck_holder = $('#' + 'game_table');

        var t = 0;
        var l = 0;

        for (var i = 0; i < card_deck.length; i++) {
            var card_div = card_deck[i];

            card_div.appendTo(deck_holder);

            var card_abs_pos_top = card_abs_pos_top_start + deck_offs_top;
            var card_abs_pos_left = card_abs_pos_left_start + deck_offs_left;

            var transformation_css = {top: card_abs_pos_top + (t++ / DECK_TILT), left: card_abs_pos_left + (l++ / DECK_TILT), zIndex: 1};
            $(card_div).css(transformation_css);
        }

        //deck_offs_left = deck_offs_left + (card_width + 50);
        deck_offs_top = deck_offs_top + (card_height + 50);
    }

    onComplete();

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

        new_id = new_id.replace('(', '');
        new_id = new_id.replace(')', '');

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


function createCardDiv(card_id, card_title, card_classes, card_front_image_path, card_back_image_path) {
    // This is templates
    var flippable_card = "<div class='flippable_card game_card CARD_CLASSES' id='CARD_ID' title='CARD_TITLE'></div>";
    var flipper = "<div class='flipper CARD_CLASSES' ondblclick=this.classList.toggle('flipped')></div>";
    var card_front = "<div class='front CARD_CLASSES'></div>";
    var card_back = "<div class='back CARD_CLASSES'></div>";

    var card_div = $(flippable_card.replace('CARD_CLASSES', card_classes).replace('CARD_ID', card_id).replace('CARD_TITLE', card_title));

    var flipper_div = $(flipper.replace('CARD_CLASSES', card_classes));

    var card_front_div = $(card_front.replace('CARD_CLASSES', card_classes));
    card_front_div.css('backgroundImage', 'url(' + card_front_image_path + ')');

    var card_back_div = $(card_back.replace('CARD_CLASSES', card_classes));
    card_back_div.css('backgroundImage', 'url(' + card_back_image_path + ')');

    // Order of addition does not matter
    card_front_div.appendTo(flipper_div);
    card_back_div.appendTo(flipper_div);

    flipper_div.appendTo(card_div);

    return card_div;
}


function buildCardDeck(card_list, card_back, card_path_prefix, card_classes) {

    var card_back_path = card_path_prefix+encodeURIComponent(card_back);

    var card_deck = [];

    for (var i=0; i<card_list.length; i++) {
        var file_name = card_list[i];

        var card_front_path = card_path_prefix+encodeURIComponent(file_name);

        // Handle parenthesis
        card_front_path = card_front_path.replace(/\(/g, "%28").replace(/\)/g, "%29");

        // Create ID from the file name, make sure it is safe for ID also
        var base_id = file_name.substring(0, file_name.lastIndexOf(".")).toLowerCase();
        var new_id = 'C_'+base_id.replace('.', '_');

        new_id = new_id.replace('(', '');
        new_id = new_id.replace(')', '');

        new_id = new_id.replace(/[^a-z0-9\-_:\.()]|^[^a-z]+/gi, "_");

        if (new_id.length == 0) {
            console.error("Failed to synthesize ID from file name = "+file_name);
            continue;
        } else {
            //console.log("Adding card ("+file_name+") using ID = "+new_id);
        }

        var card_div = createCardDiv(new_id, "Title for "+new_id, card_classes, card_front_path, card_back_path);  //.css('backgroundImage', 'url(' + card_image_path + ')');

        card_deck.push(card_div);

    }

    return card_deck;
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

var event_cache = [];

function game_event_handler(ge) {
    /**
     * WASA handles the basic stuff of chat, create, move, delete, rotate etc.
     *
     * But you could of course add game specific events here
     *
     */

    //console.log("Application received event:" + JSON.stringify(ge));

    flash_game_board();

    event_cache.push(ge);

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

function loadScenario(scenario_id) {
    if (scenario_id.length == 0 ) {
        return;
    }
    if(confirm('Are you sure you want to reset the current game session and load a new scenario?')) {

        var scenario;
        // Get scenario descriptor
        for(var i=0; i < game_data.scenarios.length; i++) {
            if (game_data.scenarios[i].id == scenario_id) {
                scenario = game_data.scenarios[i];
                break
            }
        }

        if (scenario !== undefined) {
            console.log('Loading scenario '+ scenario['title']);
        }

        // Reset current game
        wasa_client.reset_and_continue(function () {
            // This will add a new variable called scenario_setup to the environemnt
            addScript('game_modules/'+game_id+'/scenarios/'+scenario['script'], function () {
                console.log('Scenario loaded from script.');

                wasa_client.store_chat_event(username, ' --- LOADING SCENARIO: '+scenario['title']+' ---');

                /**
                 *
                 * TODO: Fix, Note Async store behaviour. Not really optimal when order is important.
                 *
                 */
                setTimeout(function () {

                    for (var i=0; i < scenario_setup.length; i++) {
                        var event = scenario_setup[i];

                        // Remove chat messages from setup
                        if (event['event_type'] == 'chat') {
                            continue;
                        }

                        // Replace user of the scenario creator with bogus one.
                        event['username'] = '-SETUP-';

                        // Store the events, note the bulk store does not notify
                        wasa_client.store_event(event, false);
                    }

                    setTimeout(function () {
                        wasa_client.store_chat_event(username, ' --- SETUP COMPLETE ---');

                        // And reload page
                        window.location = window.location.href;

                    }, 2000);

                }, 300);

            });
        });

    }
}

function flash_game_board() {

    $('#player_panel').addClass('event_signal');

    setTimeout(function () {
        $('#player_panel').removeClass('event_signal');
    }, 1000);

}