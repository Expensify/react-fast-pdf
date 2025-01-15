import React, {useState} from 'react';
import ReactFastPDF, {PDFPreviewer} from 'react-fast-pdf';
import './index.css';

function App() {
    const [file, setFile] = useState<string | null>(null);

    return (
        <main className="container">
            <h1 className="title">Hello, I am {ReactFastPDF.PackageName}!</h1>

            {file ? (
                <>
                    <button
                        className="button button_back"
                        type="button"
                        onClick={() => setFile(null)}
                    >
                        Back
                    </button>

                    <PDFPreviewer
                        file={file}
                        pageMaxWidth={1000}
                        isSmallScreen={false}
                    />
                </>
            ) : (
                <>
                    <h3>Please choose a file for previewing:</h3>

                    <div className="buttons_container">
                        <button
                            className="button"
                            type="button"
                            onClick={() => setFile('example.pdf')}
                        >
                            example.pdf
                        </button>

                        <button
                            className="button"
                            type="button"
                            onClick={() => setFile('example_protected.pdf')}
                        >
                            example_protected.pdf (Password: 123456)
                        </button>

                        <input
                            className="button"
                            type="file"
                            onChange={(event) => {
                                const uploadedFile = event?.target?.files?.[0];

                                if (!uploadedFile) {
                                    return;
                                }

                                setFile(URL.createObjectURL(uploadedFile));
                            }}
                        />
                    </div>
                </>
            )}
        </main>
    );
}

export default App;
