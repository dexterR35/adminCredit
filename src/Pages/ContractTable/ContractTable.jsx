import { useState } from "react";
import {
  DataTable,
  useDataTable,
  photoColumn,
  pdfColumn,
  phoneColumn,
  signatureColumn,
  contractExportColumns,
} from "../../Components/Table";
import ContractDetailModal from "../../Components/Customer/ContractDetailModal";
import { FetchContractData } from "../../services/Hooks";
import { useAuth } from "../../context/AuthContext";
import { PageTitle } from "../../Components/uiCheck";

const contractColumns = [
  { accessorKey: "first_name", header: "First name", size: 100 },
  { accessorKey: "last_name", header: "Last name", size: 100 },
  phoneColumn({ size: 100 }),
  { accessorKey: "email", header: "Email", size: 140 },
  photoColumn(),
  pdfColumn(),
  signatureColumn(),
  { accessorKey: "created_at_label", header: "Created", size: 100 },
];

const ContractTable = () => {
  const { contracts, loading, onDelete } = FetchContractData();
  const { isAdmin } = useAuth();
  const [detailContract, setDetailContract] = useState(null);

  const tableProps = useDataTable({
    data: contracts,
    columns: contractColumns,
    loading,
    onRowClick: (contract) => setDetailContract(contract),
    linkTable: "https://obtinecredit.ro/contract",
    emptyMessage: "No contracts yet",
    exportColumns: contractExportColumns,
    exportFileName: "contracts",
  });

  return (
    <div className="space-y-6">
      <PageTitle subtitle="obtinecredit.ro/contract">Contracts</PageTitle>

      <ContractDetailModal
        contract={detailContract}
        isOpen={!!detailContract}
        onClose={() => setDetailContract(null)}
        isAdmin={isAdmin}
        onDelete={isAdmin ? onDelete : undefined}
      />

      <DataTable {...tableProps} />
    </div>
  );
};

export default ContractTable;
