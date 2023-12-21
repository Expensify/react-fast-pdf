import type {ComponentStyles} from './types';

const pdfPreviewerStyles: ComponentStyles = {
    container: {
        width: '100%',
        height: '100%',
        /**
         * It's being used on Web/Desktop only to vertically center short PDFs,
         * while preventing the overflow of the top of long PDF files.
         */
        display: 'grid',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    list: {
        overflowX: 'hidden',
        // There properties disable "focus" effect on list
        boxShadow: 'none',
        outline: 'none',
    } as const,
    pageWrapper: {
        display: 'flex',
    },
};

const pdfPasswordFormStyles: ComponentStyles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        zIndex: 1,
        bottom: 0,
        right: 0,
        left: 0,
        top: 0,
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

export {pdfPreviewerStyles, pdfPasswordFormStyles};
