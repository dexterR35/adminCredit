// Table.js
import React from 'react';

const TableCustom = ({ headers, body }) => {
    return (
        <div className='relative  sm:rounded-lg'>
            <table className="custom-table h-full">
                <thead className='text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody >
                    {body}
                </tbody>
            </table>
        </div>
    );
};

export default TableCustom;
