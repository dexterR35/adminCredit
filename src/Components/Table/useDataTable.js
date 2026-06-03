import { useMemo } from "react";

/**
 * Compose reusable table props for DataTable.
 * Row actions live in detail modals — pass onRowClick to open them.
 *
 * @example
 * const tableProps = useDataTable({
 *   data: contracts,
 *   columns: contractColumns,
 *   onRowClick: (row) => setDetailRow(row),
 *   enableRowSelection: false,
 * });
 * return <DataTable {...tableProps} />;
 */
export const useDataTable = ({
  data = [],
  columns = [],
  loading = false,
  actions = [],
  title = "",
  linkTable = "",
  searchPlaceholder,
  emptyMessage,
  enableRowSelection = false,
  onRowClick,
  pageSize = 10,
}) => ({
  data,
  columns,
  loading,
  actions,
  title,
  linkTable,
  searchPlaceholder,
  emptyMessage,
  enableRowSelection,
  onRowClick,
  pageSize,
});
