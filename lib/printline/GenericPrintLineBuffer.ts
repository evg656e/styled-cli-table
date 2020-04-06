import { AbstractPrintLineBuffer } from './AbstractPrintLineBuffer';
import type { Constructor } from '../util/Constructor';
import type { PrintLine } from './PrintLine';

export function GenericPrintLineBuffer<TPrintLine extends PrintLine>(PrintLine: Constructor<TPrintLine>) {
    return class extends AbstractPrintLineBuffer<TPrintLine> {
        createPrintLine(width: number, space?: string) {
            return new PrintLine(width, space);
        }
    };
}
