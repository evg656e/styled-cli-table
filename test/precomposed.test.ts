import { strictEqual } from 'assert';
import { Data, TopLevelStyles } from '../lib/styledtable/StyledTable';
import { RenderedStyledTable } from '../lib/precomposed/RenderedStyledTable';
import { ColorRenderedStyledTable } from '../lib/precomposed/ColorRenderedStyledTable';
import { border, single } from '../lib/styles/border';
import { padding } from '../lib/styles/padding';
import * as color from '../lib/styles/color';

describe('precomposed', () => {
    const defaultData = [
        ['#', 'name', 'price', 'quantity', 'total'],
        [1, 'apple', 2, 3, 6],
        [2, 'banana', 1, 10, 10],
        [3, 'lemon', 1.5, 3, 4.5],
    ];
    describe('RenderedStyledTable', () => {
        ([
            [
                'all borders, custom widths, horizontal paddings, first row align center',
                defaultData,
                {
                    ...border(true),
                    borderCharacters: single,
                    ...padding(0, 1),
                    rows: {
                        0: {
                            align: 'center'
                        }
                    },
                    columns: {
                        1: {
                            minWidth: 6,
                            maxWidth: 12
                        },
                        [-1]: {
                            width: 9
                        }
                    }
                },
                [
                    '┌───┬────────┬───────┬──────────┬─────────┐',
                    '│ # │  name  │ price │ quantity │  total  │',
                    '├───┼────────┼───────┼──────────┼─────────┤',
                    '│ 1 │ apple  │ 2     │ 3        │ 6       │',
                    '├───┼────────┼───────┼──────────┼─────────┤',
                    '│ 2 │ banana │ 1     │ 10       │ 10      │',
                    '├───┼────────┼───────┼──────────┼─────────┤',
                    '│ 3 │ lemon  │ 1.5   │ 3        │ 4.5     │',
                    '└───┴────────┴───────┴──────────┴─────────┘'
                ]
            ],
            [
                'all borders, custom heights, horizontal and vertical paddings, horizontal and vertical aligns',
                [
                    ['#', 'name', 'price', 'quantity', 'total'],
                    [1, ['apple', 'Granny Smith'], 2, 3, 6],
                    [2, 'banana', 1, 10, 10],
                    [3, 'lemon', 1.5, 3, 4.5],
                ],
                {
                    ...border(true),
                    borderCharacters: single,
                    ...padding(0, 1),
                    rows: {
                        0: {
                            align: 'center',
                            ...padding(1)
                        },
                        2: {
                            height: 3,
                            verticalAlign: 'bottom'
                        }
                    },
                },
                [
                    '┌───┬──────────────┬───────┬──────────┬───────┐',
                    '│   │              │       │          │       │',
                    '│ # │     name     │ price │ quantity │ total │',
                    '│   │              │       │          │       │',
                    '├───┼──────────────┼───────┼──────────┼───────┤',
                    '│ 1 │ apple        │ 2     │ 3        │ 6     │',
                    '│   │ Granny Smith │       │          │       │',
                    '├───┼──────────────┼───────┼──────────┼───────┤',
                    '│   │              │       │          │       │',
                    '│   │              │       │          │       │',
                    '│ 2 │ banana       │ 1     │ 10       │ 10    │',
                    '├───┼──────────────┼───────┼──────────┼───────┤',
                    '│ 3 │ lemon        │ 1.5   │ 3        │ 4.5   │',
                    '└───┴──────────────┴───────┴──────────┴───────┘'
                ]
            ],
            [
                'custom borders, horizontal paddings, first row align center',
                defaultData,
                {
                    borderCharacters: single,
                    ...padding(0, 1),
                    rows: {
                        0: {
                            align: 'center',
                            borderTop: true,
                            borderBottom: true
                        },
                        [-1]: {
                            borderBottom: true
                        }
                    },
                    columns() {
                        return {
                            borderLeft: true,
                            borderRight: true
                        }
                    }
                },
                [
                    '┌───┬────────┬───────┬──────────┬───────┐',
                    '│ # │  name  │ price │ quantity │ total │',
                    '├───┼────────┼───────┼──────────┼───────┤',
                    '│ 1 │ apple  │ 2     │ 3        │ 6     │',
                    '│ 2 │ banana │ 1     │ 10       │ 10    │',
                    '│ 3 │ lemon  │ 1.5   │ 3        │ 4.5   │',
                    '└───┴────────┴───────┴──────────┴───────┘'
                ]
            ],
            [
                'custom content, custom borders, horizontal paddings',
                defaultData,
                {
                    borderCharacters: single,
                    ...padding(0, 1),
                    rows: {
                        0: {
                            borderTop: true,
                            borderBottom: true
                        },
                        [-1]: {
                            borderBottom: true
                        }
                    },
                    columns() {
                        return {
                            borderLeft: true,
                            borderRight: true
                        }
                    },
                    cells({ value, rowIndex }) {
                        const isNumber = typeof value === 'number';
                        return {
                            content: isNumber ? value : `'${value}'`,
                            align: rowIndex === 0 ? 'center' :
                                isNumber ? 'right' : 'left'
                        };
                    }
                },
                [
                    "┌─────┬──────────┬─────────┬────────────┬─────────┐",
                    "│ '#' │  'name'  │ 'price' │ 'quantity' │ 'total' │",
                    "├─────┼──────────┼─────────┼────────────┼─────────┤",
                    "│   1 │ 'apple'  │       2 │          3 │       6 │",
                    "│   2 │ 'banana' │       1 │         10 │      10 │",
                    "│   3 │ 'lemon'  │     1.5 │          3 │     4.5 │",
                    "└─────┴──────────┴─────────┴────────────┴─────────┘"
                ]
            ]
        ] as [string, Data, TopLevelStyles, string[]][]).forEach(([title, data, styles, result]) => {
            it(title, () => {
                strictEqual(new RenderedStyledTable(data, styles).toString(), result.join('\n'));
            });
        });
    });

    describe('ColorRenderedStyledTable', () => {
        ([
            [
                'all borders, custom colors, horizontal paddings, first row align center',
                defaultData,
                {
                    ...border(true),
                    ...padding(0, 1),
                    borderCharacters: single,
                    backgroundColor: color.bgGreen,
                    color: color.blue,
                    rows: {
                        0: {
                            align: 'center',
                            color: color.red
                        }
                    },
                },
                [
                    '\u001b[42m┌───┬────────┬───────┬──────────┬───────┐\u001b[0m',
                    '\u001b[42m│ \u001b[31m#\u001b[0m\u001b[42m │  \u001b[31mname\u001b[0m\u001b[42m  │ \u001b[31mprice\u001b[0m\u001b[42m │ \u001b[31mquantity\u001b[0m\u001b[42m │ \u001b[31mtotal\u001b[0m\u001b[42m │\u001b[0m',
                    '\u001b[42m├───┼────────┼───────┼──────────┼───────┤\u001b[0m',
                    '\u001b[42m│ \u001b[34m1\u001b[0m\u001b[42m │ \u001b[34mapple\u001b[0m\u001b[42m  │ \u001b[34m2\u001b[0m\u001b[42m     │ \u001b[34m3\u001b[0m\u001b[42m        │ \u001b[34m6\u001b[0m\u001b[42m     │\u001b[0m',
                    '\u001b[42m├───┼────────┼───────┼──────────┼───────┤\u001b[0m',
                    '\u001b[42m│ \u001b[34m2\u001b[0m\u001b[42m │ \u001b[34mbanana\u001b[0m\u001b[42m │ \u001b[34m1\u001b[0m\u001b[42m     │ \u001b[34m10\u001b[0m\u001b[42m       │ \u001b[34m10\u001b[0m\u001b[42m    │\u001b[0m',
                    '\u001b[42m├───┼────────┼───────┼──────────┼───────┤\u001b[0m',
                    '\u001b[42m│ \u001b[34m3\u001b[0m\u001b[42m │ \u001b[34mlemon\u001b[0m\u001b[42m  │ \u001b[34m1.5\u001b[0m\u001b[42m   │ \u001b[34m3\u001b[0m\u001b[42m        │ \u001b[34m4.5\u001b[0m\u001b[42m   │\u001b[0m',
                    '\u001b[42m└───┴────────┴───────┴──────────┴───────┘\u001b[0m'
                ]
            ],
        ] as [string, Data, TopLevelStyles, string[]][]).forEach(([title, data, styles, result]) => {
            it(title, () => {
                strictEqual(new ColorRenderedStyledTable(data, styles).toString(), result.join('\n'));
            });
        });
    });
});
