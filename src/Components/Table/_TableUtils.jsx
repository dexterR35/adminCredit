import Search from "./_Search";
import ItemsPerPageSelector from "./_itemPerPage";
import Pagination from "./_Pagination";
import UseDataTable from "./UseDataTable";
export const ReusableDataTable = (props) => {
    const {
        searchQuery,
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
    } = props;

    return (
        <div>
            <ItemsPerPageSelector
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={handleItemsPerPageChange}
            />
            <Search searchQuery={searchQuery} onSearch={handleSearch} />
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
            <span className="text-sm my-5">
                Showing {filteredData.length > 0 ? indexOfFirstItem + 1 : 0} -{" "}
                {Math.min(indexOfLastItem, filteredData.length)} of{" "}
                {filteredData.length} results
            </span>
        </div>
    );
};