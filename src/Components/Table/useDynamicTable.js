/**
 * Hook to create dynamic table configurations
 * Usage:
 * const tableConfig = useDynamicTable({
 *   data: myData,
 *   columns: myColumns,
 *   actions: myActions,
 *   onDelete: handleDelete,
 * });
 */
export const useDynamicTable = ({
  data = [],
  columns = [],
  actions = [],
  onDelete,
  onEdit,
  title = "",
  linkTable = "",
  deleteDialogTitle = "Confirm Delete",
  deleteDialogContent = "Are you sure you want to delete this item?",
  loading = false,
}) => {
  return {
    data,
    columns,
    actions,
    onDelete,
    onEdit,
    title,
    linkTable,
    deleteDialogTitle,
    deleteDialogContent,
    loading,
  };
};

/**
 * Helper to create badge column configuration
 */
export const createBadgeColumn = ({
  accessorKey,
  header,
  size = 100,
  variantMap = {},
  getVariant,
  formatter,
  size: badgeSize = "sm",
}) => {
  return {
    accessorKey,
    header,
    size,
    badge: {
      variantMap,
      getVariant,
      formatter,
      size: badgeSize,
    },
  };
};

/**
 * Helper to create standard column configuration
 */
export const createColumn = ({
  accessorKey,
  header,
  size = 150,
  Cell,
  badge,
}) => {
  return {
    accessorKey,
    header,
    size,
    Cell,
    badge,
  };
};

