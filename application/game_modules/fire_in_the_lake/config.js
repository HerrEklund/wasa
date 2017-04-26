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
    'game_id': 'fire_in_the_lake',

    'version': '0.1a',

    'title': 'Fire in the Lake',

    'subtitle': 'COIN Series, Volume IV',

    'box_front_img': 'components/vassal/FireLake-CardBack2.jpg',

    'component_path_prefix': 'components/vassal/',

    'component_classes': 'fitl_marker',

    'card_classes': 'fitl_card',

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
        {
            'title': 'North Vietnam',
            'id': 'tab1',
            'image_src': 'components/vassal/Chart_NVA.jpg'
        },
        {
            'title': 'ARVN',
            'id': 'tab2',
            'image_src': 'components/vassal/Chart_ARVN.jpg'
        },
        {
            'title': 'Viet Cong',
            'id': 'tab3',
            'image_src': 'components/vassal/Chart_VC.jpg'
        },
        {
            'title': 'USA',
            'id': 'tab4',
            'image_src': 'components/vassal/Chart_USA.jpg'
        },
        {
            'title': 'Sequence of play',
            'id': 'tab5',
            'image_src': 'components/vassal/Chart_Sequence of Play.jpg'
        }
    ],

    'rules_tab': {
        'id': 'rules_tab',
        'link_src': 'http://www.gmtgames.com/fireinthelake/FireLake-RULES-Final.pdf',
        'link_title': 'Official rules by GMT'
    }
};
