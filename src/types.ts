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

export type {PDFDocument, PageViewport};
