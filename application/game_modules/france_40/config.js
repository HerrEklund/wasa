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
    'game_id': 'normandy_44',

    'version': '0.1a',

    'title': 'France 40',

    'subtitle': 'Sickle Cut / Dynamo',

    'box_front_img': 'components/vassal/Splash.jpg',

    'component_path_prefix': 'components/vassal/',

    'component_classes': 'france40_counter_small',

    'game_board_tabs': [
        {   // Just special as it may contain special markup and is also active by default
            'title': 'Sickle Cut',
            'id': 'sickle_cut_game_board',
            'classes': ''
        },
        {   // Just special as it may contain special markup and is also active by default
            'title': 'Dynamo',
            'id': 'dynamo_game_board',
            'classes': ''
        }
    ],
    'extra_tabs': [
        {
            'title': 'Sequence of Play',
            'id': 'tab1',
            'image_src': 'components/vassal/Chart_Expanded Sequence of Play.jpg',
            'image_style': 'width: 581px; height: auto;'
        },
        {
            'title': 'Terrain',
            'id': 'tab2',
            'image_src': 'components/vassal/Chart_TEC.png',
            'image_style': 'width: 1149px; height: auto;'
        },
        {
            'title': 'Player Aid',
            'id': 'tab3',
            'image_src': 'components/france_40_player_aid.jpg',
            'image_style': 'width: 1183px; height: auto;'
        }
    ],

    'rules_tab': {
        'id': 'rules_tab',
        'link_src': 'http://www.gmtgames.com/sichel/France40-RULES-FINAL.pdf',
        'link_title': 'Official rules by GMT'
    },
    'scenarios': [
        {
            'id':'sickle_cut',
            'title': 'Sickle Cut - Guderian´s Drive to the Coast',
            'script': 'sickle_cut.js'
        },
        {
            'id':'dynamo',
            'title': 'Dynamo - Retreat to Victory',
            'script': 'dynamo.js'
        }
    ]
};
