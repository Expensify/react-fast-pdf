"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pdfPasswordFormStyles = exports.pdfPreviewerStyles = void 0;
const pdfPreviewerStyles = {
    container: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    innerContainer: {
        width: '100%',
        height: '100%',
        /**
         * It's being used on Web/Desktop only to vertically center short PDFs,
         * while preventing the overflow of the top of long PDF files.
         */
        display: 'grid',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    invisibleContainer: {
        position: 'absolute',
        opacity: 0,
        zIndex: -1,
    },
    list: {
        overflowX: 'hidden',
        // There properties disable "focus" effect on list
        boxShadow: 'none',
        outline: 'none',
    },
    pageWrapper: {
        display: 'flex',
    },
};
exports.pdfPreviewerStyles = pdfPreviewerStyles;
const pdfPasswordFormStyles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#07271f',
    },
    infoMessage: {
        fontSize: 18,
        textAlign: 'center',
    },
    infoMessageButton: {
        textDecoration: 'underline',
        cursor: 'pointer',
    },
    form: {
        marginTop: 16,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    inputLabel: {
        fontSize: 16,
    },
    input: {
        marginLeft: 16,
        padding: '8px 16px',
        fontSize: 16,
        border: 0,
        borderRadius: 16,
        backgroundColor: '#184e3d',
        outline: 'none',
    },
    errorMessage: {
        marginTop: 8,
        color: '#f25730',
        fontSize: 16,
        textAlign: 'center',
    },
    confirmButton: {
        marginTop: 16,
        padding: '8px 16px',
        fontSize: 18,
        border: 0,
        borderRadius: 16,
        backgroundColor: '#03d47c',
        cursor: 'pointer',
    },
};
exports.pdfPasswordFormStyles = pdfPasswordFormStyles;
