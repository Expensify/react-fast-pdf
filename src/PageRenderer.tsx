import React, {memo, type CSSProperties} from 'react';
import PropTypes from 'prop-types';
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

const propTypes = {
    /** Index of the PDF page to be displayed passed by VariableSizeList */
    index: PropTypes.number.isRequired,

    /** Page extra data passed by VariableSizeList's data prop */
    data: PropTypes.shape({
        /** Width of a single page in the document */
        pageWidth: PropTypes.number.isRequired,
        /** The estimated height of a single page in the document */
        estimatedPageHeight: PropTypes.number.isRequired,
        /** Function that calculates the height of a page given its index */
        calculatePageHeight: PropTypes.func.isRequired,
        /** Function that calculates the pixel ratio for a page given its calculated width and height */
        getDevicePixelRatio: PropTypes.func.isRequired,
        /** The number of pages in the document */
        numPages: PropTypes.number.isRequired,
        /** The height of the container view */
        containerHeight: PropTypes.number.isRequired,
    }).isRequired,

    /** Additional style props passed by VariableSizeList */
    // eslint-disable-next-line react/forbid-prop-types
    style: PropTypes.object.isRequired,
};

function PageRenderer({index, style, data}: Props) {
    const {pageWidth, estimatedPageHeight, calculatePageHeight, getDevicePixelRatio, numPages, containerHeight} = data;
    /**
     * Render a specific page based on its index.
     * The method includes a wrapper to apply virtualized styles.
     */
    const pageHeight = calculatePageHeight(index);
    const devicePixelRatio = getDevicePixelRatio(pageWidth, pageHeight);
    const topPadding = numPages > 1 ? parseFloat(style.top as unknown as string) + PAGE_BORDER : containerHeight - parseFloat(style.height as unknown as string) / 2;
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
PageRenderer.propTypes = propTypes;

export default memo(PageRenderer);
