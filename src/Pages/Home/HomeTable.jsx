import PropTypes from "prop-types";
import {
  DataTable,
  useDataTable,
  fisaPhotoColumn,
  fisaPdfColumn,
  phoneColumn,
  fisaStatusBadgeColumn,
  fisaReminderColumn,
  requestedCreditColumn,
  fisaReportExportColumns,
} from "../../Components/Table";
import FisaReportDetailModal from "../../Components/Customer/FisaReportDetailModal";
import { fetchFisaReportById } from "../../services/fisaReports";
import { useClientModalRoute } from "../../hooks/useClientModalRoute";
import { useUrlOpenedEntity } from "../../hooks/useUrlOpenedEntity";

const reportColumns = [
  { accessorKey: "client_full_name", header: "Client" },
  { accessorKey: "today_date", header: "Date" },
  phoneColumn(),
  { accessorKey: "client_cnp", header: "CNP" },
  fisaStatusBadgeColumn({ header: "Status" }),
  fisaReminderColumn(),
  requestedCreditColumn(),
  fisaPhotoColumn(),
  fisaPdfColumn(),
  { accessorKey: "created_at_label", header: "Created" },
];

const NewRaportTable = ({
  raports = [],
  loading = false,
  onDelete,
}) => {
  const { fisaReportId, openFisaReport, closeClientModals } = useClientModalRoute({
    includeWebClient: false,
  });

  const {
    entity: detailReport,
    setEntity: setDetailReport,
    loading: detailLoading,
  } = useUrlOpenedEntity({
    id: fisaReportId,
    fetchById: fetchFisaReportById,
  });

  const handleReportUpdated = (updated) => {
    setDetailReport(updated);
  };

  const tableProps = useDataTable({
    data: raports,
    columns: reportColumns,
    loading: loading || detailLoading,
    onRowClick: (report) => openFisaReport(report.id, { tab: "records" }),
    emptyMessage: "No client records yet",
    exportColumns: fisaReportExportColumns,
    exportFileName: "client-records",
  });

  const handleClose = () => {
    closeClientModals();
    setDetailReport(null);
  };

  return (
    <>
      <FisaReportDetailModal
        report={detailReport}
        isOpen={Boolean(detailReport)}
        onClose={handleClose}
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
