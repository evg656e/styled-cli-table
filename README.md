# styled-cli-table

Terminal table rendering library with cascading style system and open to extend architecture.

## Install

```console
npm i styled-cli-table
```

## Overview by examples

Usage:
```js
import { RenderedStyledTable } from 'styled-cli-table/module/precomposed/RenderedStyledTable'; 
import { border, single } from 'styled-cli-table/module/styles/border'; // for CommonJS usage replace 'module' to 'commonjs' in path

const data = [
    ['#', 'name', 'price', 'quantity', 'total'],
    [1, 'apple', 2, 3, 6],
    [2, 'banana', 1, 10, 10],
    [3, 'lemon', 1.5, 3, 4.5]
];

const styles = {
    ...border(true), // expands to { borderLeft: true, borderRight: true, borderTop: true, borderBottom: true }
    borderCharacters: single,
    paddingLeft: 1, paddingRight: 1,
    rows: { // rows styles
        0: { // first row styles
            align: 'center'
        }
    },
    columns: { // columns styles
        1: { // second column styles
            minWidth: 6, maxWidth: 12 // width calculated by the content, but will be at least 6 and at most 12 characters
        },
        [-1]: { // last column styles
            width: 9 // fixed width
        }
        // widths of the remaining columns are calculated by the content
    }
};

const table = new RenderedStyledTable(data, styles);

console.log(table.toString()); // print all at once

// or print line by line
for (const line of table.render()) {
    console.log(line);
}
```

Output:
```console
┌───┬────────┬───────┬──────────┬─────────┐
│ # │  name  │ price │ quantity │  total  │
├───┼────────┼───────┼──────────┼─────────┤
│ 1 │ apple  │ 2     │ 3        │ 6       │
├───┼────────┼───────┼──────────┼─────────┤
│ 2 │ banana │ 1     │ 10       │ 10      │
├───┼────────┼───────┼──────────┼─────────┤
│ 3 │ lemon  │ 1.5   │ 3        │ 4.5     │
└───┴────────┴───────┴──────────┴─────────┘
```


Vertical styles work as well:
```js
const data = [
    ['#', 'name', 'price', 'quantity', 'total'],
    [1, ['apple', 'Granny Smith'] /* arrays force rows to grow by height */, 2, 3, 6],
    [2, 'banana', 1, 10, 10],
    [3, 'lemon', 1.5, 3, 4.5],
];

const styles = {
    ...border(true),
    borderCharacters: single,
    paddingLeft: 1, paddingRight: 1,
    rows: {
        0: {
            align: 'center',
            paddingTop: 1, paddingBottom: 1
        },
        2: {
            height: 3, // fixed row height
            verticalAlign: 'bottom'
        }
    },
};
```

Output:
```console
┌───┬──────────────┬───────┬──────────┬───────┐
│   │              │       │          │       │
│ # │     name     │ price │ quantity │ total │
│   │              │       │          │       │
├───┼──────────────┼───────┼──────────┼───────┤
│ 1 │ apple        │ 2     │ 3        │ 6     │
│   │ Granny Smith │       │          │       │
├───┼──────────────┼───────┼──────────┼───────┤
│   │              │       │          │       │
│   │              │       │          │       │
│ 2 │ banana       │ 1     │ 10       │ 10    │
├───┼──────────────┼───────┼──────────┼───────┤
│ 3 │ lemon        │ 1.5   │ 3        │ 4.5   │
└───┴──────────────┴───────┴──────────┴───────┘
```

Custom borders:
```js
const styles = {
    borderCharacters: single,
    paddingLeft: 1, paddingRight: 1,
    rows: {
        0: {
            align: 'center',
            borderTop: true, borderBottom: true
        },
        [-1]: {
            borderBottom: true
        }
    },
    columns() { // functional styles (return value applies to all columns)
        return {
            borderLeft: true, borderRight: true
        };
    }
};
```

Output:
```console
┌───┬────────┬───────┬──────────┬───────┐
│ # │  name  │ price │ quantity │ total │
├───┼────────┼───────┼──────────┼───────┤
│ 1 │ apple  │ 2     │ 3        │ 6     │
│ 2 │ banana │ 1     │ 10       │ 10    │
│ 3 │ lemon  │ 1.5   │ 3        │ 4.5   │
└───┴────────┴───────┴──────────┴───────┘
```

Conditional data rendering:
```js
const styles = {
    borderCharacters: single,
    paddingLeft: 1, paddingRight: 1,
    rows: {
        0: {
            borderTop: true, borderBottom: true
        },
        [-1]: {
            borderBottom: true
        }
    },
    columns() {
        return {
            borderLeft: true, borderRight: true
        };
    },
    cells({ value, rowIndex }) {
        const isNumber = typeof value === 'number';
        return {
            content: isNumber ? value : `'${value}'`, // non-numbers are quoted
            align: rowIndex === 0 ? 'center' :
                isNumber ? 'right' : 'left' // first row aligned to center, numbers to right, other to left
        };
    }
}
```

Output:
```console
┌─────┬──────────┬─────────┬────────────┬─────────┐
│ '#' │  'name'  │ 'price' │ 'quantity' │ 'total' │
├─────┼──────────┼─────────┼────────────┼─────────┤
│   1 │ 'apple'  │       2 │          3 │       6 │
│   2 │ 'banana' │       1 │         10 │      10 │
│   3 │ 'lemon'  │     1.5 │          3 │     4.5 │
└─────┴──────────┴─────────┴────────────┴─────────┘
```

Terminal color styling supported by seperate class:
```js
import { ColorRenderedStyledTable } from 'styled-cli-table/module/precomposed/ColorRenderedStyledTable';
import * as color from 'styled-cli-table/module/styles/color';

const styles = {
    ...border(true),
    borderCharacters: single,
    paddingLeft: 1, paddingRight: 1,
    backgroundColor: color.bgGreen,
    color: color.blue,
    rows: {
        0: {
            align: 'center',
            color: color.yellow
        }
    },
};

const table = new ColorRenderedStyledTable(data, styles);
```

Output:
<pre style="display: inline-block; background-color: green; color: blue; padding: 0;">
┌───┬────────┬───────┬──────────┬───────┐
│ <span style="color: yellow">#</span> │  <span style="color: yellow">name</span>  │ <span style="color: yellow">price</span> │ <span style="color: yellow">quantity</span> │ <span style="color: yellow">total</span> │
├───┼────────┼───────┼──────────┼───────┤
│ 1 │ apple  │ 2     │ 3        │ 6     │
│ 2 │ banana │ 1     │ 10       │ 10    │
│ 3 │ lemon  │ 1.5   │ 3        │ 4.5   │
└───┴────────┴───────┴──────────┴───────┘
</pre>

## Library overview

The library consists of the following main parts:
  * `Style` class that provides a cascading style system;
  * `StyledTable` class that allows to iterate through tabular data with applying cascading styles;
  * `printline` module that provides mutable string buffers, that are used by the `renderers`;
  * `renderers` module consisting of mixin classes that implement various styles;
  * `styles` module which consists of styles helper functions and types;
  * `ComposableRenderedStyledTable` function that composes `StyledTable`  and various `renderers` mixin classes to the final reusable class.

### Styles, cascading and the `Style` class

Styles are plain JavaScript objects consisting of keys that denote the names of styles and values that denote the corresponding values:
```js
const styles = {
    align: 'center',
    width: 10,
    borderTop: true
};
```

To create cascading styles the `Style` class is used:
```js
import { Style } from 'styled-cli-table/module/styledtable/Style';

const style = new Style();
style.push({ // initial styles
    padLeft: 2,
    padRight: 2,
    align: 'center'
});
style.push({ // later styles take precedence
    padRight: 4, // overrides previous 'padRight'
    width: 10 // new style
});

const {
    align, // 'center'
    padLeft, // 2
    padRight, // 4
    width, // 10
    borderBottom // undefined
} = style.pick(['align', 'padLeft', 'padRight', 'width', 'borderBottom']); // get multiple styles at once 

const width = style.get('width'); // get single style
```

### `StyledTable` class

The `StyledTable` class allows to iterate through tabular data (wich are two-dimensional arrays) while apply cascading styles.

There are four levels of cascade (from low priority to high): table, columns, rows and cells.

```js
import { StyledTable } from 'styled-cli-table/module/styledtable/StyledTable';

const data = [
    ['#', 'name', 'price', 'quantity', 'total'],
    [1, 'apple', 2, 3, 6],
    [2, 'banana', 1, 10, 10],
    [3, 'lemon', 1.5, 3, 4.5],
];

const styles = {
    // table level styles
    width: 10,
    align: 'left',
    columns: { // column level styles
        0: { // first column
            width: 15
        },
        [-1]: { // last column
            width: 20
        }
    }
    rows: { // row level styles
        0: {
            align: 'center'
        }
    },
    cells: { // cell level styles
        1: {
            1: { // cell at data[1][1]
                align: 'right',
                width: 12
            }
        }
    }
};

const table = new StyledTable(data, styles);
for (const row of table.rows()) {
    for (const cell of row.cells()) {
        const styles = cell.style.pick(['width', 'align']);
        console.log(`Value ${cell.value} at [${cell.rowIndex}, ${cell.columnIndex}] has styles:`, styles);
    }
}
```

The `columns`, `rows` and `cells` properties of table styles can be the functions returning styles objects. This allows you to define conditional styles.

```js
const styles = {
    // table level styles
    width: 10,
    align: 'left',
    columns({ columnIndex, reversedColumnIndex }) { // functional column styles
        if (columnIndex === 0) // first column
            return { width: 15 };
        if (reversedColumnIndex === -1) // last column
            return { width: 20 };
    }
    rows({ rowIndex }) { // functional row styles
        if (rowIndex === 0) // first row
            return { align: 'center' };
    },
    cells({ rowIndex, columnIndex }) { // functional cell styles
        if (rowIndex === 1 && columnIndex === 1) // cell at data[1][1]
            return { align: 'right', width: 12 };
    }
};
```

### The printlines and buffers

The printlines are some sort of mutable strings with predefined length. `printline` module provides two kind of printlines: `PrintLine` which is basic printline and `BreakPrintLine`, which adds another layer of line breaks (can be used to add terminal styles for example).

```js
import { PrintLine } from 'styled-cli-table/module/printline/PrintLine';
import { BreakPrintLine } from 'styled-cli-table/module/printline/BreakPrintLine';

const line = new PrintLine(10, '.'); // width and space character
line.fill(5, 'bb');
line.fill(0, 'aaa');
line.fill(11, 'ccc'); // out of range
console.log(line.join()); // 'aaa..bb...'

const line2 = new BreakPrintLine(10, '.');
line2.fill(0, 'aaa');
line2.insertBreak(5, '<i>');
line2.insertBreak(7, '</i>');
line2.fill(5, 'bb');
console.log(line2.join()); // 'aaa..<i>bb</i>...'
```

The `AbstractPrintLineBuffer` class allows to allocate some number of underlying printlines, fill them and consume filled lines on demand. There are two predifined buffers: `PrintLineBuffer` and `BreakPrintLineBuffer`.

```js
import { PrintLineBuffer } from 'styled-cli-table/module/printline/PrintLineBuffer';

const buffer = new PrintLineBuffer('.');

buffer.push(11, 2); // allocates 2 lines of width 11
buffer.fill(0, 0, 'aaa'); // filling first line
buffer.fill(8, 0, 'bbb');
buffer.fill(0, 1, 'xxx'); // filling second line
buffer.fill(8, 2, 'zzz'); // out of range

for (const line of buffer.shift(2)) // consumes first two lines of buffer
    console.log(line); // 'aaa.....bbb' and 'xxx........'

// buffer is empty now, you can allocate new lines
```

### Renderers

The renderer is a class that have `render` method that accepts `StyledTable` and generates its string representation line by line.

The core class of the library is `AbstractBufferedRenderer`, which provides two-pass buffered rendering: on the first pass the necessary styles are computed (e.g. column widths and row heights), on the second pass the table data are rendered using computed styles and printline buffer.

Here is a simplified version of the `render` method of class `AbstractBufferedRenderer`:

```typescript
function *render(this: AbstractBufferedRenderer, styledTable: StyledTable) {
    const computedStyles: Styles = {};
    this.initComputedStyles(computedStyles); // you can init your styles here

    // first pass, computing styles
    for (const row of styledTable.rows()) {
        for (const cell of row.cells()) {
            this.computeStyles(cell, computedStyles); // compute your styles here
        }
    }

    // second pass, renedring table line by line using buffer
    const buffer = this.createBuffer(styledTable.style.get('space'));
    const rowWidth = this.getRowWidth(computedStyles); // gets the whole table width
    for (const row of styledTable.rows()) {
        const rowHeight = this.getRowHeight(row, computedStyles); // gets current row height
        const y = buffer.height;
        buffer.push(rowWidth, rowHeight); // roughly allocates rowWidth * rowHeight characters to render current row
        const height = rowHeight;
        let x = 0;
        for (const cell of row.cells()) {
            const width = this.getCellWidth(cell, computedStyles); // gets current cell width
            const content = this.getContent(cell); // gets the content to render (by default, cell's 'value' property or cell.style's 'content' property)
            this.fillBlock(buffer, x, y, Array.isArray(content) ? content : [content], width, height, cell, computedStyles); // use this method to process the current cell's block
            x += width;
        }
        yield* buffer.shift(this.getRowShift(row, computedStyles)); // shifts buffer by specified number of line and yields them to user
    }
}

function fillBlock(this: AbstractBufferedRenderer, buffer: TBuffer, x: number, y: number, content: any[], width: number, height: number, cell: StyledCell, computedStyles: ComputedCellStyles) {
    for (let i = 0; i < height; i++)
        this.fillLine(buffer, x, y++, String(content[i]), width, cell, computedStyles); // use this method to process current cell's content
}
```

To implement concrete styles or features, [mixin](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Mix-ins) functions are used. There are several predefined mixins provided by the library.

#### `GenericBufferedRenderer` 

Accepts the subclass of `AbstractPrintLineBuffer` (e.g. `PrintLineBuffer` or `BreakPrintLineBuffer`) and returns concrete subclass of `AbstractBufferedRenderer` parameterized with this buffer. This is the base mixin for all library mixins.

#### `FlexSizeRenderer`

Computes the height and width of cells depending on the content. You can specify a fixed width or height using `width` and `height` styles respectively. You can specify a fixed range of width or height using styles `minWidth`, `maxWidth`, `minHeight` and `maxHeight` respectively. Usually this mixin should be used immediately after `GenericBufferedRenderer`.

#### `PaddingRenderer`

Adds horizontal and vertical paddings. You can set paddings explicitly by setting `paddingTop`, `paddingRight`, `paddingBottom` or `paddingLeft` properties, or by using a helper `padding` function:

```js
import { padding } from 'styled-cli-table/module/styles/padding';

const styles = {
    ...padding(0, 1) // expands to { paddingTop: 0, paddingRight: 1, paddingBottom: 0, paddingLeft: 1 }
};
```

#### `AlignRenderer`

Aligns the content horizontally and vertically. To align the content horizontally set `align` property to `left`, `center` or `right`. To align the content vertically set `verticallyAlign` property to `top`, `middle` or `bottom`.

#### `BorderRenderer`

Renders borders around cells. You can set borders explicitly by setting `borderTop`, `borderRight`, `borderBottom` or `borderLeft` properties, or by using a helper `border` function. It is also necessary to explicitly set the border characters by specifiyng `borderCharacters` proprty, otherwise the borders will not be displayed. The library provides two character sets by default: `single` and `double`:

```js
import { border, single } from 'styled-cli-table/module/styles/border';

const styles = {
    ...border(true), // expands to { borderTop: true, borderRight: true, borderBottom: true, borderLeft: true }
    borderCharacters: single
};
```

You can create your own sets by using the `borderCharacters` function:

```js
import { border, borderCharacters } from 'styled-cli-table/module/styles/border';

const styles = {
    ...border(true), // expands to { borderTop: true, borderRight: true, borderBottom: true, borderLeft: true }
    borderCharacters: borderCharacters(
        '═', '═', '─',
        '║', '║', '│',
        '╔', '╤', '╗',
        '╟', '┼', '╢',
        '╚', '╧', '╝',
    )
};
```

#### `ColorRenderer` and `BackgroundColorRenderer`

Allows you to apply [terminal styles](https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color) for the entire cell (`BackgroundColorRenderer`) or for the content only (`ColorRenderer`). To set whole cell style use `backgroundColor` property. To set only content style use `color` property. Predefined terminal styles can be found inside `styles/color` module:

```js
import * as color from 'styled-cli-table/module/styles/color';

const styles = {
    backgroundColor: color.bgYellow,
    color: color.black
};
```

These mixins should be chained with `BreakPrintLineBuffer`.

### Composing renderers

You can compose renderers by chaining mixin functions and providing printline buffer to break the chain, e.g.:

```js
import { PrintLineBuffer } from 'styled-cli-table/module/printline/PrintLineBuffer';
import { BorderRenderer, FlexSizeRenderer, GenericBufferedRenderer } from 'styled-cli-table/module/renderers/index';
import { StyledTable } from 'styled-cli-table/module/styledtable';

const CustomRenderer = BorderRenderer(FlexSizeRenderer(GenericBufferedRenderer(PrintLineBuffer)));
const renderer = new CustomRenderer();
const table = new StyledTable(data, styles);
console.log(renderer.toString(table));
```

To simplify creation and usage of renderers, `GenericRenderedStyledTable` function is provided. It accepts the base class as first parameter, and one or more mixins functions as rest, chains them internally and returns new class that can be used to create and render tabular data:

```js
import { PrintLineBuffer } from 'styled-cli-table/module/printline/PrintLineBuffer';
import { BorderRenderer, FlexSizeRenderer, GenericBufferedRenderer } from 'styled-cli-table/module/renderers/index';
import { GenericRenderedStyledTable } from 'styled-cli-table/module/composable/ComposableRenderedStyledTable';

const CustomStyledTable = GenericRenderedStyledTable(
    PrintLineBuffer,
    GenericBufferedRenderer,
    FlexSizeRenderer,
    BorderRenderer
);

const table = new CustomStyledTable(data, styles);
console.log(table.toString());
```

### Creating your own renderers

```js
import { PrintLineBuffer } from 'styled-cli-table/module/printline/PrintLineBuffer';
import { BorderRenderer, PaddingRenderer, AlignRenderer, FlexSizeRenderer, GenericBufferedRenderer } from 'styled-cli-table/module/renderers/index';
import { ComposableRenderedStyledTable } from 'styled-cli-table/module/composable/ComposableRenderedStyledTable';
import { border, single } from 'styled-cli-table/module/styles';

function PrettyCropRenderer(BufferedRenderer) {
    return class extends BufferedRenderer {
        fillLine(buffer, x, y, content, width, cell, computedStyles) {
            super.fillLine(buffer, x, y, crop(content, width, cell.style.get('crop')), width, cell, computedStyles);
        }
    };
}

function crop(content, width, cropString = '') {
    return content.length > width ?
        content.substring(0, width - cropString.length) + cropString :
        content;
}

const CustomStyledTable = ComposableRenderedStyledTable(
    PrintLineBuffer,
    GenericBufferedRenderer,
    FlexSizeRenderer,
    AlignRenderer,
    PrettyCropRenderer,
    PaddingRenderer,
    BorderRenderer
);

const data = [
    ['#', 'name', 'price', 'quantity', 'total'],
    [1, 'apple', 2, 3, 6],
    [2, 'banana', 1, 10, 10],
    [3, 'strawberry', 3, 3, 9]
];

const styles = {
    ...border(true),
    borderCharacters: single,
    paddingLeft: 1, paddingRight: 1,
    crop: '..',
    rows: {
        0: {
            align: 'center'
        }
    },
    columns: {
        1: {
            width: 8
        }
    }
};

const table = new CustomStyledTable(data, styles);
console.log(table.toString());
```

Output:

```console
┌───┬────────┬───────┬──────────┬───────┐
│ # │  name  │ price │ quantity │ total │
├───┼────────┼───────┼──────────┼───────┤
│ 1 │ apple  │ 2     │ 3        │ 6     │
├───┼────────┼───────┼──────────┼───────┤
│ 2 │ banana │ 1     │ 10       │ 10    │
├───┼────────┼───────┼──────────┼───────┤
│ 3 │ stra.. │ 3     │ 3        │ 9     │
└───┴────────┴───────┴──────────┴───────┘
```
