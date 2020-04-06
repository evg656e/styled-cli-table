import { ComposableRenderedStyledTable } from '../composable/ComposableRenderedStyledTable';
import { PrintLineBuffer } from '../printline/PrintLineBuffer';
import { GenericBufferedRenderer } from '../renderers/GenericBufferedRenderer';
import { FlexSizeRenderer } from '../renderers/FlexSizeRenderer';
import { AlignRenderer } from '../renderers/AlignRenderer';
import { PaddingRenderer } from '../renderers/PaddingRenderer';
import { BorderRenderer } from '../renderers/BorderRenderer';

export const RenderedStyledTable = ComposableRenderedStyledTable(
    PrintLineBuffer,
    GenericBufferedRenderer,
    FlexSizeRenderer,
    AlignRenderer,
    PaddingRenderer,
    BorderRenderer
);
