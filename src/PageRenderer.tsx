import React, {memo, type CSSProperties} from 'react';
import {Page} from 'react-pdf';
import {pdfPreviewerStyles as styles} from './styles';
import {PAGE_BORDER} from './constants';

type Props = {
    index: number;
    style: CSSProperties;
    data: {
        pageWidth: number;
        estimatedPageHeight: number;
        calculatePageHeight: (pageIndex: number) => number;
        getDevicePixelRatio: (width: number, height: number) => number | undefined;
        numPages: number;
        containerHeight: number;
    };
};

function PageRenderer({index, style, data}: Props) {
    const {pageWidth, estimatedPageHeight, calculatePageHeight, getDevicePixelRatio, numPages, containerHeight} = data;
    /**
     * Render a specific page based on its index.
     * The method includes a wrapper to apply virtualized styles.
     */
    const pageHeight = calculatePageHeight(index);
    const devicePixelRatio = getDevicePixelRatio(pageWidth, pageHeight);
    const parsedHeight = parseFloat(style.height as unknown as string);
    const parsedTop = parseFloat(style.top as unknown as string);
    const topPadding = numPages > 1 || parsedHeight > containerHeight ? parsedTop + PAGE_BORDER : (containerHeight - parsedHeight) / 2;
    return (
        <div style={{...styles.pageWrapper, ...style, top: `${topPadding}px`}}>
            <Page
                key={`page_${index}`}
                width={pageWidth}
                height={pageHeight || estimatedPageHeight}
                pageIndex={index}
                // This needs to be empty to avoid multiple loading texts which show per page and look ugly
                // See https://github.com/Expensify/App/issues/14358 for more details
                loading=""
                devicePixelRatio={devicePixelRatio}
            />
        </div>
    );
}

PageRenderer.displayName = 'PageRenderer';

export default memo(PageRenderer);
