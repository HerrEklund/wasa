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

    'subtitle': 'The Guards Counter Attack',

    'box_front_img': 'components/squad_leader.jpg',

    'component_path_prefix': 'components/vassal/',

    'map_tab':
        {   // Just special as it may contain special markup and is also active by default
            'title': 'Main',
            'id': 'tab_board',
            'src': 'components/map1_west.jpg',  // TODO: Set from CSS right now, ok or not?
            'class': ''
        },

    'extra_tabs': [
    ],

    'rules_tab': {
        'id': 'rules_tab',
        'link_src': 'http://www.thierryb.net/site/media/File/wargames/fiches_jeux/SLCv104.pdf',
        'link_title': 'Non official rules'
    }
};
