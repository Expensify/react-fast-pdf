import React, {useState, useRef, useMemo, type ChangeEvent, type FormEventHandler} from 'react';

import {pdfPasswordFormStyles as styles} from './styles';
import {isSafari} from './helpers';

type Props = {
    isPasswordInvalid?: boolean;
    onSubmit?: (password: string) => void;
    onPasswordChange?: (password: string) => void;
    onPasswordFieldFocus?: (isFocused: boolean) => void;
};

function PDFPasswordForm({isPasswordInvalid, onSubmit, onPasswordChange, onPasswordFieldFocus}: Props) {
    const [password, setPassword] = useState('');
    const [validationErrorText, setValidationErrorText] = useState('');
    const [shouldShowForm, setShouldShowForm] = useState(false);

    const textInputRef = useRef<HTMLInputElement>(null);

    const errorText = useMemo(() => {
        if (isPasswordInvalid) {
            return 'Incorrect password. Please try again.';
        }

        if (validationErrorText) {
            return validationErrorText;
        }

        return '';
    }, [isPasswordInvalid, validationErrorText]);

    const updatePassword = (event: ChangeEvent<HTMLInputElement>) => {
        const newPassword = event.target.value;

        setPassword(newPassword);
        onPasswordChange?.(newPassword);
        setValidationErrorText('');
    };

    const validate = () => {
        if (!isPasswordInvalid && password) {
            return true;
        }

        if (!password) {
            setValidationErrorText('Password required. Pleaser enter.');
        }

        return false;
    };

    const submitPassword: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        onSubmit?.(password);
    };

    const validateAndNotifyPasswordBlur = () => {
        validate();

        onPasswordFieldFocus?.(false);
    };

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
                        autoComplete={isSafari() ? 'username' : 'off'}
                        // eslint-disable-next-line jsx-a11y/no-autofocus
                        autoFocus
                        type="password"
                        onFocus={() => onPasswordFieldFocus?.(true)}
                        onBlur={validateAndNotifyPasswordBlur}
                        onChange={updatePassword}
                    />
                </label>

                {!!errorText && <p style={styles.errorMessage}>{errorText}</p>}

                <input
                    style={styles.confirmButton}
                    type="submit"
                    value="Confirm"
                />
            </form>
        </div>
    );
}

PDFPasswordForm.displayName = 'PDFPasswordForm';

export type {Props as PDFPasswordFormProps};
export default PDFPasswordForm;
