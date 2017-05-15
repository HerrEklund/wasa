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
    'game_id': 'paths_of_glory',

    'version': '0.1a',

    'title': 'Paths of Glory',

    'subtitle': 'The First World War, 1914-1918',

    'box_front_img': 'components/vassal/pog_cover.gif',

    'component_path_prefix': 'components/vassal/',

    'component_classes': 'pog_counter',

    'card_classes': 'pog_card',

    'cards':
    {
        // Add global deck configuration here
    },

    'game_board_tabs': [
        {   // Just special as it may contain special markup and is also active by default
            'title': 'Main',
            'id': 'main_game_board',
            'classes': ''
        }
    ],
    'extra_tabs': [
    ],

    'rules_tab': {
        'id': 'rules_tab',
        'link_src': 'http://www.gmtgames.com/living_rules/POG_Rules-2010.pdf',
        'link_title': 'Official rules by GMT (reprint version)'
    }
};
