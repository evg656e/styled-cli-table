export class PrintLine {
    characters: string[];

    constructor(width: number, space = ' ') {
        this.characters = new Array(width).fill(space);
    }

    get width() {
        return this.characters.length;
    }

    fillString(x: number, str: string, width = str.length) {
        width = Math.min(width, str.length, this.width - x);
        for (let i = 0; i < width; i++)
            this.characters[x++] = str[i];
    }

    fill(x: number, value: any, width?: number) {
        this.fillString(x, typeof value === 'string' ? value : String(value), width);
    }

    join() {
        return this.characters.join('');
    }
}
