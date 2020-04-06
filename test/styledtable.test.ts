import { strictEqual, deepStrictEqual, deepEqual } from 'assert';
import { Style, Styles } from '../lib/styledtable/Style';
import { StyledTable, Data, TopLevelStyles } from '../lib/styledtable/StyledTable';

describe('styledtable', () => {
    describe('Style', () => {
        const globalStyle = { padLeft: 2, padRight: 2, align: 'center' };
        const localStyle = { padRight: 4, width: 20 };

        describe('#get', () => {
            ([
                ['non exists', [globalStyle], 'width', undefined],
                ['exists', [globalStyle], 'padRight', 2],
                ['exists deep', [globalStyle, localStyle], 'width', 20],
            ] as [string, Styles[], string, any][]).forEach(([title, styles, key, result]) => {
                it(title, () => {
                    strictEqual(new Style(styles).get(key), result);
                });
            });
        });

        describe('#pick', () => {
            const keys = ['width', 'padLeft', 'padRight', 'align'];
            ([
                ['empty', [], keys, {}],
                ['global', [globalStyle], keys, { padLeft: 2, padRight: 2, align: 'center' }],
                ['one key', [globalStyle], 'padLeft', { padLeft: 2 }],
                ['cascading', [globalStyle, localStyle], keys, { padLeft: 2, padRight: 4, align: 'center', width: 20 }],
            ] as [string, Styles[], string[], Styles][]).forEach(([title, styles, keys, result]) => {
                it(title, () => {
                    deepStrictEqual(new Style(styles).pick(keys), result);
                });
            });
        });

        describe('#fork', () => {
            const keys = ['align', 'width'];
            it('simple', () => {
                const style = new Style([globalStyle]);
                deepStrictEqual(style.pick(keys), { align: 'center' });
                const localStyles = style.fork(localStyle, { align: 'left' });
                deepStrictEqual(localStyles.pick(keys), { align: 'left', width: 20 });
                deepStrictEqual(style.pick(keys), { align: 'center' });
            });
        });
    });

    describe('StyledTable', () => {
        describe('iterate', () => {
            ([
                [
                    'normal',
                    [
                        [1, 2, 3],
                        [4, 5, 6]
                    ]
                ],
                [
                    'various rows',
                    [
                        [1, 2, 3],
                        [4, 5, 6, 7],
                        [8, 9]
                    ]
                ],
                [
                    'empty cols',
                    [
                        [],
                        [],
                    ]
                ],
                [
                    'empty', []
                ]
            ] as [string, Data][]).forEach(([title, data]) => {
                it(title, () => {
                    let rowIndex = 0;
                    for (const { cells, ...row } of new StyledTable(data).rows()) {
                        deepStrictEqual(row, {
                            rowIndex,
                            reverseRowIndex: rowIndex - data.length,
                            data
                        });
                        const dataRow = data[rowIndex];
                        let columnIndex = 0;
                        for (const { style, ...cell } of cells()) {
                            deepStrictEqual(cell, {
                                rowIndex,
                                columnIndex,
                                reverseRowIndex: rowIndex - data.length,
                                reverseColumnIndex: columnIndex - dataRow.length,
                                data,
                                value: dataRow[columnIndex]
                            });
                            columnIndex++;
                        }
                        strictEqual(columnIndex, dataRow.length);
                        rowIndex++;
                    }
                    strictEqual(rowIndex, data.length);
                });
            });
        });

        describe('styles', () => {
            const keys = ['width', 'align', 'content'];
            ([
                [
                    'empty',
                    [
                        [1, 2, 3],
                        [4, 5, 6]
                    ],
                    undefined,
                    [
                        [{}, {}, {}],
                        [{}, {}, {}]
                    ]
                ],
                [
                    'global',
                    [
                        [1, 2, 3],
                        [4, 5, 6]
                    ],
                    { width: 40 },
                    [
                        [{ width: 40 }, { width: 40 }, { width: 40 }],
                        [{ width: 40 }, { width: 40 }, { width: 40 }]
                    ]
                ],
                [
                    'global+rows',
                    [
                        [1, 2, 3],
                        [4, 5, 6]
                    ],
                    {
                        width: 40,
                        rows: {
                            0: { align: 'center' }
                        }
                    },
                    [
                        [{ width: 40, align: 'center' }, { width: 40, align: 'center' }, { width: 40, align: 'center' }],
                        [{ width: 40 }, { width: 40 }, { width: 40 }]
                    ]
                ],
                [
                    'global+rows(last)',
                    [
                        [1, 2, 3],
                        [4, 5, 6]
                    ],
                    {
                        width: 40,
                        rows: {
                            [-1]: { align: 'center' }
                        }
                    },
                    [
                        [{ width: 40 }, { width: 40 }, { width: 40 }],
                        [{ width: 40, align: 'center' }, { width: 40, align: 'center' }, { width: 40, align: 'center' }]
                    ]
                ],
                [
                    'global+rows(functional)',
                    [
                        [1, 2, 3],
                        [4, 5, 6]
                    ],
                    {
                        width: 40,
                        rows({ rowIndex }) {
                            return rowIndex === 0 ? { align: 'center' } : undefined;
                        }
                    } as TopLevelStyles,
                    [
                        [{ width: 40, align: 'center' }, { width: 40, align: 'center' }, { width: 40, align: 'center' }],
                        [{ width: 40 }, { width: 40 }, { width: 40 }]
                    ]
                ],
                [
                    'global+columns',
                    [
                        [1, 2, 3],
                        [4, 5, 6]
                    ],
                    {
                        width: 40,
                        columns: {
                            0: {
                                align: 'right'
                            }
                        }
                    },
                    [
                        [{ width: 40, align: 'right' }, { width: 40 }, { width: 40 }],
                        [{ width: 40, align: 'right' }, { width: 40 }, { width: 40 }]
                    ]
                ],
                [
                    'global+columns(last)',
                    [
                        [1, 2, 3],
                        [4, 5, 6]
                    ],
                    {
                        width: 40,
                        columns: {
                            [-1]: {
                                align: 'right'
                            }
                        }
                    },
                    [
                        [{ width: 40 }, { width: 40 }, { width: 40, align: 'right' }],
                        [{ width: 40 }, { width: 40 }, { width: 40, align: 'right' }]
                    ]
                ],
                [
                    'global+columns(functional)',
                    [
                        [1, 2, 3],
                        [4, 5, 6]
                    ],
                    {
                        width: 40,
                        columns({ columnIndex, data }) {
                            return Math.trunc(data[0].length / 2) === columnIndex ? { align: 'right' } : undefined;
                        }
                    } as TopLevelStyles,
                    [
                        [{ width: 40 }, { width: 40, align: 'right' }, { width: 40 }],
                        [{ width: 40 }, { width: 40, align: 'right' }, { width: 40 }]
                    ]
                ],
                [
                    'global+cells',
                    [
                        ['a', 'b', 3],
                        [4, 5, 6]
                    ],
                    {
                        width: 40,
                        cells: {
                            0: {
                                0: {
                                    align: 'left'
                                },
                                1: {
                                    width: 60
                                }
                            },
                            [-1]: {
                                [-1]: {
                                    align: 'right',
                                    width: 60
                                }
                            }
                        }
                    },
                    [
                        [{ width: 40, align: 'left' }, { width: 60 }, { width: 40 }],
                        [{ width: 40 }, { width: 40 }, { width: 60, align: 'right' }]
                    ]
                ],
                [
                    'global+cells(functional)',
                    [
                        ['a', 'b', 3],
                        [4, 5, 6]
                    ],
                    {
                        width: 40,
                        cells({ value }) {
                            return { content: typeof value === 'string' ? `'${value}'` : value };
                        }
                    } as TopLevelStyles,
                    [
                        [{ width: 40, content: '\'a\'' }, { width: 40, content: '\'b\'' }, { width: 40, content: 3 }],
                        [{ width: 40, content: 4 }, { width: 40, content: 5 }, { width: 40, content: 6 }]
                    ]
                ],
                [
                    'cascade',
                    [
                        ['a', 1, 2, 3],
                        ['b', 4, 5, 6],
                        ['c', 7, 8, 9]
                    ],
                    {
                        width: 40,
                        columns: {
                            0: {
                                align: 'left',
                                width: 60
                            }
                        },
                        rows: {
                            0: {
                                align: 'right'
                            }
                        },
                        cells: {
                            0: {
                                0: {
                                    align: 'center'
                                }
                            }
                        }
                    },
                    [
                        [{ width: 60, align: 'center' }, { width: 40, align: 'right' }, { width: 40, align: 'right' }, { width: 40, align: 'right' }],
                        [{ width: 60, align: 'left' }, { width: 40 }, { width: 40 }, { width: 40 }],
                        [{ width: 60, align: 'left' }, { width: 40 }, { width: 40 }, { width: 40 }],
                    ]
                ]
            ] as [string, Data, Styles, Styles[]][]).forEach(([title, data, styles, expectedStyles]) => {
                it(title, () => {
                    const actualStyles: Styles[][] = [];
                    for (const row of new StyledTable(data, styles).rows()) {
                        const rowStyles: Styles[] = [];
                        actualStyles.push(rowStyles);
                        for (const { style } of row.cells())
                            rowStyles.push(style.pick(keys));
                    }
                    deepEqual(actualStyles, expectedStyles);
                });
            });
        });
    });
});
