import React, {CSSProperties} from 'react';
// TODO: Change the package source in package.json
// TODO: Use built source code, not initial
import ReactFastPDF, {PDFPreviewer} from 'react-fast-pdf';
import './index.css';

const pdfPreviewerContainerStyles: CSSProperties = {
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
                containerStyle={pdfPreviewerContainerStyles}
            />
        </main>
    );
}

export default App;
