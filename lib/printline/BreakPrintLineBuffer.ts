import { GenericPrintLineBuffer } from './GenericPrintLineBuffer';
import { BreakPrintLine } from './BreakPrintLine';

export class BreakPrintLineBuffer extends GenericPrintLineBuffer(BreakPrintLine) {
    insertBreak(x: number, y: number, brk: string) {
        if (y < this.height)
            return this.lines[y].insertBreak(x, brk);
        return -1;
    }
}
