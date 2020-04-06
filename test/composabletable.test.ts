import { ok, strictEqual, deepStrictEqual } from 'assert';
import { AbstractRenderedStyledTable } from '../lib/composable/AbstractRenderedStyledTable';
import { ComposableRenderedStyledTable } from '../lib/composable/ComposableRenderedStyledTable';
import { PrintLineBuffer } from '../lib/printline/PrintLineBuffer';
import { GenericBufferedRenderer } from '../lib/renderers/GenericBufferedRenderer';
import { FlexSizeRenderer } from '../lib/renderers/FlexSizeRenderer';
import { PaddingRenderer } from '../lib/renderers/PaddingRenderer';
import { AbstractRenderer } from '../lib/renderers/AbstractRenderer';
import { BackgroundColorRenderer } from '../lib/renderers/BackgroundColorRenderer';
import { BreakPrintLineBuffer } from '../lib/printline/BreakPrintLineBuffer';
import { padding } from '../lib/styles/padding';
import * as color from '../lib/styles/color';
import { Data, TopLevelStyles } from '../lib/styledtable/StyledTable';
import { Constructor } from '../lib/util/Constructor';

describe('composable', () => {
    describe('ComposableRenderedStyledTable', () => {
        ([
            [
                'PaddingStyledTable',
                ComposableRenderedStyledTable(PrintLineBuffer, GenericBufferedRenderer, FlexSizeRenderer, PaddingRenderer),
                [
                    ['abc', 12, 'wasd'],
                    ['xy', 12345, 'qwe'],
                ],
                {
                    ...padding(1),
                    space: '.'
                },
                [
                    '..................',
                    '.abc..12.....wasd.',
                    '..................',
                    '..................',
                    '.xy...12345..qwe..',
                    '..................'
                ]
            ],
            [
                'BackgroundColorStyledTable',
                ComposableRenderedStyledTable(BreakPrintLineBuffer, GenericBufferedRenderer, FlexSizeRenderer, BackgroundColorRenderer),
                [
                    ['abc', 12, 'wasd'],
                    ['xy', 12345, 'qwe'],
                ],
                {
                    backgroundColor: color.bgYellow,
                    space: '.'
                },
                [
                    `${color.bgYellow}abc12...wasd${color.reset}`,
                    `${color.bgYellow}xy.12345qwe.${color.reset}`
                ],
            ]
        ] as [string, Constructor<AbstractRenderedStyledTable<AbstractRenderer>>, Data, TopLevelStyles, string[]][]).forEach(([title, CustomStyledTable, data, styles, result]) => {
            it(title, () => {
                strictEqual(typeof CustomStyledTable, 'function');
                const customStyledTable = new CustomStyledTable(data, styles);
                ok(customStyledTable instanceof AbstractRenderedStyledTable);
                deepStrictEqual([...customStyledTable.render()], result);
                strictEqual(customStyledTable.toString(), result.join('\n'));
            });
        });
    });
});
