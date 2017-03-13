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
    'game_id': 'squad_leader',

    'version': '0.1a',

    'title': 'Squad Leader',

    'subtitle': 'The game of infantry combat in World War II',

    'box_front_img': 'components/squad_leader.jpg',

    'component_path_prefix': 'components/vassal/',

    'component_classes': 'sl_counter_small',

    'game_board_tabs': [
        {   // Just special as it may contain special markup and is also active by default
            'title': '1 West',
            'id': 'map1_west',
            'classes': 'sql_map'
        }
    ],

    'extra_tabs': [
    ],

    'rules_tab': {
        'id': 'rules_tab',
        'link_src': 'http://www.thierryb.net/site/media/File/wargames/fiches_jeux/SLCv104.pdf',
        'link_title': 'Non official rules'
    },
    'scenarios': [
        {
            'id':'guard_counterattack',
            'title': 'The Guards Counterattack',
            'script': 'the_guards_counter_attack.js'
        }
    ]
};
