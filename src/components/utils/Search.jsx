import React, { useState } from 'react'

const SearchComponent = ({ placeholder, onSearch }) => {
    const [query, setQuery] = useState('');

    const handleChange = (e) => {
        setQuery(e.target.value);
        onSearch(e.target.value);
    };
    return (
        <div>
            <input
                type="text"
                placeholder={placeholder}
                value={query}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-lg"
            />
        </div>
    )
}

export default SearchComponent
