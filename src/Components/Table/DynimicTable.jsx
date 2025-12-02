import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { CustomButton } from "../Buttons/Buttons";
import Badge from "../Badge/Badge";
import { colors } from "../../constants/colors";

const DynamicTable = ({
  columns,
  data,
  loading,
  onDelete,
  onEdit,
  actions,
  title = "",
  linkTable = "",
  deleteDialogContent = "Are you sure you want to delete",
  deleteDialogTitle = "Confirm Delete",
}) => {
  const [deleteContractId, setDeleteContractId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [rowSelection, setRowSelection] = useState({});

  // Transform columns to TanStack Table format
  const tableColumns = useMemo(() => {
    const baseColumns = columns.map((col) => {
      // Handle badge configuration
      if (col.badge) {
        return {
          accessorKey: col.accessorKey,
          header: col.header,
          cell: ({ getValue, row }) => {
            const value = getValue();
            const badgeConfig = col.badge;
            
            // If value is a React element, render it directly (don't use badge)
            if (React.isValidElement(value)) {
              return value;
            }
            
            // Handle object values - convert to string or extract meaningful value
            let processedValue = value;
            if (value && typeof value === 'object' && !React.isValidElement(value)) {
              // If it's an object, try to extract a meaningful string
              if (value.toString && value.toString() !== '[object Object]') {
                processedValue = value.toString();
              } else if (value.text || value.label || value.value) {
                processedValue = value.text || value.label || value.value;
              } else if (Array.isArray(value)) {
                processedValue = value.join(', ');
              } else {
                // Try to get a string representation
                try {
                  processedValue = JSON.stringify(value);
                } catch (e) {
                  processedValue = String(value);
                }
              }
            }
            
            // Convert to string if not already (but skip if it's null/undefined)
            if (processedValue !== null && processedValue !== undefined && typeof processedValue !== 'string' && typeof processedValue !== 'number' && typeof processedValue !== 'boolean') {
              processedValue = String(processedValue);
            }
            
            // Determine badge variant based on value or function
            let variant = badgeConfig.variant || "default";
            if (typeof badgeConfig.getVariant === "function") {
              variant = badgeConfig.getVariant(processedValue, row.original) || variant;
            } else if (badgeConfig.variantMap && badgeConfig.variantMap[processedValue]) {
              variant = badgeConfig.variantMap[processedValue];
            }
            
            // Format value if formatter provided
            let displayValue = processedValue;
            if (badgeConfig.formatter) {
              displayValue = badgeConfig.formatter(processedValue, row.original);
            }
            
            // Ensure displayValue is a string or number for rendering
            if (displayValue === null || displayValue === undefined) {
              displayValue = "—";
            } else if (typeof displayValue === 'object' && !React.isValidElement(displayValue)) {
              displayValue = String(displayValue);
            }
            
            return (
              <Badge variant={variant} size={badgeConfig.size || "sm"}>
                {displayValue}
              </Badge>
            );
          },
          size: col.size || 150,
        };
      }
      
      // Handle custom Cell renderer (takes precedence over badge)
      if (col.Cell) {
        return {
          accessorKey: col.accessorKey,
          header: col.header,
          cell: (info) => {
            // Transform TanStack row format to match Material React Table format
            const row = {
              original: info.row.original,
              getValue: () => info.getValue(),
            };
            const cellContent = col.Cell({ row });
            // If Cell returns a React element, render it directly
            if (React.isValidElement(cellContent)) {
              return cellContent;
            }
            // Otherwise return the content as-is
            return cellContent;
          },
          size: col.size || 150,
        };
      }
      
      // Default cell renderer
      return {
        accessorKey: col.accessorKey,
        header: col.header,
        cell: ({ getValue }) => {
          const value = getValue();
          // Handle React elements (like JSX from bankHistory, bankStatus)
          if (React.isValidElement(value)) {
            return value;
          }
          return value ?? "—";
        },
        size: col.size || 150,
      };
    });

    // Return columns without selection checkbox column
    // Row selection will be handled by clicking on the row itself
    return baseColumns;
  }, [columns, actions]);

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
    enableRowSelection: true,
    state: {
      sorting,
      globalFilter,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const handleDelete = (contractId) => {
    setDeleteContractId(contractId);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (onDelete && deleteContractId) {
      onDelete(deleteContractId);
    }
    setShowDeleteModal(false);
    setDeleteContractId(null);
    setRowSelection({});
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteContractId(null);
  };

  const handleContact = (list) => {
    const { phone } = list;
    alert(`Contacting at ${phone}`);
    window.open(`tel:${phone}`);
  };

  const handleActionClick = (action) => {
    const selectedRows = table.getSelectedRowModel().flatRows;
    if (selectedRows.length === 0) return;

    selectedRows.forEach((row) => {
      switch (action.label) {
        case "Delete":
          handleDelete(row.original.id);
          break;
        case "Contact":
          handleContact(row.original);
          break;
        case "Edit":
          if (action.onClick) action.onClick(row.original);
          break;
        case "Send":
        case "send to Consultant":
          if (action.onClick) action.onClick(row.original);
          break;
        default:
          if (action.onClick) action.onClick(row.original);
          break;
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-700 border-t-indigo-500 rounded-full animate-spin"></div>
          <p className="text-gray-300 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header Section */}
        {title && (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">{title}</h2>
              {linkTable && (
                <p className="text-sm text-gray-400">
                  Info:{" "}
                  <a
                    href={linkTable}
                    target="_blank"
                    className="text-indigo-400 font-medium"
                    rel="noopener noreferrer"
                  >
                    {linkTable.replace("https://", "")}
                  </a>
                </p>
              )}
            </div>
            <div className="w-full sm:w-auto relative">
              <input
                type="text"
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Search..."
                className="w-full sm:w-64 px-4 py-2 pl-10 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all"
                style={{ 
                  border: `1px solid ${colors.border.primary}`,
                  '--tw-ring-color': colors.primary.DEFAULT,
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = colors.primary.light;
                  e.target.style.boxShadow = `0 0 0 2px ${colors.primary.DEFAULT}40`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = colors.border.primary;
                  e.target.style.boxShadow = 'none';
                }}
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        )}
        {!title && (
          <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4">
            <div className="w-full sm:w-auto relative">
              <input
                type="text"
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Search..."
                className="w-full sm:w-64 px-4 py-2 pl-10 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all"
                style={{ 
                  border: `1px solid ${colors.border.primary}`,
                  '--tw-ring-color': colors.primary.DEFAULT,
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = colors.primary.light;
                  e.target.style.boxShadow = `0 0 0 2px ${colors.primary.DEFAULT}40`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = colors.border.primary;
                  e.target.style.boxShadow = 'none';
                }}
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        )}

        {/* Action Buttons - Only show when rows are selected */}
        {actions && actions.length > 0 && table.getSelectedRowModel().flatRows.length > 0 && (
          <div 
            className="flex flex-wrap justify-end gap-2 mb-6 p-4 bg-gray-800 rounded-lg"
            style={{ border: `1px solid ${colors.border.primary}` }}
          >
            <div className="flex items-center gap-3 mr-auto">
              <span className="text-sm text-gray-400">
                {table.getSelectedRowModel().flatRows.length} row{table.getSelectedRowModel().flatRows.length > 1 ? 's' : ''} selected
              </span>
            </div>
            {actions.map((action, index) => (
              <CustomButton
                key={index}
                text={action.label}
                buttonType={
                  action.label === "Delete"
                    ? "delete"
                    : action.label === "Contact"
                    ? "info"
                    : action.label === "Edit"
                    ? "edit"
                    : action.label === "Send" || action.label === "send to Consultant"
                    ? "info"
                    : "default"
                }
                onClick={() => handleActionClick(action)}
                additionalClasses="rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200"
              />
            ))}
          </div>
        )}

        {/* Table */}
        <div 
          className="rounded-xl overflow-hidden bg-gray-900 shadow-lg"
          style={{ border: `1px solid ${colors.border.primary}` }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr
                    key={headerGroup.id}
                    className="bg-gray-800"
                    style={{ borderBottom: `1px solid ${colors.border.primary}` }}
                  >
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider"
                        style={{ width: header.getSize() }}
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            className={
                              header.column.getCanSort()
                                ? "cursor-pointer select-none flex items-center gap-2 group"
                                : ""
                            }
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {header.column.getCanSort() && (
                              <span className="text-gray-500 group-hover:text-indigo-400 transition-colors">
                                {{
                                  asc: " ↑",
                                  desc: " ↓",
                                }[header.column.getIsSorted()] ?? " ⇅"}
                              </span>
                            )}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="bg-gray-900" style={{ borderColor: colors.border.primary }}>
                {table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={tableColumns.length}
                      className="px-6 py-12 text-center"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="text-gray-400 font-medium">No data available</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row, index, array) => (
                    <tr
                      key={row.id}
                      onClick={() => {
                        if (actions && actions.length > 0) {
                          row.toggleSelected();
                        }
                      }}
                      className={`${
                        row.getIsSelected() 
                          ? "bg-gray-800" 
                          : "bg-gray-900"
                      } transition-colors ${actions && actions.length > 0 ? "cursor-pointer hover:bg-gray-800/50" : ""}`}
                      style={index < array.length - 1 ? { borderBottom: `1px solid ${colors.border.primary}40` } : {}}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="px-6 py-4 text-sm text-gray-200"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div 
            className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-gray-800"
            style={{ borderTop: `1px solid ${colors.border.primary}` }}
          >
            <div className="flex items-center gap-2">
              <button
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                className="px-3 py-2 rounded-lg bg-gray-800 text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors hover:bg-gray-700"
                style={{ border: `1px solid ${colors.border.primary}` }}
                title="First page"
              >
                {"<<"}
              </button>
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="px-3 py-2 rounded-lg bg-gray-800 text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors hover:bg-gray-700"
                style={{ border: `1px solid ${colors.border.primary}` }}
                title="Previous page"
              >
                {"<"}
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="px-3 py-2 rounded-lg bg-gray-800 text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors hover:bg-gray-700"
                style={{ border: `1px solid ${colors.border.primary}` }}
                title="Next page"
              >
                {">"}
              </button>
              <button
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                className="px-3 py-2 rounded-lg bg-gray-800 text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors hover:bg-gray-700"
                style={{ border: `1px solid ${colors.border.primary}` }}
                title="Last page"
              >
                {">>"}
              </button>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">
                Page{" "}
                <strong className="text-white">
                  {table.getState().pagination.pageIndex + 1}
                </strong>
                {" "}of{" "}
                <strong className="text-white">
                  {table.getPageCount()}
                </strong>
              </span>
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value));
                }}
                className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 focus:outline-none focus:ring-2 transition-all"
                style={{ 
                  border: `1px solid ${colors.border.primary}`,
                  '--tw-ring-color': colors.primary.DEFAULT,
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = colors.primary.light;
                  e.target.style.boxShadow = `0 0 0 2px ${colors.primary.DEFAULT}40`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = colors.border.primary;
                  e.target.style.boxShadow = 'none';
                }}
              >
                {[5, 10, 30, 50, 100].map((pageSize) => (
                  <option key={pageSize} value={pageSize} className="bg-gray-800">
                    Show {pageSize}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div 
            className="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-xl"
            style={{ border: `1px solid ${colors.border.primary}` }}
          >
            <h4 className="text-xl font-bold text-white mb-2">
              {deleteDialogTitle}
            </h4>
            <p className="text-gray-300 mb-6">{deleteDialogContent}</p>
            <div className="flex items-center justify-end gap-3">
              <CustomButton
                onClick={cancelDelete}
                text="Cancel"
                buttonType="default"
                additionalClasses="px-6 py-2 rounded-lg"
              />
              <CustomButton
                onClick={confirmDelete}
                text="Yes, Delete"
                buttonType="delete"
                additionalClasses="px-6 py-2 rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DynamicTable;
