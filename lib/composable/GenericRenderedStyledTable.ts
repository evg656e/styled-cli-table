import { AbstractRenderedStyledTable } from './AbstractRenderedStyledTable';
import type { AbstractRenderer } from '../renderers/AbstractRenderer';
import type { Constructor } from '../util/Constructor';

export function GenericRenderedStyledTable<TRenderer extends AbstractRenderer>(Renderer: Constructor<TRenderer>) {
    return class extends AbstractRenderedStyledTable<TRenderer> {
        createRenderer() {
            return new Renderer();
        }
    };
}
