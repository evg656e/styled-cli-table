import { Align, VerticalAlign } from '../styles/align';
import { coerceEnum } from '../util/coerceEnum';
import type { Constructor } from '../util/Constructor';
import type { AbstractPrintLineBuffer } from '../printline/AbstractPrintLineBuffer';
import type { StyledCell } from '../styledtable/StyledTable';
import type { ComputedCellStyles } from './AbstractBufferedRenderer';
import type { FlexSizeRenderer } from './FlexSizeRenderer';

export interface AlignComputedCellStyles extends ComputedCellStyles {
    align: number;
}

export function AlignRenderer<TBuffer extends AbstractPrintLineBuffer>(BufferedRenderer: Constructor<FlexSizeRenderer<TBuffer>>) {
    return class extends BufferedRenderer {
        fillLine(buffer: TBuffer, x: number, y: number, content: string, width: number, cell: StyledCell, computedStyles: AlignComputedCellStyles) {
            const offset = getOffset(computedStyles.align, content.length, width);
            super.fillLine(buffer, x + offset, y, content, width - offset, cell, computedStyles);
        }

        fillBlock(buffer: TBuffer, x: number, y: number, content: any[], width: number, height: number, cell: StyledCell, computedStyles: AlignComputedCellStyles) {
            const { align, verticalAlign } = cell.style.pick(['align', 'verticalAlign']);
            const verticalOffset = getOffset(coerceVerticalAlign(verticalAlign), content.length, height);
            computedStyles.align = coerceAlign(align);
            super.fillBlock(buffer, x, y + verticalOffset, content, width, height - verticalOffset, cell, computedStyles);
        }
    };
}

function getOffset(align: number, contentLength: number, length: number) {
    switch (align) {
        case 3: return Math.max(0, Math.trunc((length - contentLength) / 2));
        case 2: return Math.max(0, length - contentLength);
        case 1: default: return 0;
    }
}

const coerceAlign = coerceEnum(Align);
const coerceVerticalAlign = coerceEnum(VerticalAlign);
