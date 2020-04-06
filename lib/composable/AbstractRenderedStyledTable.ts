import { StyledTable } from '../styledtable/StyledTable';
import type { AbstractRenderer } from '../renderers/AbstractRenderer';

export abstract class AbstractRenderedStyledTable<TRenderer extends AbstractRenderer> extends StyledTable {
    _renderer?: TRenderer;

    get renderer() {
        return this._renderer ?? (this._renderer = this.createRenderer());
    }

    abstract createRenderer(): TRenderer;

    *render() {
        yield* this.renderer.render(this);
    }

    toString() {
        return this.renderer.toString(this);
    }
}
