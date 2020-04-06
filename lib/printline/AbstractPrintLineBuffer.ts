import type { PrintLine } from './PrintLine';

export abstract class AbstractPrintLineBuffer<TPrintLine extends PrintLine = PrintLine> {
    lines: TPrintLine[];
    space: string | undefined;

    constructor(space?: string) {
        this.lines = [];
        this.space = space;
    }

    get height() {
        return this.lines.length;
    }

    abstract createPrintLine(width: number, space?: string): TPrintLine;

    fillLine(x: number, y: number, value: any, width?: number) {
        this.lines[y].fill(x, value, width);
    }

    fillBlock(x: number, y: number, arr: any[], width?: number, height = arr.length) {
        height = Math.min(height, arr.length, this.height - y);
        for (let i = 0; i < height; i++)
            this.fillLine(x, y++, arr[i], width);
    }

    fill(x: number, y: number, value: any, width?: number, height?: number) {
        this.fillBlock(x, y, Array.isArray(value) ? value : [value], width, height);
    }

    peek(x: number, y: number, defaultValue?: string) {
        return this.lines[y]?.characters[x] ?? defaultValue;
    }

    push(width: number, height: number) {
        while (height-- > 0)
            this.lines.push(this.createPrintLine(width, this.space));
    }

    *shift(n: number) {
        while (n-- > 0) {
            const line = this.lines.shift();
            if (line === undefined)
                return;
            yield line.join();
        }
    }
}
