import React, {memo, useCallback, useLayoutEffect, useRef, useState} from 'react';
import type {CSSProperties} from 'react';
import times from 'lodash/times';
import PropTypes from 'prop-types';
import {VariableSizeList as List} from 'react-window';
import {Document, Page, pdfjs} from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import type {PDFDocument, PageViewport} from './types';
import {pdfPreviewerStyles as styles} from './styles';
import PDFPasswordForm from './PDFPasswordForm';

type Props = {
    file: string;
    pageMaxWidth: number;
    isSmallScreen: boolean;
    containerStyle?: CSSProperties;
    contentContainerStyle?: CSSProperties;
};

type ListRef = {
    tabIndex: number;
};

type OnPasswordCallback = (password: string | null) => void;

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

/**
 * An object in which additional parameters to be passed to PDF.js can be defined.
 * 1. cMapUrl - The URL where the predefined Adobe CMaps are located. Include the trailing slash.
 * 2. cMapPacked - specifies if the Adobe CMaps are binary packed or not. The default value is `true`.
 */
const DEFAULT_DOCUMENT_OPTIONS = {
    cMapUrl: 'cmaps/',
    cMapPacked: true,
};

/**
 * Link target for external links rendered in annotations.
 */
const DEFAULT_EXTERNAL_LINK_TARGET = '_blank';

/**
 * Constants for password-related error responses received from react-pdf.
 */
const PDF_PASSWORD_FORM_RESPONSES = {
    NEED_PASSWORD: 1,
    INCORRECT_PASSWORD: 2,
};

/**
 * Sets attributes to list container.
 * It unblocks a default scroll by keyboard of browsers.
 */
const setListAttributes = (ref: ListRef | undefined) => {
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
    file: PropTypes.string.isRequired,
    pageMaxWidth: PropTypes.number.isRequired,
    isSmallScreen: PropTypes.bool.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    containerStyle: PropTypes.object,
    // eslint-disable-next-line react/forbid-prop-types
    contentContainerStyle: PropTypes.object,
};

const defaultProps = {
    containerStyle: {},
    contentContainerStyle: {},
};
// @ts-expect-error - It is a recommended step for import worker - https://github.com/wojtekmaj/react-pdf/blob/main/packages/react-pdf/README.md#import-worker-recommended
pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.js', import.meta.url).toString();

function PDFPreviewer({pageMaxWidth, isSmallScreen, file, containerStyle, contentContainerStyle}: Props) {
    const [pageViewports, setPageViewports] = useState<PageViewport[]>([]);
    const [numPages, setNumPages] = useState(0);
    const [containerWidth, setContainerWidth] = useState(0);
    const [containerHeight, setContainerHeight] = useState(0);
    const [shouldRequestPassword, setShouldRequestPassword] = useState(false);
    const [isPasswordInvalid, setIsPasswordInvalid] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const onPasswordCallbackRef = useRef<OnPasswordCallback | null>(null);

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
        Promise.all(
            times(pdf.numPages, (index: number) => {
                const pageNumber = index + 1;

                return pdf.getPage(pageNumber).then((page) => page.getViewport({scale: 1}));
            }),
        ).then(
            (viewports: PageViewport[]) => {
                setPageViewports(viewports);
                setNumPages(pdf.numPages);
                setShouldRequestPassword(false);
                setIsPasswordInvalid(false);
            },
            () => {},
        );
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
    const initiatePasswordChallenge = (callback: OnPasswordCallback, reason: number) => {
        onPasswordCallbackRef.current = callback;

        if (reason === PDF_PASSWORD_FORM_RESPONSES.NEED_PASSWORD) {
            setShouldRequestPassword(true);
        } else if (reason === PDF_PASSWORD_FORM_RESPONSES.INCORRECT_PASSWORD) {
            setShouldRequestPassword(true);
            setIsPasswordInvalid(true);
        }
    };

    /**
     * Send password to react-pdf via its callback so that it can attempt to load
     * the PDF.
     */
    const attemptPDFLoad = (password: string) => {
        onPasswordCallbackRef.current?.(password);
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

    useLayoutEffect(() => {
        setContainerWidth(containerRef.current?.clientWidth ?? 0);
        setContainerHeight(containerRef.current?.clientHeight ?? 0);
    }, []);

    return (
        <div
            ref={containerRef}
            style={{...styles.container, ...containerStyle}}
        >
            <Document
                file={file}
                options={DEFAULT_DOCUMENT_OPTIONS}
                externalLinkTarget={DEFAULT_EXTERNAL_LINK_TARGET}
                error={<p>Failed to load the PDF file :(</p>}
                loading={<p>Loading...</p>}
                onLoadSuccess={onDocumentLoadSuccess}
                onPassword={initiatePasswordChallenge}
            >
                {pageViewports.length > 0 && (
                    <List
                        style={{...styles.list, ...contentContainerStyle}}
                        outerRef={setListAttributes}
                        width={containerWidth}
                        height={containerHeight}
                        itemCount={numPages}
                        itemSize={calculatePageHeight}
                        estimatedItemSize={calculatePageHeight(0)}
                    >
                        {renderPage}
                    </List>
                )}
            </Document>

            {shouldRequestPassword && (
                <PDFPasswordForm
                    isFocused
                    isPasswordInvalid={isPasswordInvalid}
                    onSubmit={attemptPDFLoad}
                    onPasswordUpdated={() => setIsPasswordInvalid(false)}
                />
            )}
        </div>
    );
}

PDFPreviewer.propTypes = propTypes;
PDFPreviewer.defaultProps = defaultProps;

export default memo(PDFPreviewer);
