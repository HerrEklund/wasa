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
        {   // Note the id defined here must be defined in style.css where the bitmap is pointed out etc.
            'title': 'North and south map',
            'id': 'main_map',
            'classes': ''
        }

    ],

    'extra_tabs': [
        {
            'title': 'Combat Chart',
            'id': 'tab1',
            'image_src': 'components/combat_chart.png',
            'image_style': 'width: 1000px; height: auto;'
        },
        {
            'title': 'Terrain / Art.',
            'id': 'tab2',
            'image_src': 'components/terrain_artillery_attack.png',
            'image_style': 'width: 1000px; height: auto;'
        },
        {
            'title': 'Ratio / Sum. Comb.',
            'id': 'tab3',
            'image_src': 'components/ratio_combat_summary.png',
            'image_style': 'width: 1000px; height: auto;'
        },
        {
            'title': 'Flank / Cav.',
            'id': 'tab4',
            'image_src': 'components/flank_attack_combat_result_sum.png',
            'image_style': 'width: 1000px; height: auto;'
        },
        {
            'title': 'Move / Ext. march',
            'id': 'tab5',
            'image_src': 'components/movement_mp_cost_ext_march.png',
            'image_style': 'width: 1000px; height: auto;'
        },
        {
            'title': 'Retreat',
            'id': 'tab6',
            'image_src': 'components/retreat_chart.png',
            'image_style': 'width: 1000px; height: auto;'
        }
    ],

    'rules_tab': {
        'id': 'rules_tab',
        'link_src': 'game_modules/sjw/components/GCACW_Series_Rules_-_Version_1-2.pdf',
        'link_title': 'GCACW Series Rules, Version 1.2'
    },
    'scenarios': [
        {
            'id':'cedar_mountain',
            'title': 'Scenario 1: Cedar Mountain',
            'script': 'sc_1_cedar_mountain.js'
        },
        {
            'id':'lee_vs_pope',
            'title': 'Scenario 2: Lee vs. Pope',
            'script': 'sc_2_lee_vs_pope.js'
        }

    ]

};
