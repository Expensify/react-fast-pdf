import React from 'react';
import type { CSSProperties } from 'react';
import PropTypes from 'prop-types';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
type Props = {
    file: string;
    pageMaxWidth: number;
    isSmallScreen: boolean;
    containerStyle?: CSSProperties;
    contentContainerStyle?: CSSProperties;
};
declare function PDFPreviewer({ pageMaxWidth, isSmallScreen, file, containerStyle, contentContainerStyle }: Props): React.JSX.Element;
declare namespace PDFPreviewer {
    var propTypes: {
        file: PropTypes.Validator<string>;
        pageMaxWidth: PropTypes.Validator<number>;
        isSmallScreen: PropTypes.Validator<boolean>;
        containerStyle: PropTypes.Requireable<object>;
        contentContainerStyle: PropTypes.Requireable<object>;
    };
    var defaultProps: {
        containerStyle: {};
        contentContainerStyle: {};
    };
}
declare const _default: React.MemoExoticComponent<typeof PDFPreviewer>;
export default _default;
//# sourceMappingURL=PDFPreviewer.d.ts.map