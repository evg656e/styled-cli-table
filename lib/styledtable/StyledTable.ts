import { Style, Styles } from './Style';

export type Data = any[][];

export interface Row {
    rowIndex: number,
    reverseRowIndex: number,
    data: any[][]
}

interface PartialIterableRow extends Row {
    cells?(): Generator<StyledCell, void, unknown>
}

export interface IterableRow extends Row {
    cells(): Generator<StyledCell, void, unknown>
}

export interface Cell extends Row {
    columnIndex: number,
    reverseColumnIndex: number,
    value: any
}

export interface StyledCell extends Cell {
    style: Style
}

export type FunctionalRowStyles = (row: Row) => Styles;

export type RowStyles = Styles | FunctionalRowStyles;

export type FunctionalCellStyles = (cell: Cell) => Styles;

export type CellStyles = Styles | FunctionalCellStyles;

export interface TopLevelStyles extends Styles {
    rows?: RowStyles,
    columns?: CellStyles,
    cells?: CellStyles
}

function coerceStyle(styles: Styles | FunctionalRowStyles | FunctionalCellStyles | undefined, part: Row, [index, revIndex]: typeof rowIndicies, pass?: boolean): Styles | FunctionalRowStyles | FunctionalCellStyles | undefined;
function coerceStyle(styles: Styles | FunctionalRowStyles | FunctionalCellStyles | undefined, part: Cell, [index, revIndex]: typeof rowIndicies | typeof columnIndicies, pass?: boolean): Styles | FunctionalRowStyles | FunctionalCellStyles | undefined;
function coerceStyle(styles: any, part: any, [index, revIndex]: any, pass?: any) {
    if (styles === undefined)
        return;
    if (typeof styles === 'function')
        return pass ? styles : styles(part);
    return styles[part[index]] ?? styles[part[revIndex]];
}

export class StyledTable {
    data: Data;
    style: Style;

    rowStyles: RowStyles | undefined;
    columnStyles: CellStyles | undefined;
    cellStyles: CellStyles | undefined;

    constructor(data: Data = [], styles: TopLevelStyles = {}) {
        this.data = data;
        const { rows, columns, cells, ...tableStyles } = styles;
        this.rowStyles = rows;
        this.columnStyles = columns;
        this.cellStyles = cells;
        this.style = new Style([tableStyles]);
    }

    *rows() {
        const data = this.data;
        for (let rowIndex = 0, reverseRowIndex = -data.length; reverseRowIndex !== 0; rowIndex++, reverseRowIndex++) {
            const row: PartialIterableRow = { rowIndex, reverseRowIndex, data };
            const dataRow = data[rowIndex];
            const rowStyle = coerceStyle(this.rowStyles, row as Row, rowIndicies);
            const cellsStyleRow = coerceStyle(this.cellStyles, row as Row, rowIndicies, true);
            const _this = this;
            row.cells = function* cells() {
                for (let columnIndex = 0, reverseColumnIndex = -dataRow.length; reverseColumnIndex !== 0; columnIndex++, reverseColumnIndex++) {
                    const cell: PartialStyledCell = {
                        rowIndex,
                        columnIndex,
                        reverseRowIndex,
                        reverseColumnIndex,
                        data,
                        value: dataRow[columnIndex]
                    };
                    cell.style = _this.style.fork(
                        coerceStyle(_this.columnStyles, cell as Cell, columnIndicies),
                        rowStyle,
                        coerceStyle(cellsStyleRow, cell as Cell, columnIndicies)
                    );
                    yield cell as StyledCell;
                }
            }
            yield row as IterableRow;
        }
    }
}

interface PartialStyledCell extends Cell {
    style?: Style
}

const rowIndicies = ['rowIndex', 'reverseRowIndex'] as const;
const columnIndicies = ['columnIndex', 'reverseColumnIndex'] as const;
