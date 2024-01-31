/**
 * Each page has a default border. The app should take this size into account
 * when calculates the page width and height.
 */
declare const PAGE_BORDER = 9;
/**
 * Pages should be more narrow than the container on large screens. The app should take this size into account
 * when calculates the page width.
 */
declare const LARGE_SCREEN_SIDE_SPACING = 40;
/**
 * An object in which additional parameters to be passed to PDF.js can be defined.
 * 1. cMapUrl - The URL where the predefined Adobe CMaps are located. Include the trailing slash.
 * 2. cMapPacked - specifies if the Adobe CMaps are binary packed or not. The default value is `true`.
 */
declare const DEFAULT_DOCUMENT_OPTIONS: {
    cMapUrl: string;
    cMapPacked: boolean;
};
/**
 * Link target for external links rendered in annotations.
 */
declare const DEFAULT_EXTERNAL_LINK_TARGET = "_blank";
/**
 * Constants for password-related error responses received from react-pdf.
 */
declare const PDF_PASSWORD_FORM_RESPONSES: {
    NEED_PASSWORD: number;
    INCORRECT_PASSWORD: number;
};
export { PAGE_BORDER, LARGE_SCREEN_SIDE_SPACING, DEFAULT_DOCUMENT_OPTIONS, DEFAULT_EXTERNAL_LINK_TARGET, PDF_PASSWORD_FORM_RESPONSES };
//# sourceMappingURL=constants.d.ts.map