import { useState } from "react";
import PropTypes from "prop-types";
import {
  DataTable,
  useDataTable,
  fisaPhotoColumn,
  fisaPdfColumn,
  phoneColumn,
  fisaStatusBadgeColumn,
  fisaReportExportColumns,
} from "../../Components/Table";
import FisaReportDetailModal from "../../Components/Customer/FisaReportDetailModal";

const reportColumns = [
  { accessorKey: "client_full_name", header: "Client" },
  { accessorKey: "today_date", header: "Date" },
  phoneColumn(),
  { accessorKey: "client_cnp", header: "CNP" },
  fisaStatusBadgeColumn({ header: "Status" }),
  fisaPhotoColumn(),
  fisaPdfColumn(),
  { accessorKey: "created_at_label", header: "Created" },
];

const NewRaportTable = ({
  raports = [],
  loading = false,
  onDelete,
}) => {
  const [detailReport, setDetailReport] = useState(null);

  const handleReportUpdated = (updated) => {
    setDetailReport(updated);
  };

  const tableProps = useDataTable({
    data: raports,
    columns: reportColumns,
    loading,
    onRowClick: (report) => setDetailReport(report),
    emptyMessage: "No client records yet",
    exportColumns: fisaReportExportColumns,
    exportFileName: "client-records",
  });

  return (
    <>
      <FisaReportDetailModal
        report={detailReport}
        isOpen={!!detailReport}
        onClose={() => setDetailReport(null)}
        onDelete={onDelete}
        onReportUpdated={handleReportUpdated}
      />
      <DataTable {...tableProps} />
    </>
  );
};

NewRaportTable.propTypes = {
  raports: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool,
  onDelete: PropTypes.func,
};

export default NewRaportTable;
