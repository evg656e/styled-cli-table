import { deepStrictEqual, throws } from 'assert';
import { padding, Padding } from '../lib/styles/padding';
import { Border, border, BorderCharacter, borderCharacters } from '../lib/styles/border';

describe('styles', () => {
    describe('padding', () => {
        ([
            ['no args', [], { paddingTop: 0, paddingRight: 0, paddingBottom: 0, paddingLeft: 0 }],
            ['one arg 0', [0], { paddingTop: 0, paddingRight: 0, paddingBottom: 0, paddingLeft: 0 }],
            ['one arg 10', [10], { paddingTop: 10, paddingRight: 10, paddingBottom: 10, paddingLeft: 10 }],
            ['two args', [10, 20], { paddingTop: 10, paddingRight: 20, paddingBottom: 10, paddingLeft: 20 }],
            ['three args', [10, 20, 30], { paddingTop: 10, paddingRight: 20, paddingBottom: 30, paddingLeft: 20 }],
            ['four args', [10, 20, 30, 40], { paddingTop: 10, paddingRight: 20, paddingBottom: 30, paddingLeft: 40 }],
            ['exceed args', [10, 20, 30, 40, 50], { paddingTop: 10, paddingRight: 20, paddingBottom: 30, paddingLeft: 40 }],
        ] as [string, number[], Padding][]).forEach(([title, args, expected]) => {
            it(title, () => {
                deepStrictEqual((<any>padding)(...args), expected);
            });
        });
    });

    describe('border', () => {
        describe('border', () => {
            ([
                ['no args', [], { borderTop: false, borderRight: false, borderBottom: false, borderLeft: false }],
                ['one arg true', [true], { borderTop: true, borderRight: true, borderBottom: true, borderLeft: true }],
                ['two args', [true, false], { borderTop: true, borderRight: false, borderBottom: true, borderLeft: false }],
                ['three args', [true, false, true], { borderTop: true, borderRight: false, borderBottom: true, borderLeft: false }],
                ['four args', [true, false, true, false], { borderTop: true, borderRight: false, borderBottom: true, borderLeft: false }],
            ] as [string, boolean[], Border][]).forEach(([title, args, expected]) => {
                it(title, () => {
                    deepStrictEqual((<any>border)(...args), expected);
                });
            });
        });

        describe('characters', () => {
            it('11 chars', () => {
                deepStrictEqual(borderCharacters(
                    '─', '│',
                    '┌', '┬', '┐',
                    '├', '┼', '┤',
                    '└', '┴', '┘',
                ), {
                    [BorderCharacter.top]: '─',
                    [BorderCharacter.bottom]: '─',
                    [BorderCharacter.middle]: '─',
                    [BorderCharacter.left]: '│',
                    [BorderCharacter.right]: '│',
                    [BorderCharacter.center]: '│',
                    [BorderCharacter.topLeft]: '┌',
                    [BorderCharacter.topCenter]: '┬',
                    [BorderCharacter.topRight]: '┐',
                    [BorderCharacter.middleLeft]: '├',
                    [BorderCharacter.middleCenter]: '┼',
                    [BorderCharacter.middleRight]: '┤',
                    [BorderCharacter.bottomLeft]: '└',
                    [BorderCharacter.bottomCenter]: '┴',
                    [BorderCharacter.bottomRight]: '┘'
                });
            });

            it('15 chars', () => {
                deepStrictEqual(borderCharacters(
                    '═', '┅', '─',
                    '║', '┇', '│',
                    '┌', '┬', '┐',
                    '├', '┼', '┤',
                    '└', '┴', '┘',
                ), {
                    [BorderCharacter.top]: '═',
                    [BorderCharacter.bottom]: '┅',
                    [BorderCharacter.middle]: '─',
                    [BorderCharacter.left]: '║',
                    [BorderCharacter.right]: '┇',
                    [BorderCharacter.center]: '│',
                    [BorderCharacter.topLeft]: '┌',
                    [BorderCharacter.topCenter]: '┬',
                    [BorderCharacter.topRight]: '┐',
                    [BorderCharacter.middleLeft]: '├',
                    [BorderCharacter.middleCenter]: '┼',
                    [BorderCharacter.middleRight]: '┤',
                    [BorderCharacter.bottomLeft]: '└',
                    [BorderCharacter.bottomCenter]: '┴',
                    [BorderCharacter.bottomRight]: '┘'
                });
            });

            it('invalid number of chars', () => {
                throws(() => {
                    borderCharacters(
                        '┌', '┬', '┐',
                        '├', '┼', '┤',
                        '└', '┴', '┘',
                    );
                });
            });
        });
    });
});
