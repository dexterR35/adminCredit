import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  DataTable,
  useDataTable,
  yesNoColumn,
  phoneColumn,
  fisaStatusBadgeColumn,
  webClientExportColumns,
} from "../../Components/Table";
import { FetchCustomersData, useAssignClient } from "../../services/Hooks";
import { useAuth } from "../../context/AuthContext";
import ClientDetailModal from "../../Components/Customer/ClientDetailModal";
import { PageTitle } from "../../Components/uiCheck";
import { fetchWebClientById } from "../../services/customers";
import { useClientModalRoute } from "../../hooks/useClientModalRoute";
import { useUrlOpenedEntity } from "../../hooks/useUrlOpenedEntity";
import { CLIENT_MODAL_PARAMS } from "../../utils/clientModalRoute";

const clientColumns = [
  {
    accessorKey: "full_name",
    header: "Name",
    size: 120,
    Cell: ({ row }) => (
      <span className="font-medium capitalize text-gray-900">{row.original.full_name || "—"}</span>
    ),
  },
  phoneColumn({ size: 100 }),
  { accessorKey: "email", header: "Email", size: 150 },
  { accessorKey: "referral_source_label", header: "Source", size: 120 },
  { accessorKey: "path_label", header: "Path", size: 120 },
  { accessorKey: "outcome_label", header: "Outcome", size: 120 },
  { accessorKey: "banks", header: "Banks", size: 120 },
  { accessorKey: "ifn", header: "IFN", size: 120 },
  { accessorKey: "others", header: "Others", size: 120 },
  { accessorKey: "employment_start_date", header: "Employment date", size: 110 },
  yesNoColumn({ accessorKey: "has_banking_history", header: "Bank history" }),
  yesNoColumn({ accessorKey: "has_negative_bc_report", header: "Negative BC" }),
  { accessorKey: "submitted_at_label", header: "Submitted", size: 120 },
  fisaStatusBadgeColumn({ accessorKey: "status", header: "Status", size: 90 }),
];

const ClientsTable = () => {
  const { customerData, loading, deleteCustomer, updateCustomer } = FetchCustomersData();
  const { isAdmin } = useAuth();
  const { assignableUsers, loadAssignableUsers, assignClient } = useAssignClient();
  const [assignLoading, setAssignLoading] = useState(false);
  const {
    webClientId,
    openWebClient,
    closeClientModals,
  } = useClientModalRoute({
    webClientParam: CLIENT_MODAL_PARAMS.CUSTOMERS_CLIENT,
    includeFisa: false,
  });

  const {
    entity: detailClient,
    setEntity: setDetailClient,
    loading: detailLoading,
  } = useUrlOpenedEntity({
    id: webClientId,
    fetchById: fetchWebClientById,
  });

  useEffect(() => {
    if (isAdmin) loadAssignableUsers();
  }, [isAdmin, loadAssignableUsers]);

  const handleAssign = async (client, userId) => {
    setAssignLoading(true);
    try {
      await assignClient(client.id, userId);
      setDetailClient((prev) =>
        prev?.id === client.id ? { ...prev, assigned_user_id: userId } : prev
      );
    } catch (error) {
      toast.error(error.message || "Failed to assign client.");
    } finally {
      setAssignLoading(false);
    }
  };

  const tableProps = useDataTable({
    data: customerData,
    columns: clientColumns,
    loading: loading || detailLoading,
    onRowClick: (client) => openWebClient(client.id),
    linkTable: "https://obtinecredit.ro/formular",
    emptyMessage: "No web clients yet",
    exportColumns: webClientExportColumns,
    exportFileName: "web-clients",
  });

  return (
    <div className="space-y-6">
      <PageTitle subtitle="obtinecredit.ro/formular">Web Clients</PageTitle>

      <ClientDetailModal
        client={detailClient}
        isOpen={!!detailClient}
        onClose={() => {
          closeClientModals();
          setDetailClient(null);
        }}
        isAdmin={isAdmin}
        users={assignableUsers}
        updateCustomer={updateCustomer}
        onClientUpdated={setDetailClient}
        onDelete={isAdmin ? deleteCustomer : undefined}
        onAssign={isAdmin ? handleAssign : undefined}
        assignLoading={assignLoading}
      />

      <DataTable {...tableProps} />
    </div>
  );
};

export default ClientsTable;
