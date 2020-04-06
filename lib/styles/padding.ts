export interface Padding {
    paddingTop: number,
    paddingRight: number,
    paddingBottom: number,
    paddingLeft: number
}

export function padding(top: number, right: number, bottom: number, left: number): Padding;
export function padding(top: number, rightLeft: number, bottom: number): Padding;
export function padding(topBottom: number, rightLeft: number): Padding;
export function padding(all: number): Padding;
export function padding(...args: number[]) {
    switch (args.length) {
        case 0: args[0] = 0;
        case 1: args[1] = args[0];
        case 2: args[2] = args[0];
        case 3: args[3] = args[1];
    }
    return {
        paddingTop: args[0],
        paddingRight: args[1],
        paddingBottom: args[2],
        paddingLeft: args[3],
    };
}
