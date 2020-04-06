import { upperBound } from '../util/upperBound';
import { PrintLine } from './PrintLine';

export type LineBreak = [number, string];

export class BreakPrintLine extends PrintLine {
    breaks: LineBreak[];

    constructor(width: number, space?: string) {
        super(width, space);
        this.breaks = [];
    }

    insertBreak(pos: number, brk: string) {
        if (pos > this.width)
            return -1;
        const pair: LineBreak = [pos, brk];
        if (this.breaks.length !== 0
            && pos < this.breaks[this.breaks.length - 1][0]) {
            const index = upperBound(this.breaks, pair, compareLineBreak);
            this.breaks.splice(index, 0, pair);
            return index;
        }
        else {
            this.breaks.push(pair);
            return this.breaks.length - 1;
        }
    }

    join() {
        const length = this.breaks.length;
        if (length === 0)
            return super.join();
        const parts = new Array(2 * length + 1);
        let top = 0;
        let lastPos = 0;
        for (const [pos, brk] of this.breaks) {
            if (pos !== lastPos) {
                parts[top++] = this.characters.slice(lastPos, pos).join('');
                lastPos = pos;
            }
            parts[top++] = brk;
        }
        if (lastPos !== this.characters.length)
            parts[top++] = this.characters.slice(lastPos).join('');
        parts.length = top;
        return parts.join('');
    }
}

function compareLineBreak([lhs]: LineBreak, [rhs]: LineBreak) {
    return lhs < rhs ? -1 : rhs < lhs ? 1 : 0;
}
