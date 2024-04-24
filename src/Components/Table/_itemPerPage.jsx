import React from 'react';
import PropTypes from 'prop-types';

const ItemsPerPageSelector = ({ itemsPerPage, onItemsPerPageChange }) => {
    const handleChange = (e) => {
        const newItemsPerPage = parseInt(e.target.value, 10);
        onItemsPerPageChange(newItemsPerPage);
    };

    return (
        <div className="flex items-center space-x-2">
            <label htmlFor="itemsPerPage">Items per page:</label>
            <select
                id="itemsPerPage"
                value={itemsPerPage}
                onChange={handleChange}
                className="border p-1 rounded"
            >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
                <option value={50}>50</option>
            </select>
        </div>
    );
};

ItemsPerPageSelector.propTypes = {
    itemsPerPage: PropTypes.number.isRequired,
    onItemsPerPageChange: PropTypes.func.isRequired,
};

export default ItemsPerPageSelector;
