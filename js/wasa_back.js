
/**
 *
 * WasaClient, based on webdis
 *
 *  https://github.com/nicolasff/webdis
 *
 */
var WasaClient = function (hostname, port, game_id, username, game_event_notification_handler, game_event_handler) {
    if (typeof jQuery === 'undefined') {
        throw new Error('Wasa requires jQuery')
    }

    var that = this;

    that.game_id = game_id;
    that.username = username;
    that.http_url = 'http://'+hostname+':'+port;
    that.ws_url = 'ws://'+hostname+':'+port;

    var wasa_event_channel_name = game_id+'_event_channel';
    var wasa_event_list_name = game_id+'_event_list';

    subscribe(wasa_event_channel_name, game_event_notification_handler);

    /*
    var wasaSocket = new WebSocket(this.ws_url+"/");

    wasaSocket.onopen = function() {
        console.log("JSON socket connected!");
    };
    wasaSocket.onmessage = function(messageEvent) {
        console.log("JSON received:", messageEvent.data);
    };
    */

    $.ajaxSetup({
        error: function (jqXHR, exception) {
            if (jqXHR.status === 0) {
                alert('Not connected.\n Verify Network.');
            } else if (jqXHR.status == 403) {
                alert('Forbidden. [403]');
            } else if (jqXHR.status == 404) {
                alert('Requested page not found. [404]');
            } else if (jqXHR.status == 500) {
                alert('Internal Server Error [500].');
            } else if (exception === 'parsererror') {
                alert('Requested JSON parse failed.');
            } else if (exception === 'timeout') {
                alert('Time out error.');
            } else if (exception === 'abort') {
                alert('Ajax request aborted.');
            } else {
                alert('Uncaught Error.\n' + jqXHR.responseText);
            }
        }
    });

    that.load_all_events = function(after_events_loaded_callback) {
        async_get_jsonp('/LRANGE/'+wasa_event_list_name+'/0/-1', function (data) {
            var events = data['LRANGE'];
            var eventsLength = events.length;

            for (var i = 0; i < eventsLength; i++) {
                game_event_handler(JSON.parse(events[i]));
            }

            // Since async call, let caller continue after all events was loaded
            after_events_loaded_callback();
        });
    };

    that.load_event = function(event_id) {
        async_get_jsonp('/LINDEX/'+wasa_event_list_name+'/'+event_id, function (data) {
            var event = data['LINDEX'];

            game_event_handler(JSON.parse(event));

        });
    };

    that.store_chat_event = function(username, message) {
        var chat_event = {
            'event_type': 'chat',
            'username': encodeURIComponent(username),
            'time': getTimestamp(),
            'payload': {
                'username': encodeURIComponent(username),
                'message': encodeURIComponent(message)
            }
        };
        store_event_to_list(JSON.stringify(chat_event));
    };

    that.store_create_component_event = function(tray_component_id, component_id, left, top) {
        var component_event = {
            'event_type': 'create_component',
            'username': encodeURIComponent(username),
            'time': getTimestamp(),
            'payload': {
                'tray_component_id': tray_component_id,
                'component_id': component_id,
                'left': left,
                'top': top
            }
        };
        store_event_to_list(JSON.stringify(component_event));
    };

    that.store_move_component_event = function(component_id, left, top, zIndex) {
        var component_event = {
            'event_type': 'move_component',
            'username': encodeURIComponent(username),
            'time': getTimestamp(),
            'payload': {
                'component_id': component_id,
                'left': left,
                'top': top,
                'zIndex': zIndex
            }
        };
        store_event_to_list(JSON.stringify(component_event));
    };

    that.store_delete_component_event = function(component_id) {
        var component_event = {
            'event_type': 'delete_component',
            'username': encodeURIComponent(username),
            'time': getTimestamp(),
            'payload': {
                'component_id': component_id
            }
        };
        store_event_to_list(JSON.stringify(component_event));
    };

    that.store_rotate_component_event = function(component_id, angle) {
        var component_event = {
            'event_type': 'rotate_component',
            'username': encodeURIComponent(username),
            'time': getTimestamp(),
            'payload': {
                'component_id': component_id,
                'angle': angle
            }
        };
        store_event_to_list(JSON.stringify(component_event));
    };

    that.roll_dice_event = function(dice_rolled, result) {
        var dice_event = {
            'event_type': 'dice_roll',
            'username': encodeURIComponent(username),
            'time': getTimestamp(),
            'payload': {
                'dice_rolled': dice_rolled,
                'result': result
            }
        };
        store_event_to_list(JSON.stringify(dice_event));
    };

    that.reset_game = function() {
        confirm("Are you sure?\n\nThis can not be undone.");
        async_get_jsonp('/DEL/'+wasa_event_list_name, function (data) {
            alert("Game reset!");
        });
    };

    function store_event_to_list(json_event) {
        // 1) Store to backend
        //wasaSocket.send(JSON.stringify(["LPUSH", that.wasa_event_list_name, json_event]));

        console.log("Storing to list "+wasa_event_list_name);
        async_get_jsonp('/RPUSH/'+wasa_event_list_name+'/'+json_event, function (data) {
            // Note, list length is returned!
            console.log("JSONP Callback data: "+ JSON.stringify(data));

            // Publish the index of the event that was stored
            var event_index = data['RPUSH'];

            var command_event = {
                'command': 'new_event',
                'parameters': {
                    'events': event_index - 1
                }
            };

            async_get_jsonp('/PUBLISH/' + wasa_event_channel_name + '/'+ JSON.stringify(command_event));
        });
    }

    function getTimestamp() {
        return Math.floor(Date.now() / 1000);
    }

    /* Listen to a PUBSUB channel using chunked encoding */
    function subscribe(channel_name, game_event_notification_handler) {
        that.previous_response_length = 0;
        that.xhr = new XMLHttpRequest();
        that.xhr.onreadystatechange = on_event_received;
        that.xhr.open("GET", that.http_url+"/SUBSCRIBE/"+channel_name, true);
        that.xhr.send(null);
        that.game_event_notification_handler = game_event_notification_handler;
    }

    function on_event_received() {
        console.log("xhr.onreadystatechange");
        if(that.xhr.readyState == 3)  {
            var response = that.xhr.responseText;
            var chunk = response.slice(that.previous_response_length);
            that.previous_response_length = response.length;

            var pubsub_payload = JSON.parse(chunk);

            console.log("PubSub data received: "+pubsub_payload);

            if (pubsub_payload['SUBSCRIBE'][0] == 'message') {
                // TODO: Use somekind of key-based scheme to verify the command_events
                var command_event_json = pubsub_payload['SUBSCRIBE'][2];

                /**
                 *   command_event =  {
                 *       'command': 'command_name'
                 *       'parameters': [p0, p1, p2 ... ]
                 *   }
                 *
                 */
                var command_event = JSON.parse(command_event_json);
                game_event_notification_handler(command_event);
            }
        }
    }

    /*
        Ajax JSONP Utility methods
     */
    function async_get_jsonp(method, callback) {
        jQuery.ajax({
                url: that.http_url + method,
                method: "GET",
                dataType: "jsonp",
                success: function (data) {
                    if (callback) {
                        callback(data);
                    }
                }
            }
        );
    }

    function async_get_jsonp_parameters(method, parameters, callback) {
        jQuery.ajax({
                url: that.http_url + method,
                method: "GET",
                data: parameters,
                dataType: "jsonp",
                success: function (data) {
                    callback(data);
                }
            }
        );
    }
};


/*!
 * jQuery Cookie Plugin v1.4.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // CommonJS
        factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    var pluses = /\+/g;

    function encode(s) {
        return config.raw ? s : encodeURIComponent(s);
    }

    function decode(s) {
        return config.raw ? s : decodeURIComponent(s);
    }

    function stringifyCookieValue(value) {
        return encode(config.json ? JSON.stringify(value) : String(value));
    }

    function parseCookieValue(s) {
        if (s.indexOf('"') === 0) {
            // This is a quoted cookie as according to RFC2068, unescape...
            s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }

        try {
            // Replace server-side written pluses with spaces.
            // If we can't decode the cookie, ignore it, it's unusable.
            // If we can't parse the cookie, ignore it, it's unusable.
            s = decodeURIComponent(s.replace(pluses, ' '));
            return config.json ? JSON.parse(s) : s;
        } catch (e) {
        }
    }

    function read(s, converter) {
        var value = config.raw ? s : parseCookieValue(s);
        return $.isFunction(converter) ? converter(value) : value;
    }

    var config = $.cookie = function (key, value, options) {

        // Write

        if (value !== undefined && !$.isFunction(value)) {
            options = $.extend({}, config.defaults, options);

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setTime(+t + days * 864e+5);
            }

            return (document.cookie = [
                encode(key), '=', stringifyCookieValue(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path ? '; path=' + options.path : '',
                options.domain ? '; domain=' + options.domain : '',
                options.secure ? '; secure' : ''
            ].join(''));
        }

        // Read

        var result = key ? undefined : {};

        // To prevent the for loop in the first place assign an empty array
        // in case there are no cookies at all. Also prevents odd result when
        // calling $.cookie().
        var cookies = document.cookie ? document.cookie.split('; ') : [];

        for (var i = 0, l = cookies.length; i < l; i++) {
            var parts = cookies[i].split('=');
            var name = decode(parts.shift());
            var cookie = parts.join('=');

            if (key && key === name) {
                // If second argument (value) is a function it's a converter...
                result = read(cookie, value);
                break;
            }

            // Prevent storing a cookie that we couldn't decode.
            if (!key && (cookie = read(cookie)) !== undefined) {
                result[name] = cookie;
            }
        }

        return result;
    };

    config.defaults = {};

    $.removeCookie = function (key, options) {
        if ($.cookie(key) === undefined) {
            return false;
        }

        // Must not alter options, thus extending a fresh object...
        $.cookie(key, '', $.extend({}, options, {expires: -1}));
        return !$.cookie(key);
    };

}));

