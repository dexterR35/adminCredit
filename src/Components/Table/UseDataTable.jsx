import { useState, useMemo } from "react";

const UseDataTable = (initialData = [] ) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedRow, setExpandedRow] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const handleRowClick = (index) =>
        setExpandedRow(index === expandedRow ? null : index);

    const handleSearch = (query) => setSearchQuery(query);
    const handleItemsPerPageChange = (perPage) => setItemsPerPage(perPage);
    const handlePageChange = (page) => setCurrentPage(page);
    const filteredData = useMemo(() => {
        const lowerCaseQuery = searchQuery.toLowerCase();
        return initialData.filter((item) => {
            const fullName = `${item.firstName || ''} ${item.lastName || ''}`.toLowerCase();
            return (
                item.name?.toLowerCase().includes(lowerCaseQuery) ||
                item.phone?.toLowerCase().includes(lowerCaseQuery) ||
                fullName.includes(lowerCaseQuery) ||
                item["CONSULTANT"]?.toLowerCase().includes(lowerCaseQuery) ||
                item["NUME CLIENT"]?.toLowerCase().includes(lowerCaseQuery) ||
                item["DATA"]?.toLowerCase().includes(lowerCaseQuery)
            );
        });
    }, [initialData, searchQuery]);


    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    return {
        searchQuery,
        expandedRow,
        currentPage,
        itemsPerPage,
        handleRowClick,
        handleSearch,
        handleItemsPerPageChange,
        handlePageChange,
        filteredData,
        currentItems,
        totalPages,
        indexOfFirstItem,
        indexOfLastItem,
    };
};

export default UseDataTable;
