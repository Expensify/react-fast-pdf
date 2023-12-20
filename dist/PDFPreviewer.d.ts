import React from 'react';
import type { CSSProperties, ReactNode } from 'react';
import PropTypes from 'prop-types';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
type Props = {
    file: string;
    pageMaxWidth: number;
    isSmallScreen: boolean;
    LoadingComponent?: ReactNode;
    ErrorComponent?: ReactNode;
    containerStyle?: CSSProperties;
    contentContainerStyle?: CSSProperties;
};
declare function PDFPreviewer({ pageMaxWidth, isSmallScreen, file, LoadingComponent, ErrorComponent, containerStyle, contentContainerStyle }: Props): React.JSX.Element;
declare namespace PDFPreviewer {
    var propTypes: {
        file: PropTypes.Validator<string>;
        pageMaxWidth: PropTypes.Validator<number>;
        isSmallScreen: PropTypes.Validator<boolean>;
        LoadingComponent: PropTypes.Requireable<PropTypes.ReactNodeLike>;
        ErrorComponent: PropTypes.Requireable<PropTypes.ReactNodeLike>;
        containerStyle: PropTypes.Requireable<object>;
        contentContainerStyle: PropTypes.Requireable<object>;
    };
    var defaultProps: {
        LoadingComponent: React.JSX.Element;
        ErrorComponent: React.JSX.Element;
        containerStyle: {};
        contentContainerStyle: {};
    };
}
declare const _default: React.MemoExoticComponent<typeof PDFPreviewer>;
export default _default;
//# sourceMappingURL=PDFPreviewer.d.ts.map