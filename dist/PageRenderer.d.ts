import React, { type CSSProperties } from 'react';
import PropTypes from 'prop-types';
type Props = {
    index: number;
    style: CSSProperties;
    data: {
        pageWidth: number;
        estimatedPageHeight: number;
        calculatePageHeight: (pageIndex: number) => number;
        getDevicePixelRatio: (width: number, height: number) => number | undefined;
    };
};
declare function PageRenderer({ index, style, data }: Props): React.JSX.Element;
declare namespace PageRenderer {
    var displayName: string;
    var propTypes: {
        /** Index of the PDF page to be displayed passed by VariableSizeList */
        index: PropTypes.Validator<number>;
        /** Page extra data passed by VariableSizeList's data prop */
        data: PropTypes.Validator<NonNullable<PropTypes.InferProps<{
            /** Width of a single page in the document */
            pageWidth: PropTypes.Validator<number>;
            /** The estimated height of a single page in the document */
            estimatedPageHeight: PropTypes.Validator<number>;
            /** Function that calculates the height of a page given its index */
            calculatePageHeight: PropTypes.Validator<(...args: any[]) => any>;
            /** Function that calculates the pixel ratio for a page given its calculated width and height */
            getDevicePixelRatio: PropTypes.Validator<(...args: any[]) => any>;
        }>>>;
        /** Additional style props passed by VariableSizeList */
        style: PropTypes.Validator<object>;
    };
}
declare const _default: React.MemoExoticComponent<typeof PageRenderer>;
export default _default;
//# sourceMappingURL=PageRenderer.d.ts.map