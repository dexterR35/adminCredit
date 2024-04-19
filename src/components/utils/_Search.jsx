import React, { useState, useEffect } from 'react';

// Modal component
function Modal({ isOpen, onClose, data }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto">
            <div className="relative w-auto max-w-3xl mx-auto my-6 z-50 ">
                <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg">
                    <div className="flex items-start justify-between p-5 border-b border-solid rounded-t border-blueGray-200">
                        <h3 className="text-3xl font-semibold">Detalii</h3>
                        <button
                            className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold"
                            onClick={onClose}
                        >
                            ×
                        </button>
                    </div>
                    <div className="relative p-6 flex-auto">
                        <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                            Nume: {data.firstName} {data.lastName}
                        </p>
                        <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                            Telefon: {data.phone}
                        </p>
                        {/* Aici poți adăuga și alte detalii */}
                    </div>
                </div>
            </div>
            <div
                className="fixed inset-0 z-120 bg-black opacity-50 cursor-pointer"
                onClick={onClose}
            ></div>
        </div>
    );
}

function SearchInput({ onSearch, placeholder = "Caută..." }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [filter1, setFilter1] = useState(false);
    const [filter2, setFilter2] = useState(false);
    const [filter3, setFilter3] = useState(false);
    const [selectedData, setSelectedData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (searchTerm) {
            onSearch(searchTerm, { filter1, filter2, filter3 }).then(setResults);
        } else {
            setResults([]);
        }
    }, [searchTerm, filter1, filter2, filter3, onSearch]);

    const handleSelect = (data) => {
        setSelectedData(data);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedData(null);
        setIsModalOpen(false);
    };

    return (
        <div className="relative flex flex-row-reverse my-4 justify-between mx-0">
            <div className='flex flex-1 items-center justify-end'>
                <input
                    type="text"
                    className="w-[80%] max-w-[80%] self-end p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="flex-1 space-x-2">
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
                        <li
                            key={index}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleSelect(result)}
                        >
                            {result.firstName} {result.lastName} - {result.phone}
                        </li>
                    ))}
                </ul>
            )}

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} data={selectedData} />
        </div>
    );
}

export default SearchInput;
