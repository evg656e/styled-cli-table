import { padding } from '../styles/padding';
import type { Constructor } from '../util/Constructor';
import type { AbstractPrintLineBuffer } from '../printline/AbstractPrintLineBuffer';
import type { StyledCell } from '../styledtable/StyledTable';
import type { ComputedCellStyles } from './AbstractBufferedRenderer';
import type { FlexSizeRenderer } from './FlexSizeRenderer';

export function PaddingRenderer<TBuffer extends AbstractPrintLineBuffer<any>>(BufferedRenderer: Constructor<FlexSizeRenderer<TBuffer>>) {
    return class extends BufferedRenderer {
        computeContentWidth(content: any, cell: StyledCell) {
            const { paddingLeft, paddingRight } = cell.style.pick(['paddingLeft', 'paddingRight']);
            return (paddingLeft ?? 0) + super.computeContentWidth(content, cell) + (paddingRight ?? 0);
        }

        copmuteContentHeight(content: any, cell: StyledCell) {
            const { paddingTop, paddingBottom } = cell.style.pick(['paddingTop', 'paddingBottom']);
            return (paddingTop ?? 0) + super.copmuteContentHeight(content, cell) + (paddingBottom ?? 0);
        }

        fillBlock(buffer: TBuffer, x: number, y: number, content: any[], width: number, height: number, cell: StyledCell, computedStyles: ComputedCellStyles) {
            const { paddingTop, paddingBottom, paddingLeft, paddingRight } = { ...padding(0), ...cell.style.pick(['paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom']) };
            super.fillBlock(buffer, x + paddingLeft, y + paddingTop, content, width - (paddingRight + paddingLeft), height - (paddingBottom + paddingTop), cell, computedStyles);
        }
    };
}
