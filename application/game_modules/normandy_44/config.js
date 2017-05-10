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

    'title': 'Normandy \'44',

    'subtitle': 'D-Day and the Battle for Normandy, 6 - 27 JUNE, 1944',

    'box_front_img': 'components/vassal/cover.jpg',

    'component_path_prefix': 'components/vassal/',

    'component_classes': 'normandy44_counter_small',

    'game_board_tabs': [
        {   // Just special as it may contain special markup and is also active by default
            'title': 'Main',
            'id': 'main_game_board',
            'classes': ''
        }
    ],
    'extra_tabs': [
        {
            'title': 'German reinforcements',
            'id': 'tab1',
            'image_src': 'components/vassal/GermanReinfCard-2015.jpg',
            'image_style': 'width: 1800px; height: auto;'
        },
        {
            'title': 'In Britain',
            'id': 'tab2',
            'image_src': 'components/vassal/In Britain Card-2015.jpg',
            'image_style': 'width: 1800px; height: auto;'
        },
        {
            'title': 'At Cherbourg',
            'id': 'tab3',
            'image_src': 'components/vassal/AtStartCard-CHERBOURG_2015.png'
        },
        {
            'title': 'Invasion tables',
            'id': 'tab4',
            'image_src': 'components/vassal/Invasion_tables-2015.png',
            'image_style': 'width: 1200px; height: auto;'
        },
        {
            'title': 'Combat result table',
            'id': 'tab5',
            'image_src': 'components/vassal/N44-CRT-2015.jpg',
            'image_style': 'width: 1200px; height: auto;'
        },
        {
            'title': 'Terrain effects',
            'id': 'tab6',
            'image_src': 'components/vassal/N44-TEC-2015.jpg',
            'image_style': 'width: 1200px; height: auto;'
        }
    ],

    'rules_tab': {
        'id': 'rules_tab',
        'link_src': 'http://www.gmtgames.com/normandy44/N44-RULES-2ndEdition.pdf',
        'link_title': 'Official rules by GMT (reprint version)'
    }
};
