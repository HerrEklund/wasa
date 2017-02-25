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
    'game_id': 'unconditional_surrender',

    'version': '0.1a',

    'title': 'Unconditional Surrender',

    'subtitle': 'World War 2 in Europe',

    'box_front_img': 'components/vassal/UnCondSurrd-Cover.png',

    'component_path_prefix': 'components/vassal/',

    'component_classes': 'uc_counter_small',

    'map_tab':
        {   // Just special as it may contain special markup and is also active by default
            'title': 'Main',
            'id': 'tab_board',
            'src': 'components/vassal/USE Map-WEST&EAST.jpg',  // TODO: Set from CSS right now, ok or not?
            'class': ''
        },

    'extra_tabs': [
    ],

    'rules_tab': {
        'id': 'rules_tab',
        'link_src': 'http://www.gmtgames.com/US/USE_RulebookGMT2014-03-05.pdf',
        'link_title': 'Official rules by GMT'
    }
};
