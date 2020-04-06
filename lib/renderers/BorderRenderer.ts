import { BorderCharacter } from '../styles/border';
import type { Constructor } from '../util/Constructor';
import type { AbstractPrintLineBuffer } from '../printline/AbstractPrintLineBuffer';
import type { Styles } from '../styledtable/Style';
import type { StyledCell, IterableRow } from '../styledtable/StyledTable';
import type { ComputedTopLevelStyles, ComputedRowStyles, ComputedColumnStyles } from './AbstractBufferedRenderer';
import type { FlexSizeRenderer } from './FlexSizeRenderer';

export interface BorderComputedTopLevelStyles extends ComputedTopLevelStyles {
    rowJoints: number[];
    columnJoints: number[];
}

export interface BorderComputedRowStyles extends ComputedRowStyles, BorderComputedTopLevelStyles {
    currRowHeight: number;
    prevRowHeight: number;
    topHorizontalLines: boolean[];
    bottomHorizontalLines: boolean[];
    topVerticalLines: boolean[];
    bottomVerticalLines: boolean[];
}

export interface BorderComputedColumnStyles extends ComputedColumnStyles, BorderComputedTopLevelStyles { }

export interface BorderComputedCellStyles extends BorderComputedRowStyles, BorderComputedColumnStyles { }

export function BorderRenderer<TBuffer extends AbstractPrintLineBuffer<any>>(BufferedRenderer: Constructor<FlexSizeRenderer<TBuffer>>) {
    return class extends BufferedRenderer {
        initComputedStyles(computedStyles: Styles) {
            ['rowJoints', 'columnJoints', 'topHorizontalLines', 'topVerticalLines', 'bottomHorizontalLines', 'bottomVerticalLines'].forEach(key => computedStyles[key] = []);
            super.initComputedStyles(computedStyles);
        }

        computeStyles(cell: StyledCell, computedStyles: BorderComputedCellStyles) {
            const { rowIndex, columnIndex, style } = cell;
            const { rowJoints, columnJoints } = computedStyles;
            const { borderTop, borderRight, borderBottom, borderLeft } = style.pick(['borderTop', 'borderRight', 'borderBottom', 'borderLeft']);
            rowJoints[rowIndex] = Math.max(rowJoints[rowIndex] ?? 0, Number(Boolean(borderTop)));
            rowJoints[rowIndex + 1] = Math.max(rowJoints[rowIndex + 1] ?? 0, Number(Boolean(borderBottom)));
            columnJoints[columnIndex] = Math.max(columnJoints[columnIndex] ?? 0, Number(Boolean(borderLeft)));
            columnJoints[columnIndex + 1] = Math.max(columnJoints[columnIndex + 1] ?? 0, Number(Boolean(borderRight)));
            super.computeStyles(cell, computedStyles);
        }

        getColumnWidth(columnIndex: number, computedStyles: BorderComputedColumnStyles) {
            const columnJoints = computedStyles.columnJoints;
            return (columnIndex === 0 ? columnJoints[columnIndex] : 0) + super.getColumnWidth(columnIndex, computedStyles) + columnJoints[columnIndex + 1];
        }

        getRowHeight(row: IterableRow, computedStyles: BorderComputedRowStyles) {
            const rowIndex = row.rowIndex;
            const rowJoints = computedStyles.rowJoints;
            computedStyles.prevRowHeight = computedStyles.currRowHeight;
            return computedStyles.currRowHeight = (rowIndex === 0 ? rowJoints[rowIndex] : 0) + super.getRowHeight(row, computedStyles) + rowJoints[rowIndex + 1];
        }

        getRowShift(row: IterableRow, computedStyles: BorderComputedRowStyles) {
            computedStyles.topHorizontalLines = computedStyles.bottomHorizontalLines;
            computedStyles.bottomHorizontalLines = [];
            computedStyles.topVerticalLines = computedStyles.bottomVerticalLines;
            computedStyles.bottomVerticalLines = [];
            return row.rowIndex === 0 ? 0 : computedStyles.prevRowHeight;
        }

        fillHorizontalBorder(buffer: TBuffer, x: number, y: number, char: string, width: number) {
            if (y >= buffer.height)
                return;
            const characters = buffer.lines[y].characters;
            width = Math.min(x + width, characters.length);
            while (x < width)
                characters[x++] = char;
        }

        fillVerticalBorder(buffer: TBuffer, x: number, y: number, char: string, height: number) {
            const lines = buffer.lines;
            height = Math.min(y + height, lines.length);
            while (y < height) {
                const characters = buffer.lines[y++].characters;
                if (x < characters.length)
                    characters[x] = char;
            }
        }

        fillCornerBorder(buffer: TBuffer, x: number, y: number, char: string | undefined) {
            if (char !== undefined) {
                if (y < buffer.height) {
                    const characters = buffer.lines[y].characters;
                    if (x < characters.length)
                        characters[x] = char;
                }
            }
        }

        fillBlock(buffer: TBuffer, x: number, y: number, content: any[], width: number, height: number, cell: StyledCell, computedStyles: BorderComputedCellStyles) {
            const { rowIndex, columnIndex, reverseRowIndex, reverseColumnIndex, style } = cell;
            const { columnJoints, rowJoints, topHorizontalLines, bottomHorizontalLines, topVerticalLines, bottomVerticalLines } = computedStyles;
            const { borderTop, borderRight, borderBottom, borderLeft, borderCharacters } = style.pick(['borderTop', 'borderRight', 'borderBottom', 'borderLeft', 'borderCharacters']);
            const topJoint = rowJoints[rowIndex];
            const bottomJoint = rowJoints[rowIndex + 1];
            const leftJoint = columnJoints[columnIndex];
            const rightJoint = columnJoints[columnIndex + 1];
            if (columnIndex !== 0) {
                x -= leftJoint;
                width += leftJoint;
            }
            if (rowIndex !== 0) {
                y -= topJoint;
                height += topJoint;
            }
            const innerX = x + leftJoint;
            const innerY = y + topJoint;
            const innerWidth = width - (leftJoint + rightJoint);
            const innerHeight = height - (topJoint + bottomJoint);
            if (borderCharacters !== undefined) {
                const topRight = x + width - 1;
                const bottomRight = y + height - 1;
                if (borderLeft) {
                    bottomVerticalLines[columnIndex] = true;
                    this.fillVerticalBorder(buffer, x, innerY, borderCharacters[columnIndex === 0 ? BorderCharacter.left : BorderCharacter.center], innerHeight);
                }
                if (borderRight) {
                    bottomVerticalLines[columnIndex + 1] = true;
                    this.fillVerticalBorder(buffer, topRight, innerY, borderCharacters[reverseColumnIndex === -1 ? BorderCharacter.right : BorderCharacter.center], innerHeight);
                }
                if (borderTop) {
                    topHorizontalLines[columnIndex] = true;
                    this.fillHorizontalBorder(buffer, innerX, y, borderCharacters[rowIndex === 0 ? BorderCharacter.top : BorderCharacter.middle], innerWidth);
                }
                if (borderBottom) {
                    bottomHorizontalLines[columnIndex] = true;
                    this.fillHorizontalBorder(buffer, innerX, bottomRight, borderCharacters[reverseRowIndex === -1 ? BorderCharacter.bottom : BorderCharacter.middle], innerWidth);
                }

                this.fillCornerBorder(buffer, x, y, getCornerCharacter(borderCharacters, topHorizontalLines, topVerticalLines, bottomVerticalLines, columnIndex));
                if (reverseColumnIndex === -1)
                    this.fillCornerBorder(buffer, topRight, y, getCornerCharacter(borderCharacters, topHorizontalLines, topVerticalLines, bottomVerticalLines, columnIndex + 1));
                if (reverseRowIndex === -1) {
                    this.fillCornerBorder(buffer, x, bottomRight, getCornerCharacter(borderCharacters, bottomHorizontalLines, bottomVerticalLines, [], columnIndex));
                    if (reverseColumnIndex === -1)
                        this.fillCornerBorder(buffer, topRight, bottomRight, getCornerCharacter(borderCharacters, bottomHorizontalLines, bottomVerticalLines, [], columnIndex + 1));
                }
            }
            super.fillBlock(buffer, innerX, innerY, content, innerWidth, innerHeight, cell, computedStyles);
        }
    };
}

const enum Line {
    left   = 0x1,
    top    = 0x2,
    right  = 0x4,
    bottom = 0x8
}

const lineToChar: BorderCharacter[] = new Array(16);
lineToChar[Line.left] = lineToChar[Line.right] = lineToChar[Line.left | Line.right] = BorderCharacter.middle;
lineToChar[Line.top] = lineToChar[Line.bottom] = lineToChar[Line.top | Line.bottom] = BorderCharacter.center;
lineToChar[Line.bottom | Line.right] = BorderCharacter.topLeft;
lineToChar[Line.bottom | Line.left | Line.right] = BorderCharacter.topCenter;
lineToChar[Line.bottom | Line.left] = BorderCharacter.topRight;
lineToChar[Line.top | Line.right | Line.bottom] = BorderCharacter.middleLeft;
lineToChar[Line.top | Line.left | Line.right | Line.bottom] = BorderCharacter.middleCenter;
lineToChar[Line.top | Line.left | Line.bottom] = BorderCharacter.middleRight;
lineToChar[Line.top | Line.right] = BorderCharacter.bottomLeft;
lineToChar[Line.top | Line.left | Line.right] = BorderCharacter.bottomCenter;
lineToChar[Line.top | Line.left] = BorderCharacter.bottomRight;
lineToChar[0] = 0;

function getCornerCharacter(borderCharacters: any, topHorizontalLines: boolean[], topVerticalLines: boolean[], bottomVerticalLines: boolean[], columnIndex: number): string | undefined {
    return borderCharacters[
        lineToChar[
        (topHorizontalLines[columnIndex - 1] ? Line.left : 0)
        | (topVerticalLines[columnIndex] ? Line.top : 0)
        | (topHorizontalLines[columnIndex] ? Line.right : 0)
        | (bottomVerticalLines[columnIndex] ? Line.bottom : 0)
        ]
    ];
}
