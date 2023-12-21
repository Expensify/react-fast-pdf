"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const prop_types_1 = __importDefault(require("prop-types"));
const styles_1 = require("./styles");
const helpers_1 = require("./helpers");
const propTypes = {
    /** If the submitted password is invalid (show an error message) */
    isPasswordInvalid: prop_types_1.default.bool,
    /** Notify parent that the password form has been submitted */
    onSubmit: prop_types_1.default.func,
    /** Notify parent that the password has been updated/edited */
    onPasswordChange: prop_types_1.default.func,
    /** Notify parent that a text field has been focused or blurred */
    onPasswordFieldFocus: prop_types_1.default.func,
};
const defaultProps = {
    isPasswordInvalid: false,
    onSubmit: () => { },
    onPasswordChange: () => { },
    onPasswordFieldFocus: () => { },
};
function PDFPasswordForm({ isPasswordInvalid, onSubmit, onPasswordChange, onPasswordFieldFocus }) {
    const [password, setPassword] = (0, react_1.useState)('');
    const [validationErrorText, setValidationErrorText] = (0, react_1.useState)('');
    const [shouldShowForm, setShouldShowForm] = (0, react_1.useState)(false);
    const textInputRef = (0, react_1.useRef)(null);
    const errorText = (0, react_1.useMemo)(() => {
        if (isPasswordInvalid) {
            return 'Incorrect password. Please try again.';
        }
        if (validationErrorText) {
            return validationErrorText;
        }
        return '';
    }, [isPasswordInvalid, validationErrorText]);
    const updatePassword = (event) => {
        const newPassword = event.target.value;
        setPassword(newPassword);
        onPasswordChange === null || onPasswordChange === void 0 ? void 0 : onPasswordChange(newPassword);
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
    const submitPassword = (e) => {
        e.preventDefault();
        if (!validate()) {
            return;
        }
        onSubmit === null || onSubmit === void 0 ? void 0 : onSubmit(password);
    };
    const validateAndNotifyPasswordBlur = () => {
        validate();
        onPasswordFieldFocus === null || onPasswordFieldFocus === void 0 ? void 0 : onPasswordFieldFocus(false);
    };
    if (!shouldShowForm) {
        return (react_1.default.createElement("div", { style: styles_1.pdfPasswordFormStyles.container },
            react_1.default.createElement("p", { style: styles_1.pdfPasswordFormStyles.infoMessage },
                "This PDF is password protected.",
                react_1.default.createElement("br", null),
                "Please\u00A0",
                react_1.default.createElement("span", { style: styles_1.pdfPasswordFormStyles.infoMessageButton, "aria-hidden": "true", onClick: () => setShouldShowForm(true) }, "enter the password"),
                "\u00A0to view it.")));
    }
    return (react_1.default.createElement("div", { style: styles_1.pdfPasswordFormStyles.container },
        react_1.default.createElement("p", { style: styles_1.pdfPasswordFormStyles.infoMessage }, "View PDF"),
        react_1.default.createElement("form", { style: styles_1.pdfPasswordFormStyles.form, onSubmit: submitPassword },
            react_1.default.createElement("label", { style: styles_1.pdfPasswordFormStyles.inputLabel, htmlFor: "password" },
                "Password:",
                react_1.default.createElement("input", { style: styles_1.pdfPasswordFormStyles.input, ref: textInputRef, id: "password", value: password, 
                    /**
                     * This is a workaround to bypass Safari's autofill odd behaviour.
                     * This tricks the browser not to fill the username somewhere else and still fill the password correctly.
                     */
                    autoComplete: (0, helpers_1.isSafari)() ? 'username' : 'off', 
                    // eslint-disable-next-line jsx-a11y/no-autofocus
                    autoFocus: true, type: "password", onFocus: () => onPasswordFieldFocus === null || onPasswordFieldFocus === void 0 ? void 0 : onPasswordFieldFocus(true), onBlur: validateAndNotifyPasswordBlur, onChange: updatePassword })),
            !!errorText && react_1.default.createElement("p", { style: styles_1.pdfPasswordFormStyles.errorMessage }, errorText),
            react_1.default.createElement("input", { style: styles_1.pdfPasswordFormStyles.confirmButton, type: "submit", value: "Confirm" }))));
}
PDFPasswordForm.propTypes = propTypes;
PDFPasswordForm.defaultProps = defaultProps;
PDFPasswordForm.displayName = 'PDFPasswordForm';
exports.default = PDFPasswordForm;
