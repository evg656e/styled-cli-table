import type { Styles } from '../styledtable/Style';
import type { PrintLine } from '../printline/PrintLine';
import type { AbstractPrintLineBuffer } from '../printline/AbstractPrintLineBuffer';
import type { StyledTable, StyledCell, IterableRow } from '../styledtable/StyledTable';
import { AbstractRenderer } from './AbstractRenderer';

export interface ComputedTopLevelStyles {
    rows: ArrayLike<Styles>;
    columns: ArrayLike<Styles>;
}

export interface ComputedRowStyles extends ComputedTopLevelStyles {
    row: Styles;
}

export interface ComputedColumnStyles extends ComputedTopLevelStyles {
    column: Styles;
}

export interface ComputedCellStyles extends ComputedRowStyles, ComputedColumnStyles { }

export abstract class AbstractBufferedRenderer<TBuffer extends AbstractPrintLineBuffer<TPrintLine>, TPrintLine extends PrintLine = PrintLine> extends AbstractRenderer {
    abstract createBuffer(space?: string): TBuffer;

    initComputedStyles(computedStyles: Styles) {
        computedStyles.rows = { length: 0 };
        computedStyles.columns = { length: 0 };
    }

    computeStyles(cell: StyledCell, computedStyles: ComputedCellStyles) {
    }

    getRowWidth(computedStyles: Styles) {
        let ret = 0;
        const columns = computedStyles.columns;
        for (let columnIndex = 0; columnIndex < columns.length; columnIndex++) {
            computedStyles.column = columns[columnIndex];
            ret += this.getColumnWidth(columnIndex, computedStyles as ComputedColumnStyles);
        }
        return ret;
    }

    getRowHeight(row: IterableRow, computedStyles: ComputedRowStyles) {
        return 0;
    }

    getColumnWidth(columnIndex: number, computedStyles: ComputedColumnStyles) {
        return 0;
    }

    getCellWidth({ columnIndex }: StyledCell, computedStyles: ComputedCellStyles) {
        return this.getColumnWidth(columnIndex, computedStyles);
    }

    getRowShift(row: IterableRow, computedStyles: ComputedRowStyles) {
        return this.getRowHeight(row, computedStyles);
    }

    getContent({ style, value }: StyledCell) {
        return style.get('content') ?? value;
    }

    fillLine(buffer: TBuffer, x: number, y: number, content: string, width: number, cell: StyledCell, computedStyles: ComputedCellStyles) {
        buffer.fillLine(x, y, content, width);
    }

    fillBlock(buffer: TBuffer, x: number, y: number, content: any[], width: number, height: number, cell: StyledCell, computedStyles: ComputedCellStyles) {
        height = Math.min(height, content.length, buffer.height - y);
        for (let i = 0; i < height; i++)
            this.fillLine(buffer, x, y++, String(content[i]), width, cell, computedStyles);
    }

    fillBuffer(buffer: TBuffer, x: number, y: number, width: number, height: number, cell: StyledCell, computedStyles: ComputedCellStyles) {
        const content = this.getContent(cell);
        this.fillBlock(buffer, x, y, Array.isArray(content) ? content : [content], width, height, cell, computedStyles);
    }

    *render(styledTable: StyledTable) {
        const computedStyles: Styles = {};
        this.initComputedStyles(computedStyles);

        for (const row of styledTable.rows()) {
            const rows = computedStyles.rows;
            computedStyles.row = rows[rows.length++] = {};
            for (const cell of row.cells()) {
                const columns = computedStyles.columns;
                computedStyles.column = columns[cell.columnIndex] ?? (columns[columns.length++] = {});
                this.computeStyles(cell, computedStyles as ComputedCellStyles);
            }
        }

        const buffer = this.createBuffer(styledTable.style.get('space'));
        const rowWidth = this.getRowWidth(computedStyles as ComputedTopLevelStyles);
        for (const row of styledTable.rows()) {
            computedStyles.row = computedStyles.rows[row.rowIndex];
            const rowHeight = this.getRowHeight(row, computedStyles as ComputedRowStyles);
            const y = buffer.height;
            buffer.push(rowWidth, rowHeight);
            const height = rowHeight;
            let x = 0;
            for (const cell of row.cells()) {
                computedStyles.column = computedStyles.columns[cell.columnIndex];
                const width = this.getCellWidth(cell, computedStyles as ComputedCellStyles);
                this.fillBuffer(buffer, x, y, width, height, cell, computedStyles as ComputedCellStyles);
                x += width;
            }
            const n = this.getRowShift(row, computedStyles as ComputedRowStyles);
            if (n !== 0)
                yield* buffer.shift(n);
        }

        if (buffer.height !== 0)
            yield* buffer.shift(buffer.height);
    }
}
