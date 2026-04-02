import {CSSProperties} from 'react';

type Page = {
    getViewport: ({scale}: {scale: number}) => PageViewport;
};

type PDFDocument = {
    numPages: number;
    getPage: (pageNumber: number) => Promise<Page>;
};

type PageViewport = {
    height: number;
    width: number;
};

type ComponentStyles = {
    [key: string]: CSSProperties;
};

/**
 * Valid rotation angles for PDF pages (in degrees clockwise)
 */
type RotationDegrees = 0 | 90 | 180 | 270;

export type {PDFDocument, PageViewport, ComponentStyles, RotationDegrees};
