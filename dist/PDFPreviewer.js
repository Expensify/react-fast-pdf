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
const times_1 = __importDefault(require("lodash/times"));
const prop_types_1 = __importDefault(require("prop-types"));
const react_window_1 = require("react-window");
const react_pdf_1 = require("react-pdf");
require("react-pdf/dist/Page/AnnotationLayer.css");
require("react-pdf/dist/Page/TextLayer.css");
const styles_1 = __importDefault(require("./styles"));
/**
 * Each page has a default border. The app should take this size into account
 * when calculates the page width and height.
 */
const PAGE_BORDER = 9;
/**
 * Pages should be more narrow than the container on large screens. The app should take this size into account
 * when calculates the page width.
 */
const LARGE_SCREEN_SIDE_SPACING = 40;
// TODO: Comment
const DEFAULT_DOCUMENT_OPTIONS = {
    cMapUrl: 'cmaps/',
    cMapPacked: true,
};
// TODO: Comment
const DEFAULT_EXTERNAL_LINK_TARGET = '_blank';
/**
 * Sets attributes to list container.
 * It unblocks a default scroll by keyboard of browsers.
 */
const setListAttributes = (ref) => {
    if (!ref) {
        return;
    }
    /**
     *  Useful for elements that should not be navigated to directly using the "Tab" key,
     * but need to have keyboard focus set to them.
     */
    // eslint-disable-next-line no-param-reassign
    ref.tabIndex = -1;
};
const propTypes = {
    file: prop_types_1.default.string.isRequired,
    pageMaxWidth: prop_types_1.default.number.isRequired,
    isSmallScreen: prop_types_1.default.bool.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    containerStyle: prop_types_1.default.object,
    // eslint-disable-next-line react/forbid-prop-types
    contentContainerStyle: prop_types_1.default.object,
};
const defaultProps = {
    containerStyle: {},
    contentContainerStyle: {},
};
// @ts-expect-error - It is a recommended step for import worker - https://github.com/wojtekmaj/react-pdf/blob/main/packages/react-pdf/README.md#import-worker-recommended
react_pdf_1.pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.js', import.meta.url).toString();
function PDFPreviewer({ pageMaxWidth, isSmallScreen, file, containerStyle, contentContainerStyle }) {
    const [pageViewports, setPageViewports] = (0, react_1.useState)([]);
    const [numPages, setNumPages] = (0, react_1.useState)(0);
    const [containerWidth, setContainerWidth] = (0, react_1.useState)(0);
    const [containerHeight, setContainerHeight] = (0, react_1.useState)(0);
    const containerRef = (0, react_1.useRef)(null);
    /**
     * Calculates a proper page width.
     * It depends on a screen size. Also, the app should take into account the page borders.
     */
    const calculatePageWidth = (0, react_1.useCallback)(() => {
        const pageWidthOnLargeScreen = Math.min(containerWidth - LARGE_SCREEN_SIDE_SPACING * 2, pageMaxWidth);
        const pageWidth = isSmallScreen ? containerWidth : pageWidthOnLargeScreen;
        return pageWidth + PAGE_BORDER * 2;
    }, [containerWidth, pageMaxWidth, isSmallScreen]);
    /**
     * Calculates a proper page height. The method should be called only when there are page viewports.
     * It is based on a ratio between the specific page viewport width and provided page width.
     * Also, the app should take into account the page borders.
     */
    const calculatePageHeight = (0, react_1.useCallback)((pageIndex) => {
        if (pageViewports.length === 0) {
            return 0;
        }
        const pageWidth = calculatePageWidth();
        const { width: pageViewportWidth, height: pageViewportHeight } = pageViewports[pageIndex];
        const scale = pageWidth / pageViewportWidth;
        return pageViewportHeight * scale + PAGE_BORDER * 2;
    }, [pageViewports, calculatePageWidth]);
    /**
     * Upon successful document load, combine an array of page viewports,
     * set the number of pages on PDF,
     * hide/reset PDF password form, and notify parent component that
     * user input is no longer required.
     */
    const onDocumentLoadSuccess = (pdf) => {
        Promise.all((0, times_1.default)(pdf.numPages, (index) => {
            const pageNumber = index + 1;
            return pdf.getPage(pageNumber).then((page) => page.getViewport({ scale: 1 }));
        })).then((viewports) => {
            setPageViewports(viewports);
            setNumPages(pdf.numPages);
            // TODO: Implement behaviour
            // shouldRequestPassword: false,
            // isPasswordInvalid: false,
        }, () => { });
    };
    /**
     * Render a specific page based on its index.
     * The method includes a wrapper to apply virtualized styles.
     */
    const renderPage = (0, react_1.useCallback)(
    // eslint-disable-next-line react/no-unused-prop-types
    ({ index, style }) => {
        const pageWidth = calculatePageWidth();
        return (react_1.default.createElement("div", { style: style },
            react_1.default.createElement(react_pdf_1.Page, { key: `page_${index}`, width: pageWidth, pageIndex: index, 
                // This needs to be empty to avoid multiple loading texts which show per page and look ugly
                // See https://github.com/Expensify/App/issues/14358 for more details
                loading: "" })));
    }, [calculatePageWidth]);
    (0, react_1.useLayoutEffect)(() => {
        var _a, _b, _c, _d;
        setContainerWidth((_b = (_a = containerRef.current) === null || _a === void 0 ? void 0 : _a.clientWidth) !== null && _b !== void 0 ? _b : 0);
        setContainerHeight((_d = (_c = containerRef.current) === null || _c === void 0 ? void 0 : _c.clientHeight) !== null && _d !== void 0 ? _d : 0);
    }, []);
    return (react_1.default.createElement("div", { ref: containerRef, style: Object.assign(Object.assign({}, styles_1.default.container), containerStyle) },
        react_1.default.createElement(react_pdf_1.Document, { file: file, options: DEFAULT_DOCUMENT_OPTIONS, externalLinkTarget: DEFAULT_EXTERNAL_LINK_TARGET, error: react_1.default.createElement("p", null, "Failed to load the PDF file :("), loading: react_1.default.createElement("p", null, "Loading..."), onLoadSuccess: onDocumentLoadSuccess, 
            // TODO: Implement behaviour
            onPassword: () => { } }, pageViewports.length > 0 && (react_1.default.createElement(react_window_1.VariableSizeList, { style: Object.assign(Object.assign({}, styles_1.default.list), contentContainerStyle), outerRef: setListAttributes, width: containerWidth, height: containerHeight, itemCount: numPages, itemSize: calculatePageHeight, estimatedItemSize: calculatePageHeight(0) }, renderPage)))));
}
PDFPreviewer.propTypes = propTypes;
PDFPreviewer.defaultProps = defaultProps;
exports.default = (0, react_1.memo)(PDFPreviewer);
