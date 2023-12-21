import React from 'react';
import type { CSSProperties, ReactNode } from 'react';
import PropTypes from 'prop-types';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { type PDFPasswordFormProps } from './PDFPasswordForm';
type Props = {
    file: string;
    pageMaxWidth: number;
    isSmallScreen: boolean;
    maxCanvasWidth: number | null;
    maxCanvasHeight: number | null;
    maxCanvasArea: number | null;
    renderPasswordForm?: ({ isPasswordInvalid, onSubmit, onPasswordChange }: Omit<PDFPasswordFormProps, 'onPasswordFieldFocus'>) => ReactNode | null;
    LoadingComponent?: ReactNode;
    ErrorComponent?: ReactNode;
    containerStyle?: CSSProperties;
    contentContainerStyle?: CSSProperties;
};
declare function PDFPreviewer({ file, pageMaxWidth, isSmallScreen, maxCanvasWidth, maxCanvasHeight, maxCanvasArea, LoadingComponent, ErrorComponent, renderPasswordForm, containerStyle, contentContainerStyle, }: Props): React.JSX.Element;
declare namespace PDFPreviewer {
    var propTypes: {
        file: PropTypes.Validator<string>;
        pageMaxWidth: PropTypes.Validator<number>;
        isSmallScreen: PropTypes.Validator<boolean>;
        maxCanvasWidth: PropTypes.Requireable<number>;
        maxCanvasHeight: PropTypes.Requireable<number>;
        maxCanvasArea: PropTypes.Requireable<number>;
        renderPasswordForm: PropTypes.Requireable<(...args: any[]) => any>;
        LoadingComponent: PropTypes.Requireable<PropTypes.ReactNodeLike>;
        ErrorComponent: PropTypes.Requireable<PropTypes.ReactNodeLike>;
        containerStyle: PropTypes.Requireable<object>;
        contentContainerStyle: PropTypes.Requireable<object>;
    };
    var defaultProps: {
        maxCanvasWidth: null;
        maxCanvasHeight: null;
        maxCanvasArea: null;
        renderPasswordForm: null;
        LoadingComponent: React.JSX.Element;
        ErrorComponent: React.JSX.Element;
        containerStyle: {};
        contentContainerStyle: {};
    };
}
declare const _default: React.MemoExoticComponent<typeof PDFPreviewer>;
export default _default;
//# sourceMappingURL=PDFPreviewer.d.ts.map