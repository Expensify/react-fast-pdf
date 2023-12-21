import React from 'react';
import PropTypes from 'prop-types';
type Props = {
    isPasswordInvalid?: boolean;
    isFocused: boolean;
    onSubmit?: (password: string) => void;
    onPasswordChange?: (password: string) => void;
    onPasswordFieldFocus?: (isFocused: boolean) => void;
};
declare function PDFPasswordForm({ isPasswordInvalid, isFocused, onSubmit, onPasswordChange, onPasswordFieldFocus }: Props): React.JSX.Element;
declare namespace PDFPasswordForm {
    var propTypes: {
        /** If the submitted password is invalid (show an error message) */
        isPasswordInvalid: PropTypes.Requireable<boolean>;
        /** Should focus to the password input  */
        isFocused: PropTypes.Validator<boolean>;
        /** Notify parent that the password form has been submitted */
        onSubmit: PropTypes.Requireable<(...args: any[]) => any>;
        /** Notify parent that the password has been updated/edited */
        onPasswordChange: PropTypes.Requireable<(...args: any[]) => any>;
        /** Notify parent that a text field has been focused or blurred */
        onPasswordFieldFocus: PropTypes.Requireable<(...args: any[]) => any>;
    };
    var defaultProps: {
        isPasswordInvalid: boolean;
        onSubmit: () => void;
        onPasswordChange: () => void;
        onPasswordFieldFocus: () => void;
    };
    var displayName: string;
}
export default PDFPasswordForm;
//# sourceMappingURL=PDFPasswordForm.d.ts.map