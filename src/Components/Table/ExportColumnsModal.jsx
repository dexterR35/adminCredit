import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Modal } from "../Modal";
import { Checkbox } from "../Inputs";

const ExportColumnsModal = ({
  isOpen,
  onClose,
  columns,
  rowCount,
  onExport,
  exporting = false,
}) => {
  const [selectedKeys, setSelectedKeys] = useState([]);

  useEffect(() => {
    if (!isOpen) return;
    setSelectedKeys(columns.map((col) => col.key));
  }, [isOpen, columns]);

  const allSelected = selectedKeys.length === columns.length;
  const noneSelected = selectedKeys.length === 0;

  const toggleColumn = (key) => {
    setSelectedKeys((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  };

  const handleToggleAll = () => {
    setSelectedKeys(allSelected ? [] : columns.map((col) => col.key));
  };

  const handleExport = () => {
    onExport(selectedKeys);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Export to CSV"
      description={`Choose columns to include. ${rowCount} row(s) match your current search filter.`}
      size="md"
      cancelText="Cancel"
      confirmText="Export CSV"
      onConfirm={handleExport}
      confirmButtonType="primary"
      confirmLoading={exporting}
      confirmDisabled={noneSelected || rowCount === 0}
    >
      <div className="space-y-4">
        <button
          type="button"
          onClick={handleToggleAll}
          className="text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          {allSelected ? "Deselect all" : "Select all"}
        </button>

        <div className="max-h-64 space-y-2 overflow-y-auto rounded-xl border border-gray-200 bg-gray-50/60 p-3">
          {columns.map((col) => (
            <Checkbox
              key={col.key}
              name={`export_${col.key}`}
              label={col.header}
              checked={selectedKeys.includes(col.key)}
              onChange={() => toggleColumn(col.key)}
            />
          ))}
        </div>

        {rowCount === 0 && (
          <p className="text-sm text-amber-700">No rows to export with the current search filter.</p>
        )}
      </div>
    </Modal>
  );
};

ExportColumnsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      header: PropTypes.string.isRequired,
    })
  ).isRequired,
  rowCount: PropTypes.number.isRequired,
  onExport: PropTypes.func.isRequired,
  exporting: PropTypes.bool,
};

export default ExportColumnsModal;
