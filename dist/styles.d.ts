declare const styles: {
    container: {
        width: string;
        height: string;
        /**
         * It's being used on Web/Desktop only to vertically center short PDFs,
         * while preventing the overflow of the top of long PDF files.
         */
        display: string;
    };
    list: {
        readonly overflowX: "hidden";
        readonly boxShadow: "none";
        readonly outline: "none";
    };
};
export default styles;
//# sourceMappingURL=styles.d.ts.map