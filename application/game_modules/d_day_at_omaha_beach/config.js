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
        {
            'title': 'Basic Seq. of Play',
            'id': 'tab1',
            'image_src': 'components/aids/omaha_1_basic.jpg',
            'image_style': 'width: 1400px; height: auto;'
        },
        {
            'title': 'Adv Seq. of Play',
            'id': 'tab2',
            'image_src': 'components/aids/omaha_2_adv.jpg',
            'image_style': 'width: 1400px; height: auto;'
        },
        {
            'title': 'Amphibious Landing',
            'id': 'tab3',
            'image_src': 'components/aids/omaha_3_amph.jpg',
            'image_style': 'width: 1400px; height: auto;'
        },
        {
            'title': 'US Weapons',
            'id': 'tab4',
            'image_src': 'components/aids/omaha_4_us_weap.jpg',
            'image_style': 'width: 1400px; height: auto;'
        },
        {
            'title': 'US Barrage',
            'id': 'tab5',
            'image_src': 'components/aids/omaha_5_us_barrage.jpg',
            'image_style': 'width: 1400px; height: auto;'
        },
        {
            'title': 'US Attack Results',
            'id': 'tab6',
            'image_src': 'components/aids/omaha_6_us_attack.jpg',
            'image_style': 'width: 1400px; height: auto;'
        },
        {
            'title': 'German Action',
            'id': 'tab7',
            'image_src': 'components/aids/omaha_7_german_action.jpg',
            'image_style': 'width: 1400px; height: auto;'
        },
        {
            'title': 'Components',
            'id': 'tab8',
            'image_src': 'components/aids/omaha_8_comp.jpg',
            'image_style': 'width: 1400px; height: auto;'
        },
        {
            'title': 'Optional',
            'id': 'tab9',
            'image_src': 'components/aids/omaha_9_optional.jpg',
            'image_style': 'width: 1400px; height: auto;'
        }
    ],

    'scenarios': [
        {
            'id':'units_only',
            'title': '(unit turn entry only)',
            'script': 'units_only.js',
            'comment': 'This not a complete scenario setup but only the line-up of the units by entry into the game.'
        }
    ]
};
