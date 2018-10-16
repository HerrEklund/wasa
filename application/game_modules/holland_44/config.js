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
    //
    // Game id and directory name under "game_modules"
    'game_id': 'holland_44',
    //
    // Whatever you like
    'version': '0.1a',
    //
    // Textual tile, used to present the game
    'title': 'Holland 44',
    //
    // A sub tile is common, fill it in if applicable
    'subtitle': 'Operation Market-Garden',
    //
    // Path ot the box front. Used for presenting the game
    'box_front_img': 'components/vassal/Holland44 Cover Scaled.png',
    //
    // Leave this as default
    'component_path_prefix': 'components/vassal/',
    //
    // A custom CSS class that will be applied to all counters of this game
    //
    // This class is defined in the file style.css (more about that below)
    'component_classes': 'holland44_counter_small',
    //
    // This structure defines the "tabs" of the game. There are three classes of tabs:
    // 1) Game maps, on which game components can be dropped
    //   Note that map boards do not define their game image at this point.
    //   (it is done in the style.css file)
    'game_board_tabs': [
        {
            'title': 'Main map',
            'id': 'main_map',
            'classes': ''
        }
    ],
    // 2) Non game-maps, like tables and Player Aids
    //   At this point look inside the "components/vassal" directory and look for the few big files:
    //   Note, that you need to set the correct width in pixles for each image.
    //   If you want, you could add more tabs (images) by adding new blocks similar to the one below.
    'extra_tabs': [
        {
            'title': 'Player Aid',
            'id': 'tab1',
            'image_src': 'components/vassal/HO44-PAC-FINAL-HiRes-1 100.jpg',
            'image_style': 'width: 1100px; height: auto;'
        },
        {
            'title': 'Terrain effects',
            'id': 'tab2',
            'image_src': 'components/vassal/HO44-PAC-FINAL-HiRes-2 100.jpg',
            'image_style': 'width: 1100px; height: auto;'
        },
    ],
    // 3) Rules. This tab does not display the rules, but simply a link to the rules.
    //    you can often find a link to the game rules using Google.
    'rules_tab': {
        'id': 'rules_tab',
        'link_src': 'https://s3-us-west-2.amazonaws.com/gmtwebsiteassets/Holland44/HO44-LIVINGRULES-May2018.pdf',
        'link_title': 'Official rules by GMT'
    },
    // You will add the scenarios at a later point. You could keep the "scenarios" field empty for now.
};
