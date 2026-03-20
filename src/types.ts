import {CSSProperties} from 'react';
import {ROTATION} from './constants.js';

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
type RotationDegrees = typeof ROTATION.DEG_0 | typeof ROTATION.DEG_90 | typeof ROTATION.DEG_180 | typeof ROTATION.DEG_270;

export type {PDFDocument, PageViewport, ComponentStyles, RotationDegrees};
