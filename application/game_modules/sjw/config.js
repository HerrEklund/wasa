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
    'game_id': 'sjw',

    'version': '0.1a',

    'title': 'Stonewall Jacksons Way',

    'subtitle': 'Cedar Mountains to second Manassas, August 1862',

    'box_front_img': 'components/sjw_cover_small.jpg',

    'component_path_prefix': 'components/vassal/',

    'component_classes': 'sjw_counter',

    'game_board_tabs': [
        {   // Just special as it may contain special markup and is also active by default
            'title': 'North and south map',
            'id': 'main_map',
            'classes': ''
        }

    ],

    'extra_tabs': [
    ],

    'rules_tab': {
        'id': 'rules_tab',
        'link_src': 'game_modules/sjw/components/GCACW_Series_Rules_-_Version_1-2.pdf',
        'link_title': 'GCACW Series Rules, Version 1.2'
    }
};
