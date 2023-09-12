const styles = {
    container: {
        width: '100%',
        height: '100%',
        /**
         * It's being used on Web/Desktop only to vertically center short PDFs,
         * while preventing the overflow of the top of long PDF files.
         */
        display: 'grid',
    },
    list: {
        overflowX: 'hidden',
        // There properties disable "focus" effect on list
        boxShadow: 'none',
        outline: 'none',
    } as const,
};

export default styles;
