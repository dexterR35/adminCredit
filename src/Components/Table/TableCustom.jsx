// Table.js
import React from 'react';

const TableCustom = ({ headers, body }) => {
    return (
        <div className='overflow-auto'>
            <table className="w-full border-collapse">
                <thead>
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index} className="p-2">{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {body}
                </tbody>
            </table>
        </div>
    );
};

export default TableCustom;
