"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PDF_PASSWORD_FORM_RESPONSES = exports.DEFAULT_EXTERNAL_LINK_TARGET = exports.DEFAULT_DOCUMENT_OPTIONS = exports.LARGE_SCREEN_SIDE_SPACING = exports.PAGE_BORDER = void 0;
/**
 * Each page has a default border. The app should take this size into account
 * when calculates the page width and height.
 */
const PAGE_BORDER = 9;
exports.PAGE_BORDER = PAGE_BORDER;
/**
 * Pages should be more narrow than the container on large screens. The app should take this size into account
 * when calculates the page width.
 */
const LARGE_SCREEN_SIDE_SPACING = 40;
exports.LARGE_SCREEN_SIDE_SPACING = LARGE_SCREEN_SIDE_SPACING;
/**
 * An object in which additional parameters to be passed to PDF.js can be defined.
 * 1. cMapUrl - The URL where the predefined Adobe CMaps are located. Include the trailing slash.
 * 2. cMapPacked - specifies if the Adobe CMaps are binary packed or not. The default value is `true`.
 */
const DEFAULT_DOCUMENT_OPTIONS = {
    cMapUrl: 'cmaps/',
    cMapPacked: true,
};
exports.DEFAULT_DOCUMENT_OPTIONS = DEFAULT_DOCUMENT_OPTIONS;
/**
 * Link target for external links rendered in annotations.
 */
const DEFAULT_EXTERNAL_LINK_TARGET = '_blank';
exports.DEFAULT_EXTERNAL_LINK_TARGET = DEFAULT_EXTERNAL_LINK_TARGET;
/**
 * Constants for password-related error responses received from react-pdf.
 */
const PDF_PASSWORD_FORM_RESPONSES = {
    NEED_PASSWORD: 1,
    INCORRECT_PASSWORD: 2,
};
exports.PDF_PASSWORD_FORM_RESPONSES = PDF_PASSWORD_FORM_RESPONSES;
