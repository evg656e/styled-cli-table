import { strictEqual } from 'assert';
import { PrintLine } from '../lib/printline/PrintLine';
import { BreakPrintLine } from '../lib/printline/BreakPrintLine';
import { PrintLineBuffer } from '../lib/printline/PrintLineBuffer';
import { BreakPrintLineBuffer } from '../lib/printline/BreakPrintLineBuffer';

describe('printline', () => {
    describe('PrintLine', () => {
        ([
            ['empty', 0, ''],
            ['unfilled', 10, ' '.repeat(10)],
            ['filled normally', 10, 'abc  ab   ', [[0, 'abc'], [5, 'ab']]],
            ['filled non-string', 10, '123  null ', [[0, 123], [5, null]]],
            ['filled overlapped', 10, 'abxxxxb   ', [[0, 'abc'], [5, 'ab'], [2, 'xxxx']]],
            ['filled out of range', 10, '        ab', [[8, 'abcde']]],
            ['filled with zero width', 10, '          ', [[0, 'abc', 0]]],
            ['filled with excessive width', 10, 'abc       ', [[0, 'abc', 5]]],
            ['filled normally with width', 10, 'ab   ab   ', [[0, 'abc', 2], [5, 'ab', 2]]],
            ['filled out of range with width', 10, '        ab', [[8, 'abcde', 2]]],
        ] as [string, number, string, [number, string, number][]][]).forEach(([title, width, result, fills]) => {
            it(title, () => {
                const printLine = new PrintLine(width);
                if (fills !== undefined)
                    for (const [pos, str, width] of fills)
                        printLine.fill(pos, str, width);
                strictEqual(printLine.join(), result);
            });
        });
    });

    describe('BreakPrintLine', () => {
        ([
            ['empty', 0, ''],
            ['unfilled', 10, ' '.repeat(10)],
            ['unfilled with breaks', 10, '  [b]  [/b]      ', undefined, [[2, '[b]'], [4, '[/b]']]],
            ['unfilled with breaks (first position)', 10, '[b]          ', undefined, [[0, '[b]']]],
            ['unfilled with breaks (last position)', 10, '          [/b]', undefined, [[10, '[/b]']]],
            ['unfilled with breaks (out of range)', 10, '[b]          ', undefined, [[0, '[b]'], [11, '[/b]']]],
            ['unfilled with breaks (out of order)', 10, '[b]  [s]        [/b]', undefined, [[10, '[/b]'], [0, '[b]'], [2, '[s]']]],
            ['filled normally with breaks', 10, 'abc  [i]ab[/i]   ', [[0, 'abc'], [5, 'ab']], [[5, '[i]'], [7, '[/i]']]],
            ['filled normally with multi breaks', 10, 'abc  [i][b]ab[/b][/i]   ', [[0, 'abc'], [5, 'ab']], [[5, '[i]'], [5, '[b]'], [7, '[/b]'], [7, '[/i]']]],
        ] as [string, number, string, [number, string][] | undefined, [number, string][] | undefined][]).forEach(([title, width, result, fills, breaks]) => {
            it(title, () => {
                const printLine = new BreakPrintLine(width);
                if (fills !== undefined)
                    for (const [pos, str] of fills)
                        printLine.fill(pos, str);
                if (breaks !== undefined)
                    for (const [pos, brk] of breaks)
                        printLine.insertBreak(pos, brk);
                strictEqual(printLine.join(), result);
            });
        });
    });

    describe('PrintLineBuffer', () => {
        it('empty', () => {
            const buffer = new PrintLineBuffer('.');
            buffer.fill(0, 0, 'abc');
            strictEqual([...buffer.shift(1)].length, 0);
        });

        it('single line', () => {
            const buffer = new PrintLineBuffer('.');

            buffer.push(10, 1);
            buffer.fill(0, 0, 'abc');
            buffer.fill(8, 0, 'abc');
            buffer.fill(0, 1, 'abc');
            strictEqual([...buffer.shift(1)][0], 'abc.....ab');

            buffer.push(10, 1);
            buffer.fill(0, 0, 123);
            buffer.fill(8, 0, 'abc', 2);
            buffer.fill(0, 0, 'abc', undefined, 0);
            strictEqual([...buffer.shift(1)][0], '123.....ab');

            buffer.push(10, 1);
            buffer.fill(0, 0, ['abc', 'xyz']);
            buffer.fill(8, 0, [12, null], undefined, 1);
            strictEqual([...buffer.shift(1)][0], 'abc.....12');

            buffer.push(10, 1);
            buffer.fill(0, 0, 'abc', 5, 2);
            buffer.fill(6, 0, [12, null], 5, 2);
            strictEqual([...buffer.shift(1)][0], 'abc...12..');

            buffer.fill(0, 0, 'abc');
            strictEqual([...buffer.shift(1)].length, 0);
        });

        it('multi lines', () => {
            const buffer = new PrintLineBuffer('.');

            buffer.push(11, 2);
            buffer.fill(0, 0, 'abc');
            buffer.fill(8, 0, 'abc');
            buffer.fill(0, 1, 'xyz');
            buffer.fill(8, 2, 'abc');
            ((lines) => {
                strictEqual(lines[0], 'abc.....abc');
                strictEqual(lines[1], 'xyz........');
            })([...buffer.shift(2)]);

            strictEqual([...buffer.shift(1)].length, 0);

            buffer.push(11, 2);
            buffer.fill(0, 0, ['abc', 'xyz']);
            buffer.fill(8, 0, [123, 456, 789]);
            ((lines) => {
                strictEqual(lines[0], 'abc.....123');
                strictEqual(lines[1], 'xyz.....456');
            })([...buffer.shift(2)]);

            buffer.push(10, 3);
            buffer.fill(8, 1, ['abc', 'xyz', 'wasd'], 2, 2);
            buffer.fill(0, 0, [123, 456], 4, 4);
            ((lines) => {
                strictEqual(lines[0], '123.......');
                strictEqual(lines[1], '456.....ab');
                strictEqual(lines[2], '........xy');
            })([...buffer.shift(3)]);
        });
    });

    describe('BreakPrintLineBuffer', () => {
        const buffer = new BreakPrintLineBuffer('.');

        it('empty', () => {
            buffer.fill(0, 0, 'abc');
            buffer.insertBreak(0, 0, '[b]');

            strictEqual([...buffer.shift(1)].length, 0);
        });

        it('single line', () => {
            buffer.push(10, 1);

            buffer.fill(0, 0, 'abc');
            buffer.insertBreak(0, 0, '[b]');
            buffer.insertBreak(3, 0, '[/b]');
            buffer.fill(8, 0, 'abc');
            buffer.insertBreak(8, 0, '[s]');
            buffer.insertBreak(11, 0, '[/s]');
            buffer.fill(0, 1, 'abc');
            buffer.insertBreak(0, 1, '[b]');

            strictEqual([...buffer.shift(1)][0], '[b]abc[/b].....[s]ab');

            buffer.fill(0, 0, 'abc');
            buffer.insertBreak(0, 0, '[b]');

            strictEqual([...buffer.shift(1)].length, 0);
        });

        it('multi lines', () => {
            buffer.push(11, 2);

            buffer.fill(0, 0, 'abc');
            buffer.insertBreak(0, 0, '[b]');
            buffer.insertBreak(3, 0, '[/b]');
            buffer.fill(8, 0, 'abc');
            buffer.insertBreak(8, 0, '[s]');
            buffer.insertBreak(11, 0, '[/s]');
            buffer.fill(0, 1, 'abc');
            buffer.insertBreak(0, 1, '[b]');
            buffer.insertBreak(3, 1, '[/b]');
            buffer.fill(8, 2, 'abc');
            buffer.insertBreak(0, 2, '[b]');

            ((lines) => {
                strictEqual(lines[0], '[b]abc[/b].....[s]abc[/s]');
                strictEqual(lines[1], '[b]abc[/b]........');
            })([...buffer.shift(2)]);

            strictEqual([...buffer.shift(1)].length, 0);
        });
    });
});
