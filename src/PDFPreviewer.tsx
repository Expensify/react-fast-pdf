// @ts-expect-error - This line imports a module from 'pdfjs-dist' package which lacks TypeScript typings.
// eslint-disable-next-line import/no-extraneous-dependencies
import pdfWorkerSource from 'pdfjs-dist/legacy/build/pdf.worker';
import React, {memo, useCallback, useLayoutEffect, useRef, useState} from 'react';
import type {CSSProperties, ReactNode} from 'react';
import times from 'lodash/times';
import PropTypes from 'prop-types';
import {VariableSizeList as List} from 'react-window';
import {Document, pdfjs} from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import type {PDFDocument, PageViewport} from './types';
import {pdfPreviewerStyles as styles} from './styles';
import PDFPasswordForm, {type PDFPasswordFormProps} from './PDFPasswordForm';
import PageRenderer from './PageRenderer';
import {PAGE_BORDER, LARGE_SCREEN_SIDE_SPACING, DEFAULT_DOCUMENT_OPTIONS, DEFAULT_EXTERNAL_LINK_TARGET, PDF_PASSWORD_FORM_RESPONSES} from './constants';
import {setListAttributes} from './helpers';

type Props = {
    file: string;
    pageMaxWidth: number;
    isSmallScreen: boolean;
    maxCanvasWidth: number | null;
    maxCanvasHeight: number | null;
    maxCanvasArea: number | null;
    renderPasswordForm?: ({isPasswordInvalid, onSubmit, onPasswordChange}: Omit<PDFPasswordFormProps, 'onPasswordFieldFocus'>) => ReactNode | null;
    LoadingComponent?: ReactNode;
    ErrorComponent?: ReactNode;
    containerStyle?: CSSProperties;
    contentContainerStyle?: CSSProperties;
};

type OnPasswordCallback = (password: string | null) => void;

const propTypes = {
    file: PropTypes.string.isRequired,
    pageMaxWidth: PropTypes.number.isRequired,
    isSmallScreen: PropTypes.bool.isRequired,
    maxCanvasWidth: PropTypes.number,
    maxCanvasHeight: PropTypes.number,
    maxCanvasArea: PropTypes.number,
    renderPasswordForm: PropTypes.func,
    LoadingComponent: PropTypes.node,
    ErrorComponent: PropTypes.node,
    // eslint-disable-next-line react/forbid-prop-types
    containerStyle: PropTypes.object,
    // eslint-disable-next-line react/forbid-prop-types
    contentContainerStyle: PropTypes.object,
};

const defaultProps = {
    maxCanvasWidth: null,
    maxCanvasHeight: null,
    maxCanvasArea: null,
    renderPasswordForm: null,
    LoadingComponent: <p>Loading...</p>,
    ErrorComponent: <p>Failed to load the PDF file :(</p>,
    containerStyle: {},
    contentContainerStyle: {},
};

pdfjs.GlobalWorkerOptions.workerSrc = URL.createObjectURL(new Blob([pdfWorkerSource], {type: 'text/javascript'}));

function PDFPreviewer({
    file,
    pageMaxWidth,
    isSmallScreen,
    maxCanvasWidth,
    maxCanvasHeight,
    maxCanvasArea,
    LoadingComponent,
    ErrorComponent,
    renderPasswordForm,
    containerStyle,
    contentContainerStyle,
}: Props) {
    const [pageViewports, setPageViewports] = useState<PageViewport[]>([]);
    const [numPages, setNumPages] = useState(0);
    const [containerWidth, setContainerWidth] = useState(0);
    const [containerHeight, setContainerHeight] = useState(0);
    const [shouldRequestPassword, setShouldRequestPassword] = useState(false);
    const [isPasswordInvalid, setIsPasswordInvalid] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const onPasswordCallbackRef = useRef<OnPasswordCallback | null>(null);

    /**
     * Calculate the devicePixelRatio the page should be rendered with
     * Each platform has a different default devicePixelRatio and different canvas limits, we need to verify that
     * with the default devicePixelRatio it will be able to diplay the pdf correctly, if not we must change the devicePixelRatio.
     * @param {Number} width of the page
     * @param {Number} height of the page
     * @returns {Number} devicePixelRatio for this page on this platform
     */
    const getDevicePixelRatio = (width: number, height: number): number | undefined => {
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

    const estimatedPageHeight = calculatePageHeight(0);
    const pageWidth = calculatePageWidth();

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
     * Render a form to handle password typing.
     * The method renders the passed or default component.
     */
    const internalRenderPasswordForm = useCallback(() => {
        const onSubmit = attemptPDFLoad;
        const onPasswordChange = () => setIsPasswordInvalid(false);

        if (typeof renderPasswordForm === 'function') {
            return renderPasswordForm({
                isPasswordInvalid,
                onSubmit,
                onPasswordChange,
            });
        }

        return (
            <PDFPasswordForm
                isPasswordInvalid={isPasswordInvalid}
                onSubmit={onSubmit}
                onPasswordChange={onPasswordChange}
            />
        );
    }, [isPasswordInvalid, attemptPDFLoad, setIsPasswordInvalid, renderPasswordForm]);

    useLayoutEffect(() => {
        setContainerWidth(containerRef.current?.clientWidth ?? 0);
        setContainerHeight(containerRef.current?.clientHeight ?? 0);
    }, []);

    return (
        <div
            ref={containerRef}
            style={{...styles.container, ...containerStyle}}
        >
            <div style={{...styles.innerContainer, ...(shouldRequestPassword ? styles.invisibleContainer : {})}}>
                <Document
                    file={file}
                    options={DEFAULT_DOCUMENT_OPTIONS}
                    externalLinkTarget={DEFAULT_EXTERNAL_LINK_TARGET}
                    error={ErrorComponent}
                    loading={LoadingComponent}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onPassword={initiatePasswordChallenge}
                >
                    {pageViewports.length > 0 && (
                        <List
                            style={{...styles.list, ...contentContainerStyle}}
                            outerRef={setListAttributes}
                            width={isSmallScreen ? pageWidth : containerWidth}
                            height={containerHeight}
                            itemCount={numPages}
                            itemSize={calculatePageHeight}
                            estimatedItemSize={calculatePageHeight(0)}
                            itemData={{pageWidth, estimatedPageHeight, calculatePageHeight, getDevicePixelRatio}}
                        >
                            {PageRenderer}
                        </List>
                    )}
                </Document>
            </div>

            {shouldRequestPassword && internalRenderPasswordForm()}
        </div>
    );
}

PDFPasswordForm.displayName = 'PDFPreviewer';
PDFPreviewer.propTypes = propTypes;
PDFPreviewer.defaultProps = defaultProps;

export default memo(PDFPreviewer);
