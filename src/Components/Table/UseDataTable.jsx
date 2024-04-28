import { useState, useMemo } from "react";

const UseDataTable = (initialData) => {
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
        return initialData.filter(
            (item) =>
                item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item["CONSULTANT"]?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item["NUME CLIENT"]?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item["DATA"]?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [initialData, searchQuery]);

    console.log(filteredData, "filterdata")


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
