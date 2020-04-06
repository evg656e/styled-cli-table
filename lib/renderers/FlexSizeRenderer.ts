import { bound } from '../util/bound';
import type { Constructor } from '../util/Constructor';
import type { AbstractPrintLineBuffer } from '../printline/AbstractPrintLineBuffer';
import type { StyledCell, IterableRow } from '../styledtable/StyledTable';
import type { ComputedRowStyles, ComputedColumnStyles, ComputedCellStyles } from './AbstractBufferedRenderer';
import type { GenericBufferedRenderer } from './GenericBufferedRenderer';

export function FlexSizeRenderer<TBuffer extends AbstractPrintLineBuffer<any>>(BufferedRenderer: Constructor<GenericBufferedRenderer<TBuffer>>) {
    return class extends BufferedRenderer {
        computeContentWidth(content: any, _: StyledCell) {
            if (Array.isArray(content)) {
                let ret = 0;
                for (let i = 0; i < content.length; i++)
                    ret = Math.max(ret, String(content[i]).length);
                return ret;
            }
            return String(content).length;
        }

        computeColumnWidth(content: any, cell: StyledCell) {
            const { width, minWidth, maxWidth } = cell.style.pick(['width', 'minWidth', 'maxWidth']);
            return width ??
                bound(
                    minWidth ?? 0,
                    this.computeContentWidth(content, cell),
                    maxWidth ?? 0x7fffffff
                );
        }

        copmuteContentHeight(content: any, _: StyledCell) {
            return Array.isArray(content) ? content.length : 1;
        }

        computeRowHeight(content: any, cell: StyledCell) {
            const { height, minHeight, maxHeight } = cell.style.pick([ 'height', 'minHeight', 'maxHeight' ]);
            return height ??
                bound(
                    minHeight ?? 0,
                    this.copmuteContentHeight(content, cell),
                    maxHeight ?? 0x7fffffff
                );
        }

        computeStyles(cell: StyledCell, { row, column }: ComputedCellStyles) {
            const content = this.getContent(cell);
            row.height = Math.max(row.height ?? 0, this.computeRowHeight(content, cell));
            column.width = Math.max(column.width ?? 0, this.computeColumnWidth(content, cell));
        }

        getRowHeight(_: IterableRow, { row }: ComputedRowStyles) {
            return row.height;
        }

        getColumnWidth(_: number, { column }: ComputedColumnStyles) {
            return column.width;
        }
    };
}

export type FlexSizeRenderer<TBuffer extends AbstractPrintLineBuffer<any>> =
    InstanceType<ReturnType<typeof FlexSizeRenderer>> & GenericBufferedRenderer<TBuffer>;
