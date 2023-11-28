import React, {CSSProperties, useState} from 'react';
import ReactFastPDF, {PDFPreviewer} from 'react-fast-pdf';
import './index.css';

const pdfPreviewerContainerStyle: CSSProperties = {
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#184E3D',
    borderStyle: 'solid',
};

const buttonsContainer: CSSProperties = {
    marginTop: 16,
    display: 'flex',
};

const fileButtonStyle: CSSProperties = {
    margin: '0 8px',
    padding: '8px 16px',
    fontSize: 18,
    border: 0,
    borderRadius: 16,
    backgroundColor: '#03d47c',
    cursor: 'pointer',
};

function App() {
    const [file, setFile] = useState<string | null>(null);

    return (
        <main className="container">
            <h1 className="title">Hello, I am {ReactFastPDF.PackageName}!</h1>

            {file ? (
                <PDFPreviewer
                    file={file}
                    pageMaxWidth={1000}
                    isSmallScreen={false}
                    containerStyle={pdfPreviewerContainerStyle}
                />
            ) : (
                <>
                    <h3>Please choose a file for previewing:</h3>

                    <div style={buttonsContainer}>
                        <button
                            style={fileButtonStyle}
                            type="button"
                            onClick={() => setFile('example.pdf')}
                        >
                            example.pdf
                        </button>

                        <button
                            style={fileButtonStyle}
                            type="button"
                            onClick={() => setFile('example_protected.pdf')}
                        >
                            example_protected.pdf
                        </button>
                    </div>
                </>
            )}
        </main>
    );
}

export default App;
