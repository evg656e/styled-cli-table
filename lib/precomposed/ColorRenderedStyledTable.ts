import { ComposableRenderedStyledTable } from '../composable/ComposableRenderedStyledTable';
import { BreakPrintLineBuffer } from '../printline/BreakPrintLineBuffer';
import { GenericBufferedRenderer } from '../renderers/GenericBufferedRenderer';
import { FlexSizeRenderer } from '../renderers/FlexSizeRenderer';
import { ColorRenderer } from '../renderers/ColorRenderer';
import { AlignRenderer } from '../renderers/AlignRenderer';
import { PaddingRenderer } from '../renderers/PaddingRenderer';
import { BorderRenderer } from '../renderers/BorderRenderer';
import { BackgroundColorRenderer } from '../renderers/BackgroundColorRenderer';

export const ColorRenderedStyledTable = ComposableRenderedStyledTable(
    BreakPrintLineBuffer,
    GenericBufferedRenderer,
    FlexSizeRenderer,
    ColorRenderer,
    AlignRenderer,
    PaddingRenderer,
    BorderRenderer,
    BackgroundColorRenderer
);
