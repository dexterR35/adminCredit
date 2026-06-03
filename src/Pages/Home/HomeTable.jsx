import { useState } from "react";
import PropTypes from "prop-types";
import {
  DataTable,
  useDataTable,
  photoColumn,
  pdfColumn,
  statusBadgeColumn,
} from "../../Components/Table";
import FisaReportDetailModal from "../../Components/Customer/FisaReportDetailModal";
import { useAuth } from "../../context/AuthContext";

const reportColumns = [
  { accessorKey: "client_full_name", header: "Client" },
  { accessorKey: "today_date", header: "Date" },
  { accessorKey: "phone", header: "Phone" },
  { accessorKey: "client_cnp", header: "CNP" },
  statusBadgeColumn({ accessorKey: "user_status", header: "Status" }),
  photoColumn(),
  pdfColumn(),
  { accessorKey: "created_at_label", header: "Created" },
];

const NewRaportTable = ({
  period: _period,
  raports = [],
  loading = false,
  onDelete,
}) => {
  const { isAdmin } = useAuth();
  const [detailReport, setDetailReport] = useState(null);

  const tableProps = useDataTable({
    data: raports,
    columns: reportColumns,
    loading,
    onRowClick: (report) => setDetailReport(report),
    emptyMessage: "No fisa reports yet",
  });

  return (
    <>
      <FisaReportDetailModal
        report={detailReport}
        isOpen={!!detailReport}
        onClose={() => setDetailReport(null)}
        isAdmin={isAdmin}
        onDelete={isAdmin ? onDelete : undefined}
      />
      <DataTable {...tableProps} />
    </>
  );
};

NewRaportTable.propTypes = {
  period: PropTypes.string,
  raports: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool,
  onDelete: PropTypes.func,
};

export default NewRaportTable;
