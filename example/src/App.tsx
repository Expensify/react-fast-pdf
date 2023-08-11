import React from 'react';
// TODO: Change the package source in package.json
// TODO: Use built source code, not initial
import ReactFastPDF, {PDFPreviewer} from 'react-fast-pdf';

function App() {
    return (
        <main>
            <h1>Hello, I am {ReactFastPDF.PackageName}!</h1>

            <PDFPreviewer
                file="/example.pdf"
                pageMaxWidth={1000}
                isSmallScreen={false}
            />
        </main>
    );
}

export default App;
