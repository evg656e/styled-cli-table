import type { StyledTable } from '../styledtable/StyledTable';

export abstract class AbstractRenderer {
    abstract render(styledTable: StyledTable): Generator<string>;

    toString(styledTable: StyledTable) {
        return [...this.render(styledTable)].join('\n');
    }
}
