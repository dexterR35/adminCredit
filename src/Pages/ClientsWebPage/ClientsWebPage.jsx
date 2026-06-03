import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  DataTable,
  useDataTable,
  yesNoColumn,
  statusBadgeColumn,
} from "../../Components/Table";
import { FetchCustomersData, useAssignClient } from "../../services/Hooks";
import { useAuth } from "../../context/AuthContext";
import ClientDetailModal from "../../Components/Customer/ClientDetailModal";

const clientColumns = [
  {
    accessorKey: "full_name",
    header: "Name",
    size: 120,
    Cell: ({ row }) => (
      <span className="font-medium capitalize text-gray-900">{row.original.full_name || "—"}</span>
    ),
  },
  { accessorKey: "phone", header: "Phone", size: 100 },
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
  statusBadgeColumn({ accessorKey: "status", header: "Status", size: 90 }),
];

const ClientsTable = () => {
  const { customerData, loading, deleteCustomer, updateCustomer } = FetchCustomersData();
  const { isAdmin } = useAuth();
  const { consultants, loadConsultants, assignClient } = useAssignClient();
  const [detailClient, setDetailClient] = useState(null);
  const [assignLoading, setAssignLoading] = useState(false);

  useEffect(() => {
    if (isAdmin) loadConsultants();
  }, [isAdmin, loadConsultants]);

  const handleAssign = async (client, consultantId) => {
    setAssignLoading(true);
    try {
      await assignClient(client.id, consultantId);
      setDetailClient((prev) =>
        prev?.id === client.id ? { ...prev, assigned_user_id: consultantId } : prev
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
    loading,
    onRowClick: (client) => setDetailClient(client),
    linkTable: "https://obtinecredit.ro/formular",
    emptyMessage: "No web clients yet",
  });

  return (
    <div className="space-y-6">
      <div className="dash-page-header">
        <div>
          <h1 className="dash-page-title">Web Clients</h1>
          <p className="dash-page-subtitle">obtinecredit.ro/formular</p>
        </div>
      </div>

      <ClientDetailModal
        client={detailClient}
        isOpen={!!detailClient}
        onClose={() => setDetailClient(null)}
        isAdmin={isAdmin}
        consultants={consultants}
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
