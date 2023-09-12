import _ from 'underscore';
import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {VariableSizeList as List} from 'react-window';
import {Document, Page, pdfjs} from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import styles from './styles';
import type {PDFDocument, PageViewport} from './types';

type Props = {
    file: string;
    pageMaxWidth: number;
    isSmallScreen: boolean;
    containerStyle: React.CSSProperties;
};

type ListRef = {
    tabIndex: number;
};

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
const setListAttributes = (ref: ListRef | undefined) => {
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
    // eslint-disable-next-line react/forbid-prop-types
    containerStyle: PropTypes.object.isRequired,
};

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.js', import.meta.url).toString();

function PDFPreviewer({pageMaxWidth, isSmallScreen, file, containerStyle}: Props) {
    const [pageViewports, setPageViewports] = useState<PageViewport[]>([]);
    const [numPages, setNumPages] = useState(0);
    const [containerWidth, setContainerWidth] = useState(1000);
    const [containerHeight, setContainerHeight] = useState(1000);
    const containerRef = useRef<HTMLDivElement>(null);

    // TODO: Comment
    const setContainerDimensions = useCallback(() => {
        // eslint-disable-next-line no-console
        console.log('containerRef.current?.clientHeight', containerRef.current?.clientHeight);
        // eslint-disable-next-line no-console
        console.log('containerRef.current?.clientWidth', containerRef.current?.clientWidth);

        setContainerWidth(containerRef.current?.clientHeight ?? 0);
        setContainerHeight(containerRef.current?.clientWidth ?? 0);
    }, [containerRef.current]);

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
    const calculatePageHeight = useCallback(
        (pageIndex: number) => {
            if (pageViewports.length === 0) {
                // eslint-disable-next-line no-console
                console.warn('Dev error: calculatePageHeight() in PDFView called too early');

                return 0;
            }

            const pageWidth = calculatePageWidth();
            const {width: pageViewportWidth, height: pageViewportHeight} = pageViewports[pageIndex];
            const scale = pageWidth / pageViewportWidth;

            return pageViewportHeight * scale + PAGE_BORDER * 2;
        },
        [pageViewports, calculatePageWidth],
    );

    /**
     * Upon successful document load, combine an array of page viewports,
     * set the number of pages on PDF,
     * hide/reset PDF password form, and notify parent component that
     * user input is no longer required.
     */
    const onDocumentLoadSuccess = (pdf: PDFDocument) => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        Promise.all(
            _.times(pdf.numPages, (index: number) => {
                const pageNumber = index + 1;

                return pdf.getPage(pageNumber).then((page) => page.getViewport({scale: 1}));
            }),
        ).then((viewports: PageViewport[]) => {
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
        ({index, style}: {index: number; style: object}) => {
            const pageWidth = calculatePageWidth();

            return (
                <div style={style}>
                    <Page
                        key={`page_${index}`}
                        width={pageWidth}
                        pageIndex={index}
                        // This needs to be empty to avoid multiple loading texts which show per page and look ugly
                        // See https://github.com/Expensify/App/issues/14358 for more details
                        loading=""
                    />
                </div>
            );
        },
        [calculatePageWidth],
    );

    useEffect(() => {
        window.addEventListener('load', setContainerDimensions);
        window.addEventListener('resize', setContainerDimensions);

        return () => {
            window.removeEventListener('load', setContainerDimensions);
            window.removeEventListener('resize', setContainerDimensions);
        };
    }, [setContainerDimensions]);

    return (
        <div
            ref={containerRef}
            style={Object.assign(styles.container, containerStyle)}
        >
            <Document
                file={file}
                options={DEFAULT_DOCUMENT_OPTIONS}
                externalLinkTarget={DEFAULT_EXTERNAL_LINK_TARGET}
                error={<p>Failed to load the PDF file :(</p>}
                loading={<p>Loading...</p>}
                onLoadSuccess={onDocumentLoadSuccess}
                onPassword={() => {}}
            >
                {pageViewports.length > 0 && (
                    <List
                        style={styles.list}
                        outerRef={setListAttributes}
                        width={isSmallScreen ? calculatePageWidth() : containerWidth}
                        height={containerHeight}
                        itemCount={numPages}
                        itemSize={calculatePageHeight}
                        estimatedItemSize={calculatePageHeight(0)}
                    >
                        {renderPage}
                    </List>
                )}
            </Document>
        </div>
    );
}

PDFPreviewer.propTypes = propTypes;

export default memo(PDFPreviewer);