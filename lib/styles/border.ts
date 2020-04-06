export interface Border {
    borderTop: boolean,
    borderRight: boolean,
    borderBottom: boolean,
    borderLeft: boolean
}

export function border(top: boolean, right: boolean, bottom: boolean, left: boolean): Border;
export function border(top: boolean, rightLeft: boolean, bottom: boolean): Border;
export function border(topBottom: boolean, rightLeft: boolean): Border;
export function border(all: boolean): Border;
export function border(...args: boolean[]) {
    switch (args.length) {
        case 0: args[0] = false;
        case 1: args[1] = args[0];
        case 2: args[2] = args[0];
        case 3: args[3] = args[1];
    }
    return {
        borderTop: args[0],
        borderRight: args[1],
        borderBottom: args[2],
        borderLeft: args[3],
    };
}

//! @see https://en.wikipedia.org/wiki/Box-drawing_character
export enum BorderCharacter {
    top          = 0x1,
    bottom       = 0x2,
    middle       = top | bottom, // horizontal center
    left         = 0x4,
    right        = 0x8,
    center       = left | right, // vertical center
    topLeft      = top | left,
    topCenter    = top | center,
    topRight     = top | right,
    middleLeft   = middle | left,
    middleCenter = middle | center,
    middleRight  = middle | right,
    bottomLeft   = bottom | left,
    bottomCenter = bottom | center,
    bottomRight  = bottom | right
}

export function borderCharacters(...chars: string[]): {
    [x: string]: string;
    [x: number]: string;
} {
    switch (chars.length) {
        case 11: {
            const [middle, center] = chars;
            chars.splice(0, 0, middle, middle);
            chars.splice(3, 0, center, center);
        }
        case 15: {
            const keys = Object.keys(BorderCharacter).slice(15) as (keyof typeof BorderCharacter)[];
            return chars.map((char, index) => [BorderCharacter[keys[index]], char]).reduce((obj, [key, val]) => (obj[key] = val, obj), {} as any);
        }
        default:
            throw new Error(`Invalid number of arguments, 11 or 15 required, got ${chars.length}`);
    }
}

export const single = borderCharacters(
    '─', '│',
    '┌', '┬', '┐',
    '├', '┼', '┤',
    '└', '┴', '┘',
);

export const double = borderCharacters(
    '═', '║',
    '╔', '╦', '╗',
    '╠', '╬', '╣',
    '╚', '╩', '╝',
);
