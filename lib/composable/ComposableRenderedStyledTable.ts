import { GenericRenderedStyledTable } from './GenericRenderedStyledTable';

export function ComposableRenderedStyledTable<TBase, TRenderers extends any[]>(base: TBase, ...renderers: TRenderers) {
    return GenericRenderedStyledTable(renderers.reduce((base, renderer) => renderer(base), base));
}
