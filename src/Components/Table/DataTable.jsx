import React, { useState, useMemo, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { toast } from "react-toastify";
import { ConfirmModal, DeleteConfirmModal, getTableDeleteConfirm } from "../Modal";
import { SearchInput, Select, inputClassName } from "../Inputs";
import { Button } from "../Buttons";
import { TableBadge } from "./tableBadges";
import { getActionButtonType } from "./tableActions";
import { sanitizeUrlForHref } from "../../utils/sanitize";
import { useTrackLoading } from "../LoadingProgress";
import ExportColumnsModal from "./ExportColumnsModal";
import { exportRowsToCsv, resolveExportColumns } from "./tableExport";
import { useDebouncedValue } from "../../hooks/useDebounce";

const DataTable = ({
  columns,
  data,
  loading = false,
  actions = [],
  title = "",
  linkTable = "",
  searchPlaceholder = "Search records...",
  emptyMessage = "No data available",
  enableRowSelection = true,
  onRowClick,
  pageSize = 10,
  enableExport = true,
  exportColumns,
  exportFileName = "export",
}) => {
  const [pendingConfirm, setPendingConfirm] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebouncedValue(searchInput, 300);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  const rowClickable = typeof onRowClick === "function";
  const selectable = enableRowSelection && actions.length > 0 && !rowClickable;
  const safeLinkTable = useMemo(
    () => (linkTable ? sanitizeUrlForHref(linkTable) : null),
    [linkTable]
  );

  useTrackLoading(loading);

  useEffect(() => {
    setGlobalFilter(debouncedSearch);
  }, [debouncedSearch]);

  const tableColumns = useMemo(() => {
    return columns.map((col) => {
      if (col.badge) {
        return {
          accessorKey: col.accessorKey,
          header: col.header,
          cell: ({ getValue, row }) => {
            const value = getValue();
            const badgeConfig = col.badge;

            if (React.isValidElement(value)) return value;

            let processedValue = value;
            if (value && typeof value === "object" && !React.isValidElement(value)) {
              if (value.text || value.label || value.value) {
                processedValue = value.text || value.label || value.value;
              } else if (Array.isArray(value)) {
                processedValue = value.join(", ");
              } else {
                processedValue = String(value);
              }
            }

            let variant = badgeConfig.variant || "default";
            if (typeof badgeConfig.getVariant === "function") {
              variant = badgeConfig.getVariant(processedValue, row.original) || variant;
            } else if (badgeConfig.variantMap?.[processedValue]) {
              variant = badgeConfig.variantMap[processedValue];
            }

            let displayValue = processedValue;
            if (badgeConfig.formatter) {
              displayValue = badgeConfig.formatter(processedValue, row.original);
            }
            if (displayValue === null || displayValue === undefined) displayValue = "—";

            return (
              <TableBadge variant={variant}>
                {displayValue}
              </TableBadge>
            );
          },
          size: col.size || 150,
        };
      }

      if (col.Cell) {
        return {
          accessorKey: col.accessorKey,
          header: col.header,
          cell: (info) => {
            const row = { original: info.row.original, getValue: () => info.getValue() };
            return col.Cell({ row });
          },
          size: col.size || 150,
        };
      }

      return {
        accessorKey: col.accessorKey,
        header: col.header,
        cell: ({ getValue }) => {
          const value = getValue();
          if (React.isValidElement(value)) return value;
          return value ?? "—";
        },
        size: col.size || 150,
      };
    });
  }, [columns]);

  const table = useReactTable({
    data: data || [],
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    enableRowSelection: selectable,
    state: { sorting, globalFilter, rowSelection },
    initialState: { pagination: { pageSize } },
  });

  const selectedRows = table.getSelectedRowModel().flatRows;
  const resolvedExportColumns = useMemo(
    () => resolveExportColumns(columns, exportColumns),
    [columns, exportColumns]
  );
  const filteredRows = table.getFilteredRowModel().rows.map((row) => row.original);
  const showExport = enableExport && resolvedExportColumns.length > 0;

  const handleExport = (selectedKeys) => {
    setExporting(true);
    try {
      const didExport = exportRowsToCsv({
        rows: filteredRows,
        columns: resolvedExportColumns,
        selectedKeys,
        fileName: exportFileName,
      });

      if (didExport) {
        toast.success(`Exported ${filteredRows.length} row(s) to CSV.`);
        setExportModalOpen(false);
      } else {
        toast.error("Nothing to export.");
      }
    } catch (error) {
      toast.error(error.message || "Could not export CSV.");
    } finally {
      setExporting(false);
    }
  };

  const runAction = (action, rows) => {
    rows.forEach((row) => action.onClick?.(row.original));
    setRowSelection({});
  };

  const handleActionClick = (action) => {
    if (selectedRows.length === 0) return;

    if (action.requiresConfirm) {
      setPendingConfirm({ action, rows: selectedRows });
      return;
    }

    runAction(action, selectedRows);
  };

  const confirmPendingAction = () => {
    if (pendingConfirm) {
      runAction(pendingConfirm.action, pendingConfirm.rows);
      setPendingConfirm(null);
    }
  };

  return (
    <>
      <div className="space-y-5">
        {title && (
            <div>
              <h2 className="text-lg font-display font-semibold text-gray-900">{title}</h2>
              {safeLinkTable && (
                <p className="mt-1 text-sm text-gray-500">
                  Source:{" "}
                  <a
                    href={safeLinkTable}
                    target="_blank"
                    className="font-medium text-primary-600 hover:text-primary-700"
                    rel="noopener noreferrer"
                  >
                    {linkTable.replace(/^https?:\/\//, "")}
                  </a>
                </p>
              )}
            </div>
          )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchInput
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full sm:flex-1"
          />
          {showExport && (
            <Button
              type="button"
              variant="secondary"
              text="Export CSV"
              onClick={() => setExportModalOpen(true)}
              disabled={loading || filteredRows.length === 0}
              className="w-full shrink-0 sm:w-auto"
            />
          )}
        </div>

        {selectable && selectedRows.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-primary-100 bg-primary-50/60 p-4">
            <span className="mr-auto text-sm font-medium text-primary-800">
              {selectedRows.length} row(s) selected
            </span>
            {actions.map((action) => (
              <Button
                key={action.id || action.label}
                text={action.label}
                buttonType={getActionButtonType(action)}
                size="sm"
                onClick={() => handleActionClick(action)}
              />
            ))}
          </div>
        )}

        <div className="dash-table-wrap">
          <div className="overflow-x-auto">
            <table className="dash-table">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} style={{ width: header.getSize() }}>
                        {header.isPlaceholder ? null : (
                          <div
                            className={header.column.getCanSort() ? "group flex cursor-pointer select-none items-center gap-2" : ""}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {header.column.getCanSort() && (
                              <span className="text-gray-400 group-hover:text-primary-600">
                                {{ asc: "↑", desc: "↓" }[header.column.getIsSorted()] ?? "↕"}
                              </span>
                            )}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td colSpan={tableColumns.length}>
                      {loading ? (
                        <div className="py-12" aria-hidden />
                      ) : (
                        <div className="dash-empty">
                          <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                          </svg>
                          <p className="font-medium text-gray-500">{emptyMessage}</p>
                        </div>
                      )}
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      onClick={() => {
                        if (rowClickable) onRowClick(row.original);
                        else if (selectable) row.toggleSelected();
                      }}
                      className={[
                        row.getIsSelected() ? "dash-table-row--selected" : "",
                        rowClickable || selectable ? "cursor-pointer" : "",
                        rowClickable ? "hover:bg-gray-50/80" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="dash-table-footer">
            <div className="flex items-center gap-2">
              {["<<", "<", ">", ">>"].map((label, i) => {
                const handlers = [
                  () => table.setPageIndex(0),
                  () => table.previousPage(),
                  () => table.nextPage(),
                  () => table.setPageIndex(table.getPageCount() - 1),
                ];
                const disabled = i < 2 ? !table.getCanPreviousPage() : !table.getCanNextPage();
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={handlers[i]}
                    disabled={disabled}
                    className="dash-btn dash-btn-secondary px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                Page <strong className="text-gray-900">{table.getState().pagination.pageIndex + 1}</strong> of{" "}
                <strong className="text-gray-900">{table.getPageCount()}</strong>
              </span>
              <Select
                value={table.getState().pagination.pageSize}
                onChange={(e) => table.setPageSize(Number(e.target.value))}
                className={inputClassName({ className: "h-9 w-auto py-1.5" })}
              >
                {[5, 10, 30, 50, 100].map((size) => (
                  <option key={size} value={size}>Show {size}</option>
                ))}
              </Select>
            </div>
          </div>
        </div>
      </div>

      {pendingConfirm?.action?.id === "delete" ? (
        <DeleteConfirmModal
          isOpen
          onClose={() => setPendingConfirm(null)}
          onConfirm={confirmPendingAction}
          {...getTableDeleteConfirm(pendingConfirm.rows)}
        />
      ) : (
        <ConfirmModal
          isOpen={!!pendingConfirm}
          onClose={() => setPendingConfirm(null)}
          onConfirm={confirmPendingAction}
          title={pendingConfirm?.action?.confirmTitle || "Are you sure?"}
          message={pendingConfirm?.action?.confirmMessage || "Continue with this action?"}
          confirmText={pendingConfirm?.action?.confirmText || "Yes"}
          cancelText={pendingConfirm?.action?.cancelText || "No"}
          confirmButtonType={pendingConfirm?.action?.confirmButtonType || "primary"}
        />
      )}

      <ExportColumnsModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        columns={resolvedExportColumns}
        rowCount={filteredRows.length}
        onExport={handleExport}
        exporting={exporting}
      />
    </>
  );
};

export default DataTable;
