var cards_per_pixel_x = 1;
var cards_per_pixel_y = 1.5;

var card_abs_pos_top_start  = 400;
var card_abs_pos_left_start = 20;

var card_width = 200;
var card_height = 350;

var decks = [
    {
        'name': 'Ottoman home card',
        'back': 'Ottoman_back.svg',
        'fronts': [
            'HIS-001.svg'
        ]
    },
    {
        'name': 'Hapsburg home card',
        'back': 'Hapsburg_back.svg',
        'fronts': [
            'HIS-002.svg'
        ]
    },
    {
        'name': 'English home card',
        'back': 'England_back.svg',
        'fronts': [
            'HIS-003.svg'
        ]
    },
    {
        'name': 'French home card',
        'back': 'France_back.svg',
        'fronts': [
            'HIS-004.svg'
        ]
    },
    {
        'name': 'Papal home card',
        'back': 'Papacy_back.svg',
        'fronts': [
            'HIS-005.svg',
            'HIS-006.svg'
        ]
    },
    {
        'name': 'Protestant home card',
        'back': 'Protestant_back.svg',
        'fronts': [
            'HIS-007.svg'
        ]
    },
    {
        'name': 'Misc',
        'back': 'cardback.svg',
        'fronts': [
            'HIS-008.svg',
            'HIS-009.svg',
            'HIS-010.svg',
            'HIS-011.svg',
            'HIS-012.svg',
            'HIS-013.svg',
            'HIS-014.svg',
            'HIS-015.svg',
            'HIS-016.svg',
            'HIS-017.svg',
            'HIS-018.svg',
            'HIS-019.svg',
            'HIS-020.svg',
            'HIS-021.svg',
            'HIS-022.svg',
            'HIS-023.svg',
            'HIS-024.svg',
            'HIS-025.svg',
            'HIS-026.svg',
            'HIS-027.svg',
            'HIS-028.svg',
            'HIS-029.svg',
            'HIS-030.svg',
            'HIS-031.svg',
            'HIS-032.svg',
            'HIS-033.svg',
            'HIS-034.svg',
            'HIS-035.svg',
            'HIS-036.svg',
            'HIS-037.svg',
            'HIS-038.svg',
            'HIS-039.svg',
            'HIS-040.svg',
            'HIS-041.svg',
            'HIS-042.svg',
            'HIS-043.svg',
            'HIS-044.svg',
            'HIS-045.svg',
            'HIS-046.svg',
            'HIS-047.svg',
            'HIS-048.svg',
            'HIS-049.svg',
            'HIS-050.svg',
            'HIS-051.svg',
            'HIS-052.svg',
            'HIS-053.svg',
            'HIS-054.svg',
            'HIS-055.svg',
            'HIS-056.svg',
            'HIS-057.svg',
            'HIS-058.svg',
            'HIS-059.svg',
            'HIS-060.svg',
            'HIS-061.svg',
            'HIS-062.svg',
            'HIS-063.svg',
            'HIS-064.svg',
            'HIS-065.svg',
            'HIS-066.svg',
            'HIS-067.svg',
            'HIS-068.svg',
            'HIS-069.svg',
            'HIS-070.svg',
            'HIS-071.svg',
            'HIS-072.svg',
            'HIS-073.svg',
            'HIS-074.svg',
            'HIS-075.svg',
            'HIS-076.svg',
            'HIS-077.svg',
            'HIS-078.svg',
            'HIS-079.svg',
            'HIS-080.svg',
            'HIS-081.svg',
            'HIS-082.svg',
            'HIS-083.svg',
            'HIS-084.svg',
            'HIS-085.svg',
            'HIS-086.svg',
            'HIS-087.svg',
            'HIS-088.svg',
            'HIS-089.svg',
            'HIS-090.svg',
            'HIS-091.svg',
            'HIS-092.svg',
            'HIS-093.svg',
            'HIS-094.svg',
            'HIS-095.svg',
            'HIS-096.svg',
            'HIS-097.svg',
            'HIS-098.svg',
            'HIS-099.svg',
            'HIS-100.svg',
            'HIS-101.svg',
            'HIS-102.svg',
            'HIS-103.svg',
            'HIS-104.svg',
            'HIS-105.svg',
            'HIS-106.svg',
            'HIS-107.svg',
            'HIS-108.svg',
            'HIS-109.svg',
            'HIS-110.svg'
        ]
    },
    {
        'name': 'Diplomatic deck',
        'back': 'diplomacyback.svg',
        'fronts': [
            'HIS-201.svg',
            'HIS-202.svg',
            'HIS-203.svg',
            'HIS-204.svg',
            'HIS-205.svg',
            'HIS-206.svg',
            'HIS-207.svg',
            'HIS-208.svg',
            'HIS-209.svg',
            'HIS-210.svg',
            'HIS-211.svg',
            'HIS-212.svg'
        ]
    }
];

var card_back = 'cardback.svg';

var cards_list = [

];