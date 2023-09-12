import React from 'react';
import PropTypes from 'prop-types';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
type Props = {
    file: string;
    pageMaxWidth: number;
    isSmallScreen: boolean;
    containerStyle?: React.CSSProperties;
};
declare function PDFPreviewer({ pageMaxWidth, isSmallScreen, file, containerStyle }: Props): React.JSX.Element;
declare namespace PDFPreviewer {
    var propTypes: {
        file: PropTypes.Validator<string>;
        pageMaxWidth: PropTypes.Validator<number>;
        isSmallScreen: PropTypes.Validator<boolean>;
        containerStyle: PropTypes.Requireable<object>;
    };
    var defaultProps: {
        containerStyle: {};
    };
}
declare const _default: React.MemoExoticComponent<typeof PDFPreviewer>;
export default _default;
//# sourceMappingURL=PDFPreviewer.d.ts.map