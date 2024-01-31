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
const styles_1 = require("./styles");
const PDFPasswordForm_1 = __importDefault(require("./PDFPasswordForm"));
const PageRenderer_1 = __importDefault(require("./PageRenderer"));
const constants_1 = require("./constants");
const helpers_1 = require("./helpers");
const propTypes = {
    file: prop_types_1.default.string.isRequired,
    pageMaxWidth: prop_types_1.default.number.isRequired,
    isSmallScreen: prop_types_1.default.bool.isRequired,
    maxCanvasWidth: prop_types_1.default.number,
    maxCanvasHeight: prop_types_1.default.number,
    maxCanvasArea: prop_types_1.default.number,
    renderPasswordForm: prop_types_1.default.func,
    LoadingComponent: prop_types_1.default.node,
    ErrorComponent: prop_types_1.default.node,
    // eslint-disable-next-line react/forbid-prop-types
    containerStyle: prop_types_1.default.object,
    // eslint-disable-next-line react/forbid-prop-types
    contentContainerStyle: prop_types_1.default.object,
};
const defaultProps = {
    maxCanvasWidth: null,
    maxCanvasHeight: null,
    maxCanvasArea: null,
    renderPasswordForm: null,
    LoadingComponent: react_1.default.createElement("p", null, "Loading..."),
    ErrorComponent: react_1.default.createElement("p", null, "Failed to load the PDF file :("),
    containerStyle: {},
    contentContainerStyle: {},
};
// @ts-expect-error - It is a recommended step for import worker - https://github.com/wojtekmaj/react-pdf/blob/main/packages/react-pdf/README.md#import-worker-recommended
react_pdf_1.pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.js', import.meta.url).toString();
function PDFPreviewer({ file, pageMaxWidth, isSmallScreen, maxCanvasWidth, maxCanvasHeight, maxCanvasArea, LoadingComponent, ErrorComponent, renderPasswordForm, containerStyle, contentContainerStyle, }) {
    const [pageViewports, setPageViewports] = (0, react_1.useState)([]);
    const [numPages, setNumPages] = (0, react_1.useState)(0);
    const [containerWidth, setContainerWidth] = (0, react_1.useState)(0);
    const [containerHeight, setContainerHeight] = (0, react_1.useState)(0);
    const [shouldRequestPassword, setShouldRequestPassword] = (0, react_1.useState)(false);
    const [isPasswordInvalid, setIsPasswordInvalid] = (0, react_1.useState)(false);
    const containerRef = (0, react_1.useRef)(null);
    const onPasswordCallbackRef = (0, react_1.useRef)(null);
    /**
     * Calculate the devicePixelRatio the page should be rendered with
     * Each platform has a different default devicePixelRatio and different canvas limits, we need to verify that
     * with the default devicePixelRatio it will be able to diplay the pdf correctly, if not we must change the devicePixelRatio.
     * @param {Number} width of the page
     * @param {Number} height of the page
     * @returns {Number} devicePixelRatio for this page on this platform
     */
    const getDevicePixelRatio = (width, height) => {
        if (!maxCanvasWidth || !maxCanvasHeight || !maxCanvasArea) {
            return undefined;
        }
        const nbPixels = width * height;
        const ratioHeight = maxCanvasHeight / height;
        const ratioWidth = maxCanvasWidth / width;
        const ratioArea = Math.sqrt(maxCanvasArea / nbPixels);
        const ratio = Math.min(ratioHeight, ratioArea, ratioWidth);
        if (ratio > window.devicePixelRatio) {
            return undefined;
        }
        return ratio;
    };
    /**
     * Calculates a proper page width.
     * It depends on a screen size. Also, the app should take into account the page borders.
     */
    const calculatePageWidth = (0, react_1.useCallback)(() => {
        const pageWidthOnLargeScreen = Math.min(containerWidth - constants_1.LARGE_SCREEN_SIDE_SPACING * 2, pageMaxWidth);
        const pageWidth = isSmallScreen ? containerWidth : pageWidthOnLargeScreen;
        return pageWidth + constants_1.PAGE_BORDER * 2;
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
        return pageViewportHeight * scale + constants_1.PAGE_BORDER * 2;
    }, [pageViewports, calculatePageWidth]);
    const estimatedPageHeight = calculatePageHeight(0);
    const pageWidth = calculatePageWidth();
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
            setShouldRequestPassword(false);
            setIsPasswordInvalid(false);
        }, () => { });
    };
    /**
     * Initiate password challenge process. The react-pdf/Document
     * component calls this handler to indicate that a PDF requires a
     * password, or to indicate that a previously provided password was
     * invalid.
     *
     * The PasswordResponses constants used below were copied from react-pdf
     * because they're not exported in entry.webpack.
     */
    const initiatePasswordChallenge = (callback, reason) => {
        onPasswordCallbackRef.current = callback;
        if (reason === constants_1.PDF_PASSWORD_FORM_RESPONSES.NEED_PASSWORD) {
            setShouldRequestPassword(true);
        }
        else if (reason === constants_1.PDF_PASSWORD_FORM_RESPONSES.INCORRECT_PASSWORD) {
            setShouldRequestPassword(true);
            setIsPasswordInvalid(true);
        }
    };
    /**
     * Send password to react-pdf via its callback so that it can attempt to load
     * the PDF.
     */
    const attemptPDFLoad = (password) => {
        var _a;
        (_a = onPasswordCallbackRef.current) === null || _a === void 0 ? void 0 : _a.call(onPasswordCallbackRef, password);
    };
    /**
     * Render a form to handle password typing.
     * The method renders the passed or default component.
     */
    const internalRenderPasswordForm = (0, react_1.useCallback)(() => {
        const onSubmit = attemptPDFLoad;
        const onPasswordChange = () => setIsPasswordInvalid(false);
        if (typeof renderPasswordForm === 'function') {
            return renderPasswordForm({
                isPasswordInvalid,
                onSubmit,
                onPasswordChange,
            });
        }
        return (react_1.default.createElement(PDFPasswordForm_1.default, { isPasswordInvalid: isPasswordInvalid, onSubmit: onSubmit, onPasswordChange: onPasswordChange }));
    }, [isPasswordInvalid, attemptPDFLoad, setIsPasswordInvalid, renderPasswordForm]);
    (0, react_1.useLayoutEffect)(() => {
        var _a, _b, _c, _d;
        setContainerWidth((_b = (_a = containerRef.current) === null || _a === void 0 ? void 0 : _a.clientWidth) !== null && _b !== void 0 ? _b : 0);
        setContainerHeight((_d = (_c = containerRef.current) === null || _c === void 0 ? void 0 : _c.clientHeight) !== null && _d !== void 0 ? _d : 0);
    }, []);
    return (react_1.default.createElement("div", { ref: containerRef, style: Object.assign(Object.assign({}, styles_1.pdfPreviewerStyles.container), containerStyle) },
        react_1.default.createElement("div", { style: Object.assign(Object.assign({}, styles_1.pdfPreviewerStyles.innerContainer), (shouldRequestPassword ? styles_1.pdfPreviewerStyles.invisibleContainer : {})) },
            react_1.default.createElement(react_pdf_1.Document, { file: file, options: constants_1.DEFAULT_DOCUMENT_OPTIONS, externalLinkTarget: constants_1.DEFAULT_EXTERNAL_LINK_TARGET, error: ErrorComponent, loading: LoadingComponent, onLoadSuccess: onDocumentLoadSuccess, onPassword: initiatePasswordChallenge }, pageViewports.length > 0 && (react_1.default.createElement(react_window_1.VariableSizeList, { style: Object.assign(Object.assign({}, styles_1.pdfPreviewerStyles.list), contentContainerStyle), outerRef: helpers_1.setListAttributes, width: pageWidth, height: containerHeight, itemCount: numPages, itemSize: calculatePageHeight, estimatedItemSize: calculatePageHeight(0), itemData: { pageWidth, estimatedPageHeight, calculatePageHeight, getDevicePixelRatio } }, PageRenderer_1.default)))),
        shouldRequestPassword && internalRenderPasswordForm()));
}
PDFPasswordForm_1.default.displayName = 'PDFPreviewer';
PDFPreviewer.propTypes = propTypes;
PDFPreviewer.defaultProps = defaultProps;
exports.default = (0, react_1.memo)(PDFPreviewer);
