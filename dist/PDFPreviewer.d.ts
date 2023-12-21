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
    PasswordFormComponent?: ({ isPasswordInvalid, onSubmit, onPasswordChange, onPasswordFieldFocus }: PDFPasswordFormProps) => ReactNode;
    LoadingComponent?: ReactNode;
    ErrorComponent?: ReactNode;
    containerStyle?: CSSProperties;
    contentContainerStyle?: CSSProperties;
};
declare function PDFPreviewer({ pageMaxWidth, isSmallScreen, file, LoadingComponent, ErrorComponent, PasswordFormComponent, containerStyle, contentContainerStyle }: Props): React.JSX.Element;
declare namespace PDFPreviewer {
    var propTypes: {
        file: PropTypes.Validator<string>;
        pageMaxWidth: PropTypes.Validator<number>;
        isSmallScreen: PropTypes.Validator<boolean>;
        PasswordFormComponent: PropTypes.Requireable<PropTypes.ReactNodeLike>;
        LoadingComponent: PropTypes.Requireable<PropTypes.ReactNodeLike>;
        ErrorComponent: PropTypes.Requireable<PropTypes.ReactNodeLike>;
        containerStyle: PropTypes.Requireable<object>;
        contentContainerStyle: PropTypes.Requireable<object>;
    };
    var defaultProps: {
        PasswordFormComponent: null;
        LoadingComponent: React.JSX.Element;
        ErrorComponent: React.JSX.Element;
        containerStyle: {};
        contentContainerStyle: {};
    };
}
declare const _default: React.MemoExoticComponent<typeof PDFPreviewer>;
export default _default;
//# sourceMappingURL=PDFPreviewer.d.ts.map