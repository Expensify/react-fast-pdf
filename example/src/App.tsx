import React, {useState} from 'react';
import ReactFastPDF, {PDFPreviewer} from 'react-fast-pdf';
import type {RotationDegrees} from 'react-fast-pdf';
import './index.css';

function App() {
    const [file, setFile] = useState<string | null>(null);
    const [rotation, setRotation] = useState<RotationDegrees>(0);

    // `.default` is required when referencing the legacy CJS package.
    const packageName = ('default' in ReactFastPDF ? (ReactFastPDF.default as {PackageName: string}) : ReactFastPDF).PackageName;

    const handleRotate = () => {
        setRotation((prev) => ((prev + 90) % 360) as RotationDegrees);
    };

    return (
        <main className="container">
            <h1 className="title">Hello, I am {packageName}!</h1>

            {file ? (
                <>
                    <div style={{display: 'flex', gap: '10px', marginBottom: '10px', flexWrap: 'wrap'}}>
                        <button
                            className="button button_back"
                            type="button"
                            onClick={() => {
                                setFile(null);
                                setRotation(0);
                            }}
                        >
                            Back
                        </button>

                        <button
                            className="button"
                            type="button"
                            onClick={handleRotate}
                        >
                            Rotate 90° (Current: {rotation}°)
                        </button>
                    </div>

                    <PDFPreviewer
                        file={file}
                        pageMaxWidth={1000}
                        isSmallScreen={false}
                        rotation={rotation}
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
