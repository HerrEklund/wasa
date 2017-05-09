/**
 * GUI behaviour settings
 *
 * @type {boolean}
 */
var animate_transformation = false;
var animate_duration = 0;
var enable_component_rotation = false;
var enable_stack_selection = true;
var direct_lineup_box_on_double_click = true;


/**
 * Select page template to use.
 *
 * @type {string}
 */
var nuinjucks_main_template = 'left_panels_large_map_tabs.html';

/**
 * The game_box structure is fed to the selected main_template.
 *
 */
var game_data = {
    'game_id': 'd_day_at_omaha_beach',

    'version': '0.1a',

    'title': 'D-Day At Omaha Beach',

    'subtitle': 'SOLITAIRE',

    'box_front_img': 'components/vassal/Splash.jpg',

    'component_path_prefix': 'components/vassal/',

    'component_classes': 'daob_marker',

    'card_classes': 'daob_card',

    'cards':
    {
        // Add global deck configuration here
    },


    'game_board_tabs': [
        {   // Just special as it may contain special markup and is also active by default
            'title': 'Game board',
            'id': 'game_board',
            'classes': ''
        }
    ],

    'extra_tabs': [
    ]
};
