
jQuery.fn.rotate = function(degrees) {
    $(this).css({'transform' : 'rotate('+ degrees +'deg)'});
    return $(this);
};

function initWasaFront() {

    console.log('##');
    console.log('##');
    console.log('##  NO CHEATING !!!');
    console.log('##      (There are anti-cheat triggers that may expose you as a cheater if you fiddle with the internals!)');
    console.log('##');
    console.log('##  ... or did you find a bug? Report it to herr.eklund@gmail.com then!');
    console.log('##');
    console.log('##');


    document.getElementById('event_input').onkeypress = function (e) {
        if (!e) e = window.event;
        var keyCode = e.keyCode || e.which;
        if (keyCode == '13') {
            send_chat_message();
            return false;
        }
    };

    // Load table_material from localStorage
    var table_material = localStorage.getItem('table_material');
    if (table_material != null) {
        $(".game_table").css({'background-image': 'url(../img/'+table_material+')'});
    }


    $(".wasa_panel").draggable({
        scroll: scroll_if_drag_on_edge,
        handle: '.panel-heading',
        stack: ".global_stackable"
    });

    $(".resizable").resizable();

    $(".resizable_scroller")
        .wrap('<div/>')
        .css({'overflow': 'hidden'})
        .parent()
        .css({
            'display': 'inline-block',
            'overflow': 'hidden',
            'height': function () {
                return $('.resizable_scroller', this).height();
            },
            'width': function () {
                return $('.resizable_scroller', this).width();
            },
            'paddingBottom': '12px',
            'paddingRight': '12px'

        }).resizable()
        .find('.resizable_scroller')
        .css({
            overflow: 'auto',
            width: '100%',
            height: '100%'
        });

    $(".new_component").draggable({
        stack: ".global_stackable",
        zIndex: 10000000,           // This will "lift" the component above anything else
        helper: "clone",
        // cursorAt: { left: 0, top: 0 },
        appendTo: "#all_tabs"       // Wrapper of the maps, drop will be off by some 40 pixels.
    });

    $(".game_card").draggable({
        stack: ".game_card",
        start: function (event, ui) {
            // $(event.target).appendTo($('#main_body'));
        },
        drop: function(event, ui) {
            console.log("Dropped card on #" + event.target.id);
        }

    });

    $(".component_tray").droppable({
        accept: '.component',
        drop: function(event, ui) {
            wasa_client.store_delete_component_event($(ui.helper).attr('id'));
        }
    });
    $(".game_board").droppable({
        accept: '.new_component, .game_card',
        drop: function(event, ui) {

            // NOTE: This is the ghost (drag shadow) that is about to be dropped
            var dropping_component = $(ui.helper);

            // ... so it does not yet have the correct coordinates since does not belong to the board yet.
            // ... that is why I calculate the corrext X and Y to send as event below.
            var relX = event.pageX - $(this).offset().left - event.offsetX;
            var relY = event.pageY - $(this).offset().top - event.offsetY;

            console.log("Dropped on board #"+ event.target.id);

            // Extract what we need to post the event
            var tray_component_id = dropping_component.context.id;
            var coordinates = dropping_component.position();

            //  Ghost component seem to use coordinates from a parent div (the tab holder?)
            var left = relX;
            var top = relY;

            if (dropping_component.find('.flipper').hasClass('flipped')) {
                flipped = true;
            } else {
                flipped = false;
            }

            if (dropping_component.hasClass('game_card')) {
                /**
                 * Just temporarily. This will not att the card with persistence
                 *
                 */
                console.log(".... dropped card.");
                $(dropping_component).appendTo(event.target);

            } else if (dropping_component.hasClass('new_component')) {
                console.log(".... dropped new component.");

                // Store event to backend
                wasa_client.store_create_component_event(tray_component_id, get_random_id(), event.target.id, left, top, flipped);

                dropping_component.remove();
            }

        }
    });
    // Draggable lineup box?
    $('.lineup_box').draggable({});

    $(".game_board").bind("click tap touchstart", function(e){
        resetSelectionAndLineup();
        e.stopPropagation();
    });

    /**
     * TODO: investigate how to enable lasso properly, not working well atm
     *
    if (!is_touch_device) {
        $(".game_board").selectable({
          filter: "div",
            start: function( event, ui ) {

                resetSelectionAndLineup();
            },
          selected: function( event, ui ) {
              var selected_element = $(ui)[0];
              var selected_id = selected_element.selected.id;
              if (selected_id) {
                  console.log("Selected "+selected_id);
                  $('#'+selected_id).addClass('selected_component');
              } else {
                  console.log("Select event with not hit.")
              }
          }
        });
    }
     */

    /*
    This seem not to matter since event propagates to the game_board anyway

    $(".lineup_box").bind("click tap touchstart", function(e){
        //resetSelectionAndLineup();
        e.cancelBubble = true;
    });
    */
    $(".cb_unmark").bind("click tap touchstart", function () {
        // Remove marked if already marked
        var component_ids = [];
        $('.selected_component').each(function () {
            component_ids.push($(this).attr('id'));
        });

        // Need to send marked event for each component, component name and color etc.
        wasa_client.unmark_components_event(component_ids);

    });

    $(".cb_mark").bind("click tap touchstart", function(e) {

        // Extract border-bottom-color as "border-color" is not always defined in all browsers
        var cbox_border_color = $(e.target).css('border-bottom-color');

        var component_ids = [];
        $('.selected_component').each(function () {
            component_ids.push($(this).attr('id'));
        });

        $('.selected_component').removeClass('selected_component');

        // Need to send marked event for each component, component name and color etc.
        wasa_client.mark_components_event(component_ids, cbox_border_color);

    });
}

/**
 *
 * Application event handlers
 *
 */
function addChatMessage(chat_message_event) {
    var e = chat_message_event;

    var username = e['payload']['username'];
    var message = e['payload']['message'];

    var events_textarea = $('#events_textarea');
    events_textarea.append("\n"+username+": "+ message);
    events_textarea.scrollTop(events_textarea[0].scrollHeight);
}

/**
 *
 * Game event handlers
 *
 */
function createAndAddComponentToGameBoard(create_component_event) {
    /**
     * Will be called when events are received from back end.
     *
     */
    var e = create_component_event;
    var event_username = e['username'];
    var time = e['time'];

    // Grab the tray component
    var tray_component = $('#'+e['payload']['tray_component_id']);
    var new_component_id = e['payload']['component_id'];
    var game_board_id = e['payload']['game_board_id'];

    // Create component
    var new_component = tray_component.clone();

    addComponentToGameBoard(new_component, new_component_id, game_board_id, e['payload']['top'], e['payload']['left'], e['payload']['flipped']);

    print_game_event(time, event_username, "Created component "+new_component_id);
}

function moveComponent(move_component_event) {
    var e = move_component_event;
    var event_username = e['username'];
    var time = e['time'];

    var component_id = e['payload']['component_id'];
    var left = e['payload']['left'];
    var top = e['payload']['top'];
    var zIndex = e['payload']['zIndex'];

    var transformation_css = {top: top, left: left, zIndex: zIndex};
    if (animate_transformation) {
        $('#'+component_id).animate(transformation_css, animate_duration);
    } else {
        $('#'+component_id).css(transformation_css);
    }

    print_game_event(time, event_username, "Moved component "+component_id);
}

function deleteComponent(delete_component_event) {
    var e = delete_component_event;
    var event_username = e['username'];
    var time = e['time'];

    var component_id = e['payload']['component_id'];
    $('#'+component_id).remove();

    print_game_event(time, event_username, "Removed component "+component_id);
}

function rotateComponent(rotate_component_event) {
    var e = rotate_component_event;
    var event_username = e['username'];
    var time = e['time'];

    var component_id = e['payload']['component_id'];
    var new_angle = e['payload']['angle'];

    var component = $('#'+component_id);

    component.attr("rotation", new_angle);

    // Do this when event is received from back-end
    rotate(component, new_angle);

    print_game_event(time, event_username, "Rotated component "+component_id);
}

function markComponents(mark_component_event) {
    var e = mark_component_event;
    var event_username = e['username'];
    var time = e['time'];

    var component_ids = e['payload']['component_ids'];
    var color = e['payload']['color'];

    for (var i=0; i < component_ids.length; i++) {
        var component = $('#'+component_ids[i]);
        component.addClass('marked_component');
        component.css({'border-color': color});
    }
}

function unmarkComponents(unmark_components_event) {
    var e = unmark_components_event;
    var event_username = e['username'];
    var time = e['time'];

    var component_ids = e['payload']['component_ids'];

    for (var i=0; i < component_ids.length; i++) {
        var component = $('#'+component_ids[i]);
        component.removeClass('marked_component');
        component.css({'border-color': ''});
    }
}

function handleDiceRollEvent(dice_roll_event) {
    var e = dice_roll_event;
    var event_username = e['username'];
    var time = e['time'];

    var dice_rolled = e['payload']['dice_rolled'];
    var result = e['payload']['result'];

    print_game_event(time, event_username, dice_rolled + " : " + result);
}

function handleFlipComponentEvent(flip_component_event) {
    var e = flip_component_event;

    // EVENT DATA
    var event_username = e['username'];
    var time = e['time'];
    var component_id = e['payload']['component_id'];

    // EVENT EXECUTION
    var component = $('#'+component_id);
    var flipper = component.find('.flipper');
    $(flipper).toggleClass('flipped');
    component.removeClass('selected_component');
}

/**
 *
 *
 *  GUI Support functions
 *
 */
function placeComponentOnTop(component) {
    // Will move selected component to top when touched
    var topZ = 0;
    var topZ_element;
    $('.component').each(function () {
        var thisZ = parseInt($(this).css('zIndex'), 10);
        if (thisZ > topZ) {
            topZ = thisZ;
            topZ_element = this;
        }
    });
    component.css('zIndex', topZ + 1);
}
function addComponentToGameBoard(new_component, new_component_id, game_board_id, top, left, flipped) {

    new_component.appendTo('#' + game_board_id);
    new_component.attr('id', new_component_id);

    new_component.css({top: top, left: left, position:'absolute'});

    new_component.removeClass("new_component");
    new_component.addClass("component");
    new_component.addClass("global_stackable");

    if(flipped) {
        var flipper = new_component.find('.flipper');
        $(flipper).addClass('flipped');
    }

    new_component.draggable({
        // grid: [ 5, 5 ],
        delay: 150,
        scroll: scroll_if_drag_on_edge,  // Global from wasa_main.js
        start: function (event, ui) {
            placeComponentOnTop($(event.target));
        },
        stop: function(event, ui) {
            var coordinates = $(event.target).position();
            var left = coordinates.left;
            var top = coordinates.top;
            var zIndex = $(event.target).css('zIndex');

            wasa_client.store_move_component_event($(event.target).context.id, left, top, zIndex);

            // Also move all selected
            /*
            $('.selected_component').each( function (index, value) {
                var coordinates = $(value).position();
                var left = coordinates.left;
                var top = coordinates.top;
                var zIndex = $(value).css('zIndex');

                wasa_client.store_move_component_event($(value).context.id, left, top, zIndex);
            })
            */
        }
    });

    new_component.attr("rotation", 0);

    if (enable_component_rotation) {
        new_component.bind("click touchstart", function(event, ui) {
            var new_angle;
            var current_rotation = new_component.attr("rotation");

            if (isNaN(current_rotation)) {
                current_rotation = 0;
            }

            if (event.shiftKey) {
                new_angle = parseInt(current_rotation) - 9;
            } else {
                new_angle = parseInt(current_rotation) + 9;
            }
            if (new_angle > 360) {
                new_angle = new_angle - 360;
            }

            // TODO: Event
            wasa_client.store_rotate_component_event(new_component[0].id, new_angle);
        });
    }

    new_component.mousedown(function(e) {

        if(e.which == 3)
        {
            wasa_client.flip_component_event(new_component[0].id);
        }

        // Stop so it dont trigger other events on board for example
        // e.stopPropagation();
    });

    // listen for the long-press event
    new_component.bind('taphold', function(e) {
        wasa_client.flip_component_event(new_component[0].id);
    });

    if (enable_stack_selection) {
        new_component.bind("click tap touchstart", function(e){
            console.log("Click on component!");

            if(new_component.hasClass('selected_component')) {
                // Clear selection before doing stack selection (and possibly auto-open lineup box)
                //$('.selected_component').removeClass('selected_component');

                // If click on selected, add all intersecting to selection also
                $('.component').each(function () {
                    if( overlaps(new_component, $(this))) {
                        $(this).addClass('selected_component');
                    }
                });
                // .. then open box
                selectedToLineup(new_component);
            } else {
                new_component.addClass('selected_component');
            }

            //e.preventDefault();

            // Stop so it dont trigger other events on board for example
            e.stopPropagation();
        });
    }

    new_component.dblclick(function (event, ui) {
        console.log("DBLCLICK!!")
        // Warning, it is not advised to both use a click AND dblclick handler

        // Warning, doubleclick (real or sythesized with timers) seem to work half bad on touch
    });

    new_component.prop('title', 'ID='+new_component_id);

    placeComponentOnTop(new_component);
}

function unmarkAllComponents() {
    // Remove marked if already marked
    var component_ids = [];
    $('.marked_component').each(function () {
        component_ids.push($(this).attr('id'));
    });

    if(component_ids.length > 0) {
        wasa_client.unmark_components_event(component_ids);
    }
}

function resetSelectionAndLineup() {
    console.log("resetSelectionAndLineup()");

    $('.selected_component').removeClass('selected_component');

    resetLineup();
}

function resetLineup() {
     console.log("resetLineup()");

   // Empty lineup_box and show temp hidden
    $('.lineup_component').remove();

    $('.hidden_component').draggable( 'enable' );
    $('.hidden_component').removeClass('hidden_component');

    $('.lineup_box').removeClass('lineup_box_active');
    $('.lineup_box').hide();

}

function selectedToLineup(component) {
     console.log("selectedToLineup()");

    var position = component.position();

    resetLineup();

    $('.selected_component').each(function () {
        addCloneToLineupBox($(this));
    });
    placeLineupBox(position.left, position.top);
}

function addCloneToLineupBox(component) {
    var lineup_clone = component.clone(true);
    lineup_clone.css({position:'static'});
    lineup_clone.removeClass('selected_component');
    lineup_clone.addClass('lineup_component');

    // Find the components lineup_box
    var closest_lineup_box = $(component).siblings('.lineup_box')[0];

    lineup_clone.appendTo(closest_lineup_box);

    lineup_clone.draggable();

    // Hide original
    component.addClass('hidden_component');
}

function placeLineupBox(left, top) {
    $('.lineup_box').addClass('lineup_box_active');
    $('.lineup_box').css({top: top + 60, left: left, position: 'absolute'});
    $('.lineup_box').show();
}

var overlaps = (function () {
    function getPositions( elem ) {
        var pos, width, height;
        pos = $( elem ).position();
        width = $( elem ).width();
        height = $( elem ).height();
        return [ [ pos.left, pos.left + width ], [ pos.top, pos.top + height ] ];
    }

    function comparePositions( p1, p2 ) {
        var r1, r2;
        r1 = p1[0] < p2[0] ? p1 : p2;
        r2 = p1[0] < p2[0] ? p2 : p1;
        return r1[1] > r2[0] || r1[0] === r2[0];
    }

    return function ( a, b ) {
        var pos1 = getPositions( a ),
            pos2 = getPositions( b );
        return comparePositions( pos1[0], pos2[0] ) && comparePositions( pos1[1], pos2[1] );
    };
})();

function rotate($el, degrees) {
    var transformation_css = {
      '-webkit-transform' : 'rotate('+degrees+'deg)',
         '-moz-transform' : 'rotate('+degrees+'deg)',
          '-ms-transform' : 'rotate('+degrees+'deg)',
           '-o-transform' : 'rotate('+degrees+'deg)',
              'transform' : 'rotate('+degrees+'deg)',
                   'zoom' : 1

    };

    if(animate_transformation) {
        // TODO: cant animate rotations yet
        $el.css(transformation_css, animate_duration);
    } else {
        $el.css(transformation_css);
    }
}

function get_random_id() {
    return Math.random().toString(36).substring(3, 11);
}

function print_game_event(unix_timestamp, event_username, text) {
    var events_textarea = $('#events_textarea');

    var ptime = get_printable_time(unix_timestamp);

    events_textarea.append("\n"+ ptime + " ["+ event_username + "] : " + text);

    events_textarea.scrollTop(events_textarea[0].scrollHeight);
}

function get_printable_time(unix_timestamp) {
  var a = new Date(unix_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours() < 10 ? '0' + a.getHours() : a.getHours();
  var min = a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes();
  var sec = a.getSeconds() < 10 ? '0' + a.getSeconds() : a.getSeconds();
  //var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  var time = hour + ':' + min + ':' + sec ;
  return time;
}

function send_chat_message() {
    var message = $('#event_input').val();

    if (message[0] == '/') {
        handle_command(message);
    } else {
        wasa_client.store_chat_event(username, message);
    }
    $('#event_input').val('');
}

function handle_command(command) {
    // Handle command
    if (command == '/dump') {
        // Empty the events_dump div
        $('#events_dump').empty();

        // Add a new dump
        var dump = '/* Events from game_id = '+game_id+' */\n'+JSON.stringify(event_cache, null, 2);
        $('<pre id="events_pre">'+dump+'</pre>').appendTo('#events_dump');

        // And show the modal
        $('#events_modal').modal('show');
    } else if (command == '/dump_setup') {
        // Empty the events_dump div
        $('#events_dump').empty();

        // Optimize the event cache (ie. only keep last move of each component)
        var optimized_events = optimize_events_for_setup(event_cache);

        var dump = '/* Events from game_id = '+game_id+' */\n'+JSON.stringify(optimized_events, null, 2);
        $('<pre id="events_pre">'+dump+'</pre>').appendTo('#events_dump');

        // And show the modal
        $('#events_modal').modal('show');
    } else if (command.startsWith('/D')) {
        var splits = command.split(' ', 2);

        var sides = parseInt(splits[1]);

        roll_NDS(1, sides);

    } else if (command == '/help') {
        events_textarea.append("\n*** Supported commands: ");
        events_textarea.append("\n*** /dump          - Dump all commands ");
        events_textarea.append("\n*** /dump_setup    - Dump optimized version usable for scenario setups: ");
        events_textarea.append("\n*** /D [dice size] - Roll one custom size die. (ie, a random number from 0 to size)");
        events_textarea.append("\n*** /help          - This text ");
    } else {
        events_textarea.append("\n*** ERROR: Unknown command "+command);
    }
}

function optimize_events_for_setup(events) {

    var optimized_events = [];

    for (i = 0; i < events.length; i++) {
        console.log(events[i]);

        optimized_events.push(events[i]);
    }

    return optimized_events;
}

function roll_NDS(N, S) {
    var sum = 0;

    var results = [];
    for (i = 0; i < N; i++) {
        var result = Math.floor(Math.random() * S) + 1;
        results.push(result)
        sum += result;
    }

    var result_message = results.toString() + " = " + sum;

    wasa_client.roll_dice_event(N+'D'+S, result_message);
}

function filter_components(target) {
    $('.new_component').show();

    // All componentes get C_ as prefix

    if (target.value.length > 0) {
        var filter = target.value.toLowerCase();
        $('.new_component:not([id*='+filter+'])').hide();
    }
}

function SelectText(element) {
    var doc = document;
    var text = doc.getElementById(element);
    if (doc.body.createTextRange) { // ms
        var range = doc.body.createTextRange();
        range.moveToElementText(text);
        range.select();
    } else if (window.getSelection) {
        var selection = window.getSelection();
        var range = doc.createRange();
        range.selectNodeContents(text);
        selection.removeAllRanges();
        selection.addRange(range);

    }
}

