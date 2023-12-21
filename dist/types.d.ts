import { CSSProperties } from 'react';
type Page = {
    getViewport: ({ scale }: {
        scale: number;
    }) => PageViewport;
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
export type { PDFDocument, PageViewport, ComponentStyles };
//# sourceMappingURL=types.d.ts.map