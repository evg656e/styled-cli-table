import { AbstractBufferedRenderer } from './AbstractBufferedRenderer';
import type { Constructor } from '../util/Constructor';
import type { AbstractPrintLineBuffer } from '../printline/AbstractPrintLineBuffer';

export interface GenericBufferedRenderer<TBuffer extends AbstractPrintLineBuffer> extends AbstractBufferedRenderer<TBuffer> {
    createBuffer(space?: string): TBuffer;
}

export function GenericBufferedRenderer<TBuffer extends AbstractPrintLineBuffer>(Buffer: Constructor<TBuffer>) {
    return class extends AbstractBufferedRenderer<TBuffer> implements GenericBufferedRenderer<TBuffer> {
        createBuffer(space?: string) {
            return new Buffer(space);
        }
    };
}

//! @see https://github.com/microsoft/TypeScript/issues/17574
//! @see https://github.com/microsoft/TypeScript/issues/29043
//! @see https://www.bryntum.com/blog/the-mixin-pattern-in-typescript-all-you-need-to-know
// export type GenericBufferedRenderer<TBuffer extends AbstractPrintLineBuffer> =
//     InstanceType<ReturnType<typeof GenericBufferedRenderer>> & AbstractBufferedRenderer<TBuffer>;
