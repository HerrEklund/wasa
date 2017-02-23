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
    'game_id': 'red_winter',

    'version': '0.31a',

    'title': 'Red Winter',

    'subtitle': 'The Soviet Attack at Tolvajärvi, Finland 1939',

    'component_path_prefix': 'components/vassal/',

    'map_tab':
        {   // Just special as it may contain special markup and is also active by default
            'title': 'Main',
            'id': 'tab_board',
            'src': 'components/vassal/Red_Winter_Map-150.jpg',  // TODO: Set from CSS right now, ok or not?
            'class': ''
        },

    'extra_tabs': [
        {
            'title': 'Turn track',
            'id': 'tab_turn_track',
            'image_src': 'components/vassal/turn_track.png',
            'image_style': 'width: 80%; height: 80%'
        },
        {
            'title': 'Player Aid 1',
            'id': 'tab_player_aid_1',
            'image_src': 'components/vassal/pac1.png',
            'image_style': ''
        },
        {
            'title': 'Player Aid 2',
            'id': 'tab_player_aid_2',
            'image_src': 'components/vassal/pac2.png',
            'image_style': ''
        }
    ],

    'rules_tab': {
        'id': 'rules_tab',
        'link_src': 'http://www.gmtgames.com/redwinter/RW_Rules_FINAL_Med_Res.pdf',
        'link_title': 'Red Winter Final Rules at GMT Games'
    }
};
