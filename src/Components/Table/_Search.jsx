import React from 'react';
import PropTypes from 'prop-types';

const Search = ({ searchQuery, onSearch }) => {
    return (
        <input
            type="text"
            placeholder="Search by name or phone"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value.toLowerCase())}
            className="p-2 border rounded mb-2"
        />
    );
};

Search.propTypes = {
    searchQuery: PropTypes.string.isRequired,
    onSearch: PropTypes.func.isRequired,
};

export default Search;
