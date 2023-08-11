import _ from 'underscore';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { VariableSizeList as List } from 'react-window';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import styles from './styles';
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
    // Useful for elements that should not be navigated to directly using the "Tab" key,
    // but need to have keyboard focus set to them.
    // eslint-disable-next-line no-param-reassign
    ref.tabIndex = -1;
};
const propTypes = {
    file: PropTypes.string.isRequired,
    pageMaxWidth: PropTypes.number.isRequired,
    isSmallScreen: PropTypes.bool.isRequired,
};
pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.js', import.meta.url).toString();
function PDFPreviewer({ pageMaxWidth, isSmallScreen, file }) {
    var _a, _b;
    const [pageViewports, setPageViewports] = useState([]);
    const [numPages, setNumPages] = useState(0);
    const [containerWidth, setContainerWidth] = useState(1000);
    const [containerHeight, setContainerHeight] = useState(1000);
    const containerRef = useRef(null);
    /**
     * Calculates a proper page width.
     * It depends on a screen size. Also, the app should take into account the page borders.
     */
    const calculatePageWidth = useCallback(() => {
        const pageWidthOnLargeScreen = Math.min(containerWidth - LARGE_SCREEN_SIDE_SPACING * 2, pageMaxWidth);
        const pageWidth = isSmallScreen ? containerWidth : pageWidthOnLargeScreen;
        return pageWidth + PAGE_BORDER * 2;
    }, [containerWidth, pageMaxWidth, isSmallScreen]);
    /**
     * Calculates a proper page height. The method should be called only when there are page viewports.
     * It is based on a ratio between the specific page viewport width and provided page width.
     * Also, the app should take into account the page borders.
     */
    const calculatePageHeight = useCallback((pageIndex) => {
        if (pageViewports.length === 0) {
            // eslint-disable-next-line no-console
            console.warn('Dev error: calculatePageHeight() in PDFView called too early');
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
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        Promise.all(_.times(pdf.numPages, (index) => {
            const pageNumber = index + 1;
            return pdf.getPage(pageNumber).then((page) => page.getViewport({ scale: 1 }));
        })).then((viewports) => {
            setPageViewports(viewports);
            setNumPages(pdf.numPages);
            // shouldRequestPassword: false,
            // isPasswordInvalid: false,
        });
    };
    /**
     * Render a specific page based on its index.
     * The method includes a wrapper to apply virtualized styles.
     */
    const renderPage = useCallback(
    // eslint-disable-next-line react/no-unused-prop-types
    ({ index, style }) => {
        const pageWidth = calculatePageWidth();
        return (React.createElement("div", { style: style },
            React.createElement(Page, { key: `page_${index}`, width: pageWidth, pageIndex: index, 
                // This needs to be empty to avoid multiple loading texts which show per page and look ugly
                // See https://github.com/Expensify/App/issues/14358 for more details
                loading: "" })));
    }, [calculatePageWidth]);
    useEffect(() => {
        var _a, _b, _c, _d, _e, _f;
        console.log('containerRef.current?.clientHeight', (_a = containerRef.current) === null || _a === void 0 ? void 0 : _a.clientHeight);
        console.log('containerRef.current?.clientWidth', (_b = containerRef.current) === null || _b === void 0 ? void 0 : _b.clientWidth);
        if ((_c = containerRef.current) === null || _c === void 0 ? void 0 : _c.clientHeight) {
            setContainerHeight((_d = containerRef.current) === null || _d === void 0 ? void 0 : _d.clientHeight);
        }
        if ((_e = containerRef.current) === null || _e === void 0 ? void 0 : _e.clientWidth) {
            setContainerWidth((_f = containerRef.current) === null || _f === void 0 ? void 0 : _f.clientWidth);
        }
    }, [(_a = containerRef.current) === null || _a === void 0 ? void 0 : _a.clientHeight, (_b = containerRef.current) === null || _b === void 0 ? void 0 : _b.clientWidth]);
    return (React.createElement("div", { ref: containerRef, style: styles.container },
        React.createElement(Document, { file: file, options: DEFAULT_DOCUMENT_OPTIONS, externalLinkTarget: DEFAULT_EXTERNAL_LINK_TARGET, error: React.createElement("p", null, "Failed to load the PDF file :("), loading: React.createElement("p", null, "Loading..."), onLoadSuccess: onDocumentLoadSuccess, onPassword: () => { } }, pageViewports.length > 0 && (React.createElement(List, { style: styles.list, outerRef: setListAttributes, width: isSmallScreen ? calculatePageWidth() : containerWidth, height: containerHeight, itemCount: numPages, itemSize: calculatePageHeight, estimatedItemSize: calculatePageHeight(0) }, renderPage)))));
}
PDFPreviewer.propTypes = propTypes;
export default memo(PDFPreviewer);
