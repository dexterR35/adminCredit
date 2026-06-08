import { openTelLink } from "../../utils/phone";

/**
 * Reusable table action definitions.
 * Each table composes its own actions; use createNormalActions() as the default set.
 */

export const createContactAction = (phoneKey = "phone") => ({
  id: "contact",
  label: "Contact",
  variant: "info",
  onClick: (row) => {
    openTelLink(row?.[phoneKey]);
  },
});

export const createDeleteAction = (onDelete, options = {}) => ({
  id: "delete",
  label: "Delete",
  variant: "danger",
  requiresConfirm: true,
  onClick: (row) => onDelete(row.id),
  ...options,
});

export const createEditAction = (onEdit) => ({
  id: "edit",
  label: "Edit",
  variant: "warning",
  onClick: onEdit,
});

export const createAssignAction = (onAssign) => ({
  id: "assign",
  label: "Assign",
  variant: "secondary",
  onClick: onAssign,
});

/**
 * Default actions: Delete (optional) + Contact.
 * Pass includeDelete: false to hide delete (e.g. non-admin views).
 */
export const createNormalActions = ({
  onDelete,
  phoneKey = "phone",
  includeDelete = true,
} = {}) => {
  const actions = [];

  if (includeDelete && onDelete) {
    actions.push(createDeleteAction(onDelete));
  }

  actions.push(createContactAction(phoneKey));

  return actions;
};

export const getActionVariant = (action) => {
  if (action.variant) return action.variant;

  switch (action.id || action.label?.toLowerCase()) {
    case "delete":
      return "danger";
    case "edit":
      return "warning";
    case "contact":
      return "info";
    default:
      return "secondary";
  }
};
