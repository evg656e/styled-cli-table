import { reset } from '../styles/color';
import type { Constructor } from '../util/Constructor';
import type { BreakPrintLineBuffer } from '../printline/BreakPrintLineBuffer';
import type { StyledCell } from '../styledtable/StyledTable';
import type { ComputedCellStyles } from './AbstractBufferedRenderer';
import type { FlexSizeRenderer } from './FlexSizeRenderer';

export function ColorRenderer<TBuffer extends BreakPrintLineBuffer>(BufferedRenderer: Constructor<FlexSizeRenderer<TBuffer>>) {
    return class extends BufferedRenderer {
        fillLine(buffer: TBuffer, x: number, y: number, content: string, width: number, cell: StyledCell, computedStyles: ComputedCellStyles) {
            const color = cell.style.get('color');
            if (color !== undefined) {
                const lines = buffer.lines;
                if (y < lines.length) {
                    const line = lines[y];
                    const contentEnd = x + Math.min(content.length, width);
                    const index = line.insertBreak(x, color);
                    line.insertBreak(contentEnd, reset);
                    const prevColor = line.breaks[index - 1]?.[1] ?? reset;
                    if (prevColor !== reset) // restore the previous color, if any
                        line.insertBreak(contentEnd, prevColor);
                }
            }
            super.fillLine(buffer, x, y, content, width, cell, computedStyles);
        }
    };
}
