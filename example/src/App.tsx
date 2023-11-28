import React, {CSSProperties} from 'react';
import ReactFastPDF, {PDFPreviewer} from 'react-fast-pdf';
import './index.css';

const pdfPreviewerContainerStyle: CSSProperties = {
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#184E3D',
    borderStyle: 'solid',
};

function App() {
    return (
        <main className="container">
            <h1 className="title">Hello, I am {ReactFastPDF.PackageName}!</h1>

            <PDFPreviewer
                file="/example.pdf"
                pageMaxWidth={1000}
                isSmallScreen={false}
                containerStyle={pdfPreviewerContainerStyle}
            />
        </main>
    );
}

export default App;
