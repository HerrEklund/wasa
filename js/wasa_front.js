
var component_id = 0;
var username = 'Guest';
var game_id = 'foobar';

// Default values
var animate_transformation = true;
var animate_duration = 400;
var direct_lineup_box_on_double_click = false;

jQuery.fn.rotate = function(degrees) {
    $(this).css({'transform' : 'rotate('+ degrees +'deg)'});
    return $(this);
};

function test_is_touch_device() {
  return 'ontouchstart' in window;
}

$( document ).ready(function () {
    console.log('##');
    console.log('##');
    console.log('##  NO CHEATING !!!');
    console.log('##      (There are anti-cheat triggers that may expose you as a cheater if you fiddle with the internals!)');
    console.log('##');
    console.log('##  ... or did you find a bug? Report it to herr.eklund@gmail.com then!');
    console.log('##');
    console.log('##');

    var is_touch_device = test_is_touch_device();

    document.getElementById('event_input').onkeypress = function(e){
        if (!e) e = window.event;
        var keyCode = e.keyCode || e.which;
        if (keyCode == '13'){
          send_chat_message();
          return false;
        }
      };


    $(".new_component").draggable({
        helper: "clone",
        appendTo: "#game_board",
    });
    $(".component_tray").droppable({
        accept: '.component',
        drop: function(event, ui) {
            wasa_client.store_delete_component_event($(ui.helper).attr('id'));
        }
    });
    $("#game_board").droppable({
        accept: '.new_component',
        drop: function(event, ui) {
            var ghost_component = $(ui.helper);

            var new_component = ghost_component.clone(true);

            // Extract what we need to post the event
            var tray_component_id = new_component.context.id;
            var coordinates = ghost_component.position();

            var left = coordinates.left;
            var top = coordinates.top;

            // Store event to backend
            wasa_client.store_create_component_event(tray_component_id, get_random_id(), left, top);

            ghost_component.remove();
        }
    });

    $("#game_board").bind("click tap", function(){
        resetSelectionAndLineup();
    });

    $("#lineup_box").bind("click tap", function(){
        resetSelectionAndLineup();
    });

    // TODO: Not working on ipad?
    $("body").bind("click touchstart tap", function(){
        resetSelectionAndLineup();
    });




    /**
     * TODO: investigate how to enable lasso properly, not working well atm
     *
    if (!is_touch_device) {
        $("#game_board").selectable({
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
});

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

    // Create component
    var new_component = tray_component.clone();

    addComponentToGameBoard(new_component, new_component_id, e['payload']['top'], e['payload']['left']);

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

function handleDiceRollEvent(dice_roll_event) {
    var e = dice_roll_event;
    var event_username = e['username'];
    var time = e['time'];

    var dice_rolled = e['payload']['dice_rolled'];
    var result = e['payload']['result'];

    print_game_event(time, event_username, dice_rolled + " : " + result);
}

/**
 *
 *
 *  GUI Support functions
 *
 */
function addComponentToGameBoard(new_component, new_component_id, top, left) {

    new_component.appendTo('#game_board');
    new_component.attr('id', new_component_id);

    new_component.css({top: top, left: left, position:'absolute'});

    new_component.removeClass("new_component");

    new_component.draggable({
        start: function (event, ui) {
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
            $(event.target).css('zIndex', topZ + 1);
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

    var DELAY = 300, clicks = 0, timer = null;
    if (enable_stack_selection) {

        new_component.bind("click touchstart", function(e){

            clicks++;  //count clicks

            if(clicks === 1) {
                console.log("click on "+new_component_id);

                timer = setTimeout(function() {
                    if (new_component.hasClass('selected_component')) {
                        new_component.removeClass('selected_component');
                    } else {
                        resetLineup();
                        new_component.addClass('selected_component');
                    }

                    clicks = 0;             //after action performed, reset counter

                }, DELAY, new_component_id);

            } else {
                // Custom Double click handler
                console.log("duble click on "+new_component_id);



                // Select all that share a coordiante with clicked element
                var added_to_lineup = false;

                // IF dbl clicked on selected, add all seleted to lineup
                if(new_component.hasClass('selected_component')) {
                     selectedToLineup(new_component);
                } else {
                    $('.component').each(function () {
                        if( overlaps(new_component, $(this))) {
                            $(this).addClass('selected_component')
                        }
                        if (direct_lineup_box_on_double_click) {
                             selectedToLineup(new_component);
                        }
                    });

                }

                clearTimeout(timer);    //prevent single-click action
                clicks = 0;             //after action performed, reset counter
            }
            e.stopPropagation();


        })
        .bind("dblclick", function(e){
            e.preventDefault();  //cancel system double-click event
        });
    }

    new_component.dblclick(function (event, ui) {
        // Warning, it is not advised to both use a click AND dblclick handler
    });

    new_component.prop('title', 'ID='+new_component_id);
}

function resetSelectionAndLineup() {
    console.log("resetSelectionAndLineup()");

    $('.selected_component').removeClass('selected_component');

    resetLineup();
}

function selectedToLineup(component) {
    var position = component.position();

    resetLineup();

    $('.selected_component').each(function () {
        addCloneToLineupBox($(this));
    });
    placeLineupBox(position.left, position.top);
}

function resetLineup() {
     console.log("resetLineup()");

   // Empty lineup_box and show temp hidden
    $('.lineup_component').remove();

    $('.hidden_component').draggable( 'enable' );
    $('.hidden_component').removeClass('hidden_component');

    $('#lineup_box').removeClass('lineup_box_active');
}

function addCloneToLineupBox(component) {
    var lineup_clone = component.clone(true);
    lineup_clone.css({position:'static'});
    lineup_clone.removeClass('selected_component');
    lineup_clone.addClass('lineup_component');

    lineup_clone.appendTo('#lineup_box');

    lineup_clone.draggable( 'disable' );

    // Hide original
    component.addClass('hidden_component');
    $('#lineup_box').addClass('lineup_box_active');
}

function placeLineupBox(left, top) {
  $('#lineup_box').css({top: top, left: left, position:'absolute'});
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
    wasa_client.store_chat_event(username, message);
    $('#event_input').val('');
}

function roll_D6() {
    var result = Math.floor(Math.random() * 6) + 1;
    wasa_client.roll_dice_event('1D6', result);
}

function roll_2D6() {
    var d1 = Math.floor(Math.random() * 6) + 1;
    var d2 = Math.floor(Math.random() * 6) + 1;
    var result = d1+d2;
    wasa_client.roll_dice_event('2D6', result);
}