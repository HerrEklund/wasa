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
    'game_id': 'here_i_stand',

    'version': '0.1a',

    'title': 'Here I Stand',

    'subtitle': 'Wars of the Reformation 1517 - 1555',

    'game_design': 'Ed Beach',

    'publisher': 'GMT Games',

    'box_front_img': 'components/vassal/HIS_cover.jpg',

    'component_path_prefix': 'components/vassal/',

    'component_classes': 'his_marker',

    'card_classes': 'his_card',

    'cards':
    {
        // Add global deck configuration here
    },


    'game_board_tabs': [
        {   // Just special as it may contain special markup and is also active by default
            'title': 'Map of Europe',
            'id': 'map_of_europe',
            'classes': ''
        },
        {
            'title': 'Religious Struggle',
            'id': 'religious_struggle_card',
            'classes': ''
        },

        {
            'title': 'Ottomans',
            'id': 'player_ottomans',
            'classes': ''
        },
        {
            'title': 'Hapsburgs',
            'id': 'player_hapsburgs',
            'classes': ''
        },
        {
            'title': 'England',
            'id': 'player_england',
            'classes': ''
        },
        {
            'title': 'France',
            'id': 'player_france',
            'classes': ''
        },
        {
            'title': 'Papacy',
            'id': 'player_papacy',
            'classes': ''
        },
        {
            'title': 'Protestant',
            'id': 'player_protestant',
            'classes': ''
        }
    ],

    'rules_tab': {
        'id': 'rules_tab',
        'link_src': 'https://www.gmtgames.com/living_rules/HIS-Rules-2010.pdf',
        'link_title': 'Here I Stand Rules 2nd Printing (2010)'
    },

    'extra_tabs': [
    ]
};
