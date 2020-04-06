import { strictEqual, deepStrictEqual } from 'assert';
import { Align } from '../lib/styles/align';
import { coerceEnum } from '../lib/util/coerceEnum';
import { upperBound } from '../lib/util/upperBound';

describe('util', () => {
    describe('coerceEnum', () => {
        const coerceAlign = coerceEnum(Align);
        ([
            ['known lowercase name', 'left', Align.left],
            ['known name', 'Center', Align.center],
            ['unknown name', 'foo', 0 as Align],
            ['undefined', undefined, 0 as Align],
            ['known number', 2, Align.right],
            ['unknown number', 5, 5 as Align]
        ] as [string, number | string | undefined, Align][]).forEach(([title, value, result]) => {
            it(title, () => {
                strictEqual(coerceAlign(value), result);
            });
        });
    });

    describe('insertSorted', () => {
        type Pair<K, V> = [K, V];
        const comparePair = <K, V>([lhs]: Pair<K, V>, [rhs]: Pair<K, V>) => lhs < rhs ? -1 : rhs < lhs ? 1 : 0;
        ([
            ['empty', [], [1, 'a'], [[1, 'a']]],
            ['one element', [[1, 'a']], [3, 'c'], [[1, 'a'], [3, 'c']]],
            ['two elements (append)', [[1, 'a'], [3, 'c']], [5, 'e'], [[1, 'a'], [3, 'c'], [5, 'e']]],
            ['two elements (prepend)', [[1, 'a'], [3, 'c']], [-1, 'z'], [[-1, 'z'], [1, 'a'], [3, 'c']]],
            ['two elements (insert)', [[1, 'a'], [3, 'c']], [2, 'b'], [[1, 'a'], [2, 'b'], [3, 'c']]],
            ['three elements (insert equal)', [[1, 'a'], [2, 'b'], [3, 'c']], [2, 'bb'], [[1, 'a'], [2, 'b'], [2, 'bb'], [3, 'c']]],
        ] as [string, Pair<number, string>[], Pair<number, string>, Pair<number, string>[]][]).forEach(([title, array, value, result]) => {
            it(title, () => {
                const index = upperBound(array, value, comparePair);
                array.splice(index, 0, value);
                deepStrictEqual(array, result);
            });
        });
    });
});
