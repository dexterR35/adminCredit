import React, { useState, useEffect } from 'react';

function SearchInput({ onSearch, placeholder = "Caută..." }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [filter1, setFilter1] = useState(false);
    const [filter2, setFilter2] = useState(false);
    const [filter3, setFilter3] = useState(false);

    useEffect(() => {
        if (searchTerm) {
            onSearch(searchTerm, { filter1, filter2, filter3 }).then(setResults);
        } else {
            setResults([]);
        }
    }, [searchTerm, filter1, filter2, filter3, onSearch]);

    return (
        <div className="relative flex flex-row-reverse my-4 justify-between mx-2">
            <input
                type="text"
                className="w-80 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="flex space-x-2 p-2 w-[50%]">
                <label className="inline-flex items-center">
                    <input
                        type="checkbox"
                        checked={filter1}
                        onChange={() => setFilter1(!filter1)}
                        className="form-checkbox h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2 text-gray-700">Filter 1</span>
                </label>
                <label className="inline-flex items-center">
                    <input
                        type="checkbox"
                        checked={filter2}
                        onChange={() => setFilter2(!filter2)}
                        className="form-checkbox h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2 text-gray-700">Filter 2</span>
                </label>
                <label className="inline-flex items-center">
                    <input
                        type="checkbox"
                        checked={filter3}
                        onChange={() => setFilter3(!filter3)}
                        className="form-checkbox h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2 text-gray-700">Filter 3</span>
                </label>
            </div>
            {results.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg max-h-60 overflow-auto">
                    {results.map((result, index) => (
                        <li key={index} className="p-2 hover:bg-gray-100 cursor-pointer">
                            {result}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default SearchInput;
