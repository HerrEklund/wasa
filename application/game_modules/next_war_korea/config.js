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
    'game_id': 'next_war_korea',

    'version': '0.1a',

    'title': 'Next War: Korea',

    'subtitle': '',

    'box_front_img': 'components/vassal/nwkbox.jpg',

    'component_path_prefix': 'components/vassal/',

    'component_classes': 'nw_korea_small',

    'game_board_tabs': [
        {   // Just special as it may contain special markup and is also active by default
            'title': 'Main',
            'id': 'game_board',
            'classes': ''
        },
        {
            'title': 'Air sup.',
            'id': 'air_sup_board',
            'classes': ''
        },
        {
            'title': 'Game info',
            'id': 'game_info_board',
            'classes': ''
        }
    ],
    'extra_tabs': [
        {
            'title': 'Intl. posture',
            'id': 'tab3',
            'image_src': 'components/vassal/PAC3-Posture.png',
            'image_style': 'width: 1600px; height: auto;'
        },
        {
            'title': 'Reinforc.',
            'id': 'tab4',
            'image_src': 'components/vassal/RMap.png',
            'image_style': 'width: 1600px; height: auto;'
        },
        {
            'title': 'Terrain',
            'id': 'tab5',
            'image_src': 'components/vassal/PAC4-TEC.png',
            'image_style': 'width: 1600px; height: auto;'
        },
        {
            'title': 'Std/Adv. Tbl.',
            'id': 'tab6',
            'image_src': 'components/vassal/PAC5-StandardPlayaids-1.png',
            'image_style': 'width: 1600px; height: auto;'
        },
        {
            'title': 'Std. Air',
            'id': 'tab7',
            'image_src': 'components/vassal/PAC5-StandardPlayaids-2.png',
            'image_style': 'width: 1600px; height: auto;'
        },
        {
            'title': 'Adv. Tbl. 1',
            'id': 'tab8',
            'image_src': 'components/vassal/PAC6-AdvancedPlayaids-1a.png',
            'image_style': 'width: 1600px; height: auto;'
        },
        {
            'title': 'Adv. Tbl. 2',
            'id': 'tab9',
            'image_src': 'components/vassal/PAC6-AdvancedPlayaids-1b.png',
            'image_style': 'width: 1600px; height: auto;'
        },
        {
            'title': 'Adv. Cmbt/Det',
            'id': 'tab10',
            'image_src': 'components/vassal/PAC6-AdvancedPlayaids-2a.png',
            'image_style': 'width: 1600px; height: auto;'
        },
        {
            'title': 'Adv. Def/Strk',
            'id': 'tab11',
            'image_src': 'components/vassal/PAC6-AdvancedPlayaids-2b.png',
            'image_style': 'width: 1600px; height: auto;'
        }
    ],

    'rules_tab': {
        'id': 'rules_tab',
        'link_src': 'http://www.gmtgames.com/korea/NWK_Rules.v2.pdf',
        'link_title': 'Official rules by GMT'
    }
};
