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
    'game_id': 'red_winter',

    'version': '0.31a',

    'title': 'Red Winter',

    'subtitle': 'The Soviet Attack at Tolvajärvi, Finland 1939',

    'box_front_img': 'components/vassal/splash.png',

    'component_path_prefix': 'components/vassal/',

    'component_classes': 'RW_component',

    'game_board_tabs': [
        {   // Just special as it may contain special markup and is also active by default
            'title': 'Main',
            'id': 'main_game_board',
            'classes': ''
        },
        {
            'title': 'Turn track',
            'id': 'turn_track',
            'classes': ''
        }
    ],

    'extra_tabs': [
        {
            'title': 'PA: Front',
            'id': 'tab_player_aid_1',
            'image_src': 'components/vassal/pac1.png',
            'image_style': ''
        },
        {
            'title': 'PA: Back',
            'id': 'tab_player_aid_2',
            'image_src': 'components/vassal/pac2.png',
            'image_style': ''
        }
    ],

    'rules_tab': {
        'id': 'rules_tab',
        'link_src': 'http://www.gmtgames.com/redwinter/RW_Rules_FINAL_Med_Res.pdf',
        'link_title': 'Red Winter Final Rules at GMT Games'
    },

    'scenarios': [
        {
            'id':'17_1_campaign_game',
            'title': '17.1 The Campaign Game - The Battle of Tolvajärvi [semi complete]',
            'script': '17_1_campaign_game.js'
        }
    ]
};
