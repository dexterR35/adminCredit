import React from 'react';
import PropTypes from 'prop-types';

const ItemsPerPageSelector = ({ itemsPerPage, onItemsPerPageChange }) => {
    const handleChange = (e) => {
        const newItemsPerPage = parseInt(e.target.value, 10);
        onItemsPerPageChange(newItemsPerPage);
    };

    return (
        <div className="flex flex-row items-center space-x-2 ">
            <label htmlFor="itemsPerPage" className='text-sm'>Users</label>
            <select
                id="itemsPerPage"
                value={itemsPerPage}
                onChange={handleChange}
                className="border py-1 pr-8 text-sm rounded cursor-pointer"
            >
                <option value={5} className='text-sm'>5</option>
                <option value={10} className='text-sm'>10</option>
                <option value={20} className='text-sm'>20</option>
                <option value={50} className='text-sm'>50</option>
            </select>
        </div>
    );
};

ItemsPerPageSelector.propTypes = {
    itemsPerPage: PropTypes.number.isRequired,
    onItemsPerPageChange: PropTypes.func.isRequired,
};

export default ItemsPerPageSelector;
