import React from 'react';
import PropTypes from 'prop-types';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const renderPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 10;
        const ellipsis = <span className="p-2 m-1">...</span>;
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        if (totalPages <= maxPagesToShow) {
            startPage = 1;
            endPage = totalPages;
        } else if (currentPage <= Math.floor(maxPagesToShow / 2)) {
            endPage = maxPagesToShow;
        } else if (currentPage + Math.floor(maxPagesToShow / 2) >= totalPages) {
            startPage = totalPages - maxPagesToShow + 1;
        }

        if (startPage > 1) {
            pageNumbers.push(
                <button
                    key={1}
                    className={`p-2 m-1 ${1 === currentPage ? 'bg-green-300' : 'bg-white'}`}
                    onClick={() => onPageChange(1)}
                >
                    {1}
                </button>
            );
            pageNumbers.push(ellipsis);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <button
                    key={i}
                    className={`p-2 m-1 ${i === currentPage ? 'bg-green-300' : 'bg-white'}`}
                    onClick={() => onPageChange(i)}
                >
                    {i}
                </button>
            );
        }

        if (endPage < totalPages) {
            pageNumbers.push(ellipsis);
            pageNumbers.push(
                <button
                    key={totalPages}
                    className={`p-2 m-1 ${totalPages === currentPage ? 'bg-green-300' : 'bg-white'}`}
                    onClick={() => onPageChange(totalPages)}
                >
                    {totalPages}
                </button>
            );
        }

        return pageNumbers;
    };

    return (
        <div className="flex justify-center mt-4">
            {renderPageNumbers()}
        </div>
    );
};

Pagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
