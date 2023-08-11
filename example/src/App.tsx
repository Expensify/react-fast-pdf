import React from 'react';
// TODO: Change the package source in package.json
// TODO: Use built source code, not initial
import ReactFastPDF, {PDFPreviewer} from 'react-fast-pdf';

function App() {
    return (
        <main
            style={{
                height: '100%',
                width: '100%',
            }}
        >
            <h1>Hello, I am {ReactFastPDF.PackageName}!</h1>

            <PDFPreviewer
                file="/example.pdf"
                pageMaxWidth={800}
                isSmallScreen={false}
                containerStyle={{}}
            />
        </main>
    );
}

export default App;
