import React, {useState, useRef, useEffect, ChangeEvent} from 'react';
import PropTypes from 'prop-types';

import {pdfPasswordFormStyles as styles} from './styles';

type Props = {
    isPasswordInvalid: boolean;
    isFocused: boolean;
    onSubmit: (password: string) => void;
    onPasswordUpdated: (password: string) => void;
    onPasswordFieldFocused: (isFocused: boolean) => void;
};

const propTypes = {
    /** If the submitted password is invalid (show an error message) */
    isPasswordInvalid: PropTypes.bool,

    /** Should focus to the password input  */
    isFocused: PropTypes.bool.isRequired,

    /** Notify parent that the password form has been submitted */
    onSubmit: PropTypes.func,

    /** Notify parent that the password has been updated/edited */
    onPasswordUpdated: PropTypes.func,

    /** Notify parent that a text field has been focused or blurred */
    onPasswordFieldFocused: PropTypes.func,
};

const defaultProps = {
    isPasswordInvalid: false,
    onSubmit: () => {},
    onPasswordUpdated: () => {},
    onPasswordFieldFocused: () => {},
};

// @ts-expect-error TODO: Comment
const isSafari = Boolean(window.safari);

function PDFPasswordForm({isPasswordInvalid, isFocused, onSubmit, onPasswordUpdated, onPasswordFieldFocused}: Props) {
    const [password, setPassword] = useState('');
    const [validationErrorText, setValidationErrorText] = useState('');
    const [shouldShowForm, setShouldShowForm] = useState(false);
    const textInputRef = useRef<HTMLInputElement>(null);

    const updatePassword = (event: ChangeEvent<HTMLInputElement>) => {
        const newPassword = event.target.value;

        setPassword(newPassword);
        onPasswordUpdated(newPassword);
    };

    const validate = () => {
        if (!isPasswordInvalid && !password) {
            return true;
        }

        if (!password) {
            setValidationErrorText('Password required');
        }

        return false;
    };

    const submitPassword = () => {
        if (!validate()) {
            return;
        }

        onSubmit(password);
    };

    const validateAndNotifyPasswordBlur = () => {
        validate();

        onPasswordFieldFocused?.(false);
    };

    useEffect(() => {
        if (!isFocused) {
            return;
        }

        textInputRef.current?.focus();
    }, [isFocused]);

    if (!shouldShowForm) {
        return (
            <div style={styles.container}>
                <p style={styles.infoMessage}>
                    This PDF is password protected.
                    <br />
                    Please&nbsp;
                    <span
                        style={styles.infoMessageButton}
                        aria-hidden="true"
                        onClick={() => setShouldShowForm(true)}
                    >
                        enter the password
                    </span>
                    &nbsp;to view it.
                </p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <p style={styles.infoMessage}>View PDF</p>

            <form
                style={styles.form}
                onSubmit={submitPassword}
            >
                <label
                    style={styles.inputLabel}
                    htmlFor="password"
                >
                    Password:
                    <input
                        style={styles.input}
                        ref={textInputRef}
                        id="password"
                        value={password}
                        /**
                         * This is a workaround to bypass Safari's autofill odd behaviour.
                         * This tricks the browser not to fill the username somewhere else and still fill the password correctly.
                         */
                        autoComplete={isSafari ? 'username' : 'off'}
                        type="password"
                        onFocus={() => onPasswordFieldFocused(true)}
                        onBlur={validateAndNotifyPasswordBlur}
                        onChange={updatePassword}
                        onSubmit={submitPassword}
                    />
                </label>

                {!!validationErrorText && <p style={styles.errorMessage}>{validationErrorText}</p>}

                <input
                    style={styles.confirmButton}
                    type="submit"
                    value="Confirm"
                />
            </form>
        </div>
    );
}

PDFPasswordForm.propTypes = propTypes;
PDFPasswordForm.defaultProps = defaultProps;
PDFPasswordForm.displayName = 'PDFPasswordForm';

export default PDFPasswordForm;
