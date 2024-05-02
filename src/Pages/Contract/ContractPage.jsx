import { FormatTimestamp, FetchContractData } from "../../services/Hooks";
import Search from "../../Components/Table/_Search";
import ItemsPerPageSelector from "../../Components/Table/_itemPerPage";
import Pagination from "../../Components/Table/_Pagination";
import { EditButton, DeleteButton } from "../../Components/Buttons/Buttons"; // Assuming these components exist
import UseDataTable from "../../Components/Table/UseDataTable";
import TableCustom from "../../Components/Table/TableCustom";
const ContractPage = () => {
    const headers = ["name", "phone", "info", "timestamp", "actions"];
    const { contracts, onEdit, onDelete } = FetchContractData();
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
    } = UseDataTable(contracts);

    const handleEdit = (id) => {
        // Add your edit logic here
    };

    const handleDelete = (id) => {
        // Add your delete logic here
    };

    const generateTableBody = (items) => {
        return items.map((contract, index) => (
            <tr
                key={index}

            >
                <td className="space-x-1">
                    {contract.firstName} {contract.lastName}
                </td>
                <td>{contract.phone}</td>
                <td className="space-x-2">
                    <a
                        href={contract.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                    >
                        View Pdf
                    </a>
                    <a
                        href={contract.photo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                    >
                        View Photo
                    </a>
                </td>
                <td>{FormatTimestamp(contract.timestamp)}</td>
                <td>
                    <EditButton onClick={() => handleEdit(contract.id)} />
                    <DeleteButton onClick={() => handleDelete(contract.id)} />
                </td>
            </tr>
        ));
    };
    return (
        <div>
            <div>
                <h2 className="text-start mb-4">Contract Clienti</h2>
                <div className="flex justify-between items-end mb-2">
                    <ItemsPerPageSelector
                        itemsPerPage={itemsPerPage}
                        onItemsPerPageChange={handleItemsPerPageChange}
                    />
                    <Search searchQuery={searchQuery} onSearch={handleSearch} />
                </div>
                <div className="w-full h-[570px] overflow-y-auto bg-white">
                    <TableCustom
                        headers={headers}
                        body={generateTableBody(currentItems)}
                    />
                    <span className="text-sm">
                        Showing {filteredData.length > 0 ? indexOfFirstItem + 1 : 0} -{" "}
                        {Math.min(indexOfLastItem, filteredData.length)} of{" "}
                        {filteredData.length} results
                    </span>
                </div>
                <div className="flex justify-center mt-4"></div>
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default ContractPage;
