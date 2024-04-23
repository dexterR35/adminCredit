import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';

const FetchCSVData = () => {
    const [csvData, setCsvData] = useState(null);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const csvText = e.target.result;
                setCsvData(csvText);
            };
            reader.readAsText(file);
        }
    };

    const displayCSV = (csvText) => {
        const rows = csvText.split("\n");

        const tableHeader = (
            <thead>
                <tr>
                    {rows[0].split(";").map((col, index) => (
                        <th key={index}>{col}</th>
                    ))}
                </tr>
            </thead>
        );

        const tableBody = (
            <tbody>
                {rows.slice(1).map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {row.split(";").map((col, colIndex) => (
                            <td key={colIndex}>{col}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        );

        return (
            <table>
                {tableHeader}
                {tableBody}
            </table>
        );
    };

    return (
        <div>
            <h2>Import CSV File</h2>
            <input type="file" id="csvFileInput" accept=".csv" onChange={handleFileSelect} />
            <h3>CSV Table:</h3>
            {csvData && displayCSV(csvData)}
        </div>
    );
}
export default FetchCSVData;
