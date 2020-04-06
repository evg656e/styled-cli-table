import { reset } from '../styles/color';
import type { Constructor } from '../util/Constructor';
import type { BreakPrintLineBuffer } from '../printline/BreakPrintLineBuffer';
import type { StyledCell } from '../styledtable/StyledTable';
import type { ComputedCellStyles } from './AbstractBufferedRenderer';
import type { FlexSizeRenderer } from './FlexSizeRenderer';

export function BackgroundColorRenderer<TBuffer extends BreakPrintLineBuffer>(BufferedRenderer: Constructor<FlexSizeRenderer<TBuffer>>) {
    return class extends BufferedRenderer {
        fillBlock(buffer: TBuffer, x: number, y: number, content: any[], width: number, height: number, cell: StyledCell, computedStyles: ComputedCellStyles) {
            const backgroundColor = cell.style.get('backgroundColor');
            if (backgroundColor !== undefined) {
                const lines = buffer.lines;
                const blockEnd = x + width;
                let currY = y;
                while (currY < lines.length) {
                    const line = lines[currY++];
                    const breaks = line.breaks;
                    const index = line.insertBreak(x, backgroundColor);
                    line.insertBreak(blockEnd, reset);
                    if (index > 1) {
                        const prevColor = breaks[index - 1][1];
                        const prevPrevColor = breaks[index - 2][1];
                        if (prevColor === reset && prevPrevColor === backgroundColor) // prolongate previous color, if the same
                            breaks.splice(index - 1, 2);
                    }
                }
            }
            super.fillBlock(buffer, x, y, content, width, height, cell, computedStyles);
        }
    };
}
