import { strictEqual } from 'assert';
import { StyledTable, Data, TopLevelStyles, StyledCell } from '../lib/styledtable/StyledTable';
import { PrintLineBuffer } from '../lib/printline/PrintLineBuffer';
import { GenericBufferedRenderer } from '../lib/renderers/GenericBufferedRenderer';
import { BreakPrintLineBuffer } from '../lib/printline/BreakPrintLineBuffer';
import { FlexSizeRenderer } from '../lib/renderers/FlexSizeRenderer';
import { PaddingRenderer } from '../lib/renderers/PaddingRenderer';
import { AlignRenderer } from '../lib/renderers/AlignRenderer';
import { BorderRenderer } from '../lib/renderers/BorderRenderer';
import { ColorRenderer } from '../lib/renderers/ColorRenderer';
import { BackgroundColorRenderer } from '../lib/renderers/BackgroundColorRenderer';
import { padding } from '../lib/styles/padding';
import { border, single, borderCharacters } from '../lib/styles/border';
import * as color from '../lib/styles/color';
import type { AbstractPrintLineBuffer } from '../lib/printline/AbstractPrintLineBuffer';
import type { ComputedCellStyles } from '../lib/renderers/AbstractBufferedRenderer';
import type { Constructor } from '../lib/util/Constructor';

describe('renderers', () => {
    const dotSpace = {
        space: '.'
    };

    describe('FlexSizeRenderer', () => {
        const Renderer = FlexSizeRenderer(GenericBufferedRenderer(PrintLineBuffer));
        ([
            [
                'auto width',
                [
                    ['abc', 12, 'wasd'],
                    ['xy', 12345, 'qwe'],
                ],
                [
                    'abc12...wasd',
                    'xy.12345qwe.'
                ],
                {
                    ...dotSpace
                }
            ],
            [
                'auto height',
                [
                    ['abc', [12, 345], 'wasd'],
                    ['qqq', 12345, ['qwe', 'asd', 'zxc']],
                    ['xy', 12345, 'qwe'],
                ],
                [
                    'abc12...wasd',
                    '...345......',
                    'qqq12345qwe.',
                    '........asd.',
                    '........zxc.',
                    'xy.12345qwe.'
                ],
                {
                    ...dotSpace
                }
            ],
            [
                'fixed width',
                [
                    ['abc', 12, 'wasd'],
                    ['xy', 123456, 'qwe'],
                ],
                [
                    'abc..12...wasd.',
                    'xy...12345qwe..'
                ],
                {
                    width: 5,
                    ...dotSpace
                }
            ],
            [
                'fixed columns width',
                [
                    ['abc', 12, 'wasd'],
                    ['xy', 123456, 'qwe'],
                ],
                [
                    'abc12..wasd.',
                    'xy.1234qwe..'
                ],
                {
                    columns: {
                        1: {
                            width: 4
                        },
                        [-1]: {
                            width: 5
                        }
                    },
                    ...dotSpace
                }
            ],
            [
                'min-max width',
                [
                    ['ab', 12, 'wasd'],
                    ['xy', 123456, 'qwe'],
                ],
                [
                    'ab.12...wasd',
                    'xy.12345qwe.'
                ],
                {
                    minWidth: 3,
                    maxWidth: 5,
                    ...dotSpace
                }
            ],
            [
                'fixed height',
                [
                    ['abc', 12, 'wasd'],
                    ['xy', 123456, 'qwe'],
                ],
                [
                    'abc12....wasd',
                    '.............',
                    'xy.123456qwe.',
                    '.............'
                ],
                {
                    height: 2,
                    ...dotSpace
                }
            ],
            [
                'fixed rows height',
                [
                    ['abc', 12, 'wasd'],
                    ['xy', [123, 456, 789], 'qwe'],
                ],
                [
                    'abc12.wasd',
                    '..........',
                    '..........',
                    'xy.123qwe.',
                    '...456....'
                ],
                {
                    rows: {
                        0: {
                            height: 3
                        },
                        1: {
                            height: 2
                        }
                    },
                    ...dotSpace
                }
            ],
            [
                'min-max height',
                [
                    ['abc', 12, 'wasd'],
                    ['xy', [123, 456, 789, 1234], 'qwe'],
                ],
                [
                    'abc12..wasd',
                    '...........',
                    'xy.123.qwe.',
                    '...456.....',
                    '...789.....'
                ],
                {
                    minHeight: 2,
                    maxHeight: 3,
                    ...dotSpace
                }
            ],
            [
                'content',
                [
                    ['abc', 12, 'wasd'],
                    ['xy', 12345, 'qwe'],
                ],
                [
                    "'abc'12...'wasd'",
                    "'xy'.12345'qwe'."
                ],
                {
                    cells({ value }) {
                        return {
                            content: typeof value === 'string' ? `'${value}'` : value
                        };
                    },
                    ...dotSpace
                } as TopLevelStyles
            ]
        ] as [string, Data, string[], TopLevelStyles][]).forEach(([title, data, result, styles]) => {
            it(title, () => {
                strictEqual(new Renderer().toString(new StyledTable(data, styles)), result.join('\n'));
            });
        });
    });

    describe('PaddingRenderer', () => {
        const Renderer = PaddingRenderer(FlexSizeRenderer(GenericBufferedRenderer(PrintLineBuffer)));
        ([
            [
                'no paddings',
                [
                    ['abc', 12, 'wasd'],
                    ['xy', 12345, 'qwe'],
                ],
                [
                    'abc12...wasd',
                    'xy.12345qwe.'
                ],
                {
                    ...dotSpace
                }
            ],
            [
                'horizontal padding',
                [
                    ['abc', 12, 'wasd'],
                    ['xy', 12345, 'qwe'],
                ],
                [
                    '.abc..12.....wasd.',
                    '.xy...12345..qwe..'
                ],
                {
                    ...padding(0, 1),
                    ...dotSpace
                }
            ],
            [
                'vartical and horizontal padding',
                [
                    ['abc', 12, 'wasd'],
                    ['xy', 12345, ['qwe', 1234]],
                ],
                [
                    '..................',
                    '.abc..12.....wasd.',
                    '..................',
                    '..................',
                    '.xy...12345..qwe..',
                    '.............1234.',
                    '..................'
                ],
                {
                    ...padding(1),
                    ...dotSpace
                }
            ],
            [
                'horizontal padding with width',
                [
                    ['abc', 12, 'wasd'],
                    ['xy', 12345, 'qwe'],
                ],
                [
                    '.abc..12...was.',
                    '.xy...123..qwe.'
                ],
                {
                    ...padding(0, 1),
                    width: 5,
                    ...dotSpace
                }
            ],
        ] as [string, Data, string[], TopLevelStyles][]).forEach(([title, data, result, styles]) => {
            it(title, () => {
                strictEqual(new Renderer().toString(new StyledTable(data, styles)), result.join('\n'));
            });
        });
    });

    describe('AlignRenderer', () => {
        const Renderer = AlignRenderer(FlexSizeRenderer(GenericBufferedRenderer(PrintLineBuffer)));
        ([
            [
                'no align',
                [
                    ['abc', 12, 'wasd'],
                    ['xy', 12345, 'qwe'],
                ],
                [
                    'abc12...wasd',
                    'xy.12345qwe.'
                ],
                {
                    ...dotSpace
                }
            ],
            [
                'horizontal align',
                [
                    ['abc', 12, 'qwe'],
                    ['xy', [1234, 567], 'as'],
                ],
                [
                    '..abc......12.....qwe...',
                    '......xy1234....as......',
                    '........567.............',
                ],
                {
                    width: 8,
                    columns: {
                        0: {
                            align: 'right'
                        }
                    },
                    rows: {
                        0: {
                            align: 'center'
                        }
                    },
                    ...dotSpace
                }
            ],
            [
                'vertical align',
                [
                    [['abc', 'cde', 'ef'], [12, 3456], 'qwe'],
                    ['xy', 'aaa', 'as'],
                ],
                [
                    '.......qwe',
                    '...12.....',
                    'abc3456...',
                    'cde.......',
                    'ef........',
                    '.......as.',
                    '..........',
                    '...aaa....',
                    '..........',
                    'xy........'
                ],
                {
                    height: 5,
                    columns: {
                        0: {
                            verticalAlign: 'bottom'
                        },
                        1: {
                            verticalAlign: 'middle'
                        }
                    },
                    ...dotSpace
                }
            ]
        ] as [string, Data, string[], TopLevelStyles][]).forEach(([title, data, result, styles]) => {
            it(title, () => {
                strictEqual(new Renderer().toString(new StyledTable(data, styles)), result.join('\n'));
            });
        });
    });

    describe('BorderRenderer', () => {
        const Renderer = BorderRenderer(FlexSizeRenderer(GenericBufferedRenderer(PrintLineBuffer)));
        ([
            [
                'default',
                [
                    ['abc', 12, 'wasd'],
                    ['xy', [123, 4567], 'qwe'],
                ],
                [
                    '┌───┬────┬────┐',
                    '│abc│12..│wasd│',
                    '├───┼────┼────┤',
                    '│xy.│123.│qwe.│',
                    '│...│4567│....│',
                    '└───┴────┴────┘'
                ],
                {
                    borderCharacters: single,
                    ...border(true),
                    ...dotSpace
                }
            ],
            [
                'no borderCharacters',
                [
                    ['abc', 12, 'wasd'],
                    ['xy', 12345, 'qwe'],
                ],
                [
                    '................',
                    '.abc.12....wasd.',
                    '................',
                    '.xy..12345.qwe..',
                    '................'
                ],
                {
                    ...border(true),
                    ...dotSpace
                }
            ],
            [
                'no dorders',
                [
                    ['abc', 12, 'wasd'],
                    ['xy', [123, 4567], 'qwe'],
                ],
                [
                    'abc12..wasd',
                    'xy.123.qwe.',
                    '...4567....'
                ],
                {
                    borderCharacters: single,
                    ...border(false),
                    ...dotSpace
                }
            ],
            [
                'mixed borderCharacters',
                [
                    ['abc', 12, 'wasd'],
                    ['xy', 12345, 'qwe'],
                    ['asd', 111, 'ww']
                ],
                [
                    '╔═══╤═════╤════╗',
                    '║abc│12...│wasd║',
                    '╟───┼─────┼────╢',
                    '║xy.│12345│qwe.║',
                    '╟───┼─────┼────╢',
                    '║asd│111..│ww..║',
                    '╚═══╧═════╧════╝'
                ],
                {
                    borderCharacters: borderCharacters(
                        '═', '═', '─',
                        '║', '║', '│',
                        '╔', '╤', '╗',
                        '╟', '┼', '╢',
                        '╚', '╧', '╝',
                    ),
                    ...border(true),
                    ...dotSpace
                }
            ],
            [
                'custom borders',
                [
                    ['h1', 'h2', 'h3'],
                    ['d11', 'd12', 'd13'],
                    ['d21', 'd22', 'd23'],
                    ['d31', 'd32', 'd33'],
                ],
                [
                    '┌───┬───┬───┐',
                    '│h1.│h2.│h3.│',
                    '├───┼───┼───┤',
                    '│d11│d12│d13│',
                    '│d21│d22│d23│',
                    '│d31│d32│d33│',
                    '└───┴───┴───┘'
                ],
                {
                    borderCharacters: single,
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
                    ...dotSpace
                }
            ],
            [
                'custom borders (reversed)',
                [
                    ['h1', 'h2', 'h3'],
                    ['d11', 'd12', 'd13'],
                    ['d21', 'd22', 'd23'],
                    ['d31', 'd32', 'd33'],
                ],
                [
                    '┌───┬──────┐',
                    '│h1.│h2.h3.│',
                    '├───┼──────┤',
                    '│d11│d12d13│',
                    '├───┼──────┤',
                    '│d21│d22d23│',
                    '├───┼──────┤',
                    '│d31│d32d33│',
                    '└───┴──────┘'
                ],
                {
                    borderCharacters: single,
                    rows() {
                        return {
                            borderTop: true,
                            borderBottom: true
                        }
                    },
                    columns: {
                        0: {
                            borderLeft: true,
                            borderRight: true
                        },
                        [-1]: {
                            borderRight: true
                        }
                    },
                    ...dotSpace
                }
            ],
            [
                'tictactoe',
                [
                    ['X', 'O', ''],
                    ['O', 'X', 'X'],
                    ['O', 'X', 'O']
                ],
                [
                    'X│O│.',
                    '─┼─┼─',
                    'O│X│X',
                    '─┼─┼─',
                    'O│X│O',
                ],
                {
                    borderCharacters: single,
                    ...border(true),
                    rows: {
                        0: {
                            borderTop: false,
                        },
                        [-1]: {
                            borderBottom: false
                        }
                    },
                    columns: {
                        0: {
                            borderLeft: false,
                        },
                        [-1]: {
                            borderRight: false
                        }
                    },
                    ...dotSpace
                }
            ],
            [
                'horizontal span',
                new Array(4).fill(null).map(_ => new Array(5).fill('.')),
                [
                    '┌─┬─┬─┬─┬─┐',
                    '│.│.│.│.│.│',
                    '├─┼─┴─┼─┼─┤',
                    '│.│...│.│.│',
                    '├─┼─┬─┼─┼─┤',
                    '│.│.│.│.│.│',
                    '├─┼─┼─┼─┼─┤',
                    '│.│.│.│.│.│',
                    '└─┴─┴─┴─┴─┘'
                ],
                {
                    borderCharacters: single,
                    ...border(true),
                    cells: {
                        1: {
                            1: {
                                borderRight: false
                            },
                            2: {
                                borderLeft: false
                            }
                        }
                    },
                    ...dotSpace
                }
            ],
            [
                'vertical span',
                new Array(4).fill(null).map(_ => new Array(5).fill('.')),
                [
                    '┌─┬─┬─┬─┬─┐',
                    '│.│.│.│.│.│',
                    '├─┼─┼─┼─┼─┤',
                    '│.│.│.│.│.│',
                    '├─┤.├─┼─┼─┤',
                    '│.│.│.│.│.│',
                    '├─┼─┼─┼─┼─┤',
                    '│.│.│.│.│.│',
                    '└─┴─┴─┴─┴─┘'
                ],
                {
                    borderCharacters: single,
                    ...border(true),
                    cells: {
                        1: {
                            1: {
                                borderBottom: false
                            }
                        },
                        2: {
                            1: {
                                borderTop: false
                            }
                        }
                    },
                    ...dotSpace
                }
            ],
            [
                'snake span',
                new Array(4).fill(null).map(_ => new Array(5).fill('.')),
                [
                    '┌─┬─┬─┬─┬─┐',
                    '│.│.│.│.│.│',
                    '├─┼─┴─┼─┼─┤',
                    '│.│...│.│.│',
                    '├─┤.┌─┼─┼─┤',
                    '│.│.│.│.│.│',
                    '├─┼─┼─┼─┼─┤',
                    '│.│.│.│.│.│',
                    '└─┴─┴─┴─┴─┘'
                ],
                {
                    borderCharacters: single,
                    ...border(true),
                    cells: {
                        1: {
                            1: {
                                borderBottom: false,
                                borderRight: false
                            },
                            2: {
                                borderLeft: false
                            }
                        },
                        2: {
                            1: {
                                borderTop: false
                            }
                        }
                    },
                    ...dotSpace
                }
            ],
        ] as [string, Data, string[], TopLevelStyles][]).forEach(([title, data, result, styles]) => {
            it(title, () => {
                strictEqual(new Renderer().toString(new StyledTable(data, styles)), result.join('\n'));
            });
        });
    });

    describe('ColorRenderer', () => {
        const Renderer = ColorRenderer(FlexSizeRenderer(GenericBufferedRenderer(BreakPrintLineBuffer)));
        ([
            [
                'no color',
                [
                    ['abc', 12, 'wasd'],
                    ['xy', 12345, 'qwe'],
                ],
                [
                    'abc12...wasd',
                    'xy.12345qwe.'
                ],
                {
                    ...dotSpace
                }
            ],
            [
                'global color',
                [
                    ['abc', 12, 'wasd'],
                    ['xy', 12345, 'qwe'],
                ],
                [
                    `${color.yellow}abc${color.reset}${color.yellow}12${color.reset}...${color.yellow}wasd${color.reset}`,
                    `${color.yellow}xy${color.reset}.${color.yellow}12345${color.reset}${color.yellow}qwe${color.reset}.`
                ],
                {
                    color: color.yellow,
                    ...dotSpace
                }
            ],
            [
                'mixed colors',
                [
                    ['abc', 12, 'wasd'],
                    ['xy', 12345, 'qwe'],
                ],
                [
                    `${color.yellow}abc${color.reset}${color.yellow}12${color.reset}...${color.yellow}wasd${color.reset}`,
                    `xy.${color.red}${color.bgCyan}12345${color.reset}qwe.`
                ],
                {
                    rows: {
                        0: {
                            color: color.yellow
                        }
                    },
                    columns: {
                        1: {
                            color: `${color.red}${color.bgCyan}`
                        }
                    },
                    ...dotSpace
                }
            ]
        ] as [string, Data, string[], TopLevelStyles][]).forEach(([title, data, result, styles]) => {
            it(title, () => {
                strictEqual(new Renderer().toString(new StyledTable(data, styles)), result.join('\n'));
            });
        });
    });

    describe('BackgroundColorRenderer', () => {
        const Renderer = BackgroundColorRenderer(FlexSizeRenderer(GenericBufferedRenderer(BreakPrintLineBuffer)));
        ([
            [
                'no color',
                [
                    ['abc', 12, 'wasd'],
                    ['xy', 12345, 'qwe'],
                ],
                [
                    'abc12...wasd',
                    'xy.12345qwe.'
                ],
                {
                    ...dotSpace
                }
            ],
            [
                'global color',
                [
                    ['abc', 12, 'wasd'],
                    ['xy', 12345, 'qwe'],
                ],
                [
                    `${color.bgYellow}abc12...wasd${color.reset}`,
                    `${color.bgYellow}xy.12345qwe.${color.reset}`
                ],
                {
                    backgroundColor: color.bgYellow,
                    ...dotSpace
                }
            ],
            [
                'mixed colors',
                [
                    ['abc', 12, 'wasd'],
                    ['xy', 12345, 'qwe'],
                ],
                [
                    `${color.bgYellow}abc${color.reset}${color.bgGreen}12...${color.reset}${color.bgYellow}wasd${color.reset}`,
                    `${color.bgYellow}xy.12345qwe.${color.reset}`
                ],
                {
                    backgroundColor: color.bgYellow,
                    cells: {
                        0: {
                            1: {
                                backgroundColor: color.bgGreen
                            }
                        }
                    },
                    ...dotSpace
                }
            ]
        ] as [string, Data, string[], TopLevelStyles][]).forEach(([title, data, result, styles]) => {
            it(title, () => {
                strictEqual(new Renderer().toString(new StyledTable(data, styles)), result.join('\n'));
            });
        });
    });

    describe('PrettyCropRenderer', () => {
        function PrettyCropRenderer<TBuffer extends AbstractPrintLineBuffer>(BufferedRenderer: Constructor<FlexSizeRenderer<TBuffer>>) {
            return class extends BufferedRenderer {
                fillLine(buffer: TBuffer, x: number, y: number, content: string, width: number, cell: StyledCell, computedStyles: ComputedCellStyles) {
                    super.fillLine(buffer, x, y, crop(content, width, cell.style.get('crop')), width, cell, computedStyles);
                }
            };
        }

        function crop(content: string, width: number, cropString = '') {
            return content.length > width ?
                content.substring(0, width - cropString.length) + cropString :
                content;
        }

        const Renderer = BorderRenderer(PaddingRenderer(PrettyCropRenderer(AlignRenderer(FlexSizeRenderer(GenericBufferedRenderer(PrintLineBuffer))))));

        ([
            [
                'crop',
                [
                    ['#', 'name', 'price', 'quantity', 'total'],
                    [1, 'apple', 2, 3, 6],
                    [2, 'banana', 1, 10, 10],
                    [3, 'strawberry', 3, 3, 9]
                ],
                [
                    '┌───┬────────┬───────┬──────────┬───────┐',
                    '│ # │  name  │ price │ quantity │ total │',
                    '├───┼────────┼───────┼──────────┼───────┤',
                    '│ 1 │ apple  │ 2     │ 3        │ 6     │',
                    '├───┼────────┼───────┼──────────┼───────┤',
                    '│ 2 │ banana │ 1     │ 10       │ 10    │',
                    '├───┼────────┼───────┼──────────┼───────┤',
                    '│ 3 │ stra.. │ 3     │ 3        │ 9     │',
                    '└───┴────────┴───────┴──────────┴───────┘',
                ],
                {
                    ...border(true),
                    borderCharacters: single,
                    paddingLeft: 1, paddingRight: 1,
                    crop: '..',
                    rows: {
                        0: {
                            align: 'center'
                        }
                    },
                    columns: {
                        1: {
                            width: 8
                        }
                    }
                }
            ],
        ] as [string, Data, string[], TopLevelStyles][]).forEach(([title, data, result, styles]) => {
            it(title, () => {
                strictEqual(new Renderer().toString(new StyledTable(data, styles)), result.join('\n'));
            });
        });
    });
});
