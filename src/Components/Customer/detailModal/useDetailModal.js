import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

/** Load fresh row data when a detail modal opens. */
export const useDetailRefresh = ({
  isOpen,
  item,
  fetchById,
  errorMessage = "Could not refresh details.",
  onOpen,
}) => {
  const [displayRow, setDisplayRow] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    onOpen?.();
    if (!item?.id) return undefined;

    setDisplayRow(item);

    let cancelled = false;

    const refresh = async () => {
      try {
        const row = await fetchById(item.id);
        if (cancelled || !row) return;
        setDisplayRow(row);
      } catch (error) {
        console.error(error);
        toast.error(errorMessage);
      }
    };

    refresh();

    return () => {
      cancelled = true;
    };
  }, [item, isOpen, fetchById, errorMessage, onOpen]);

  if (!item) return { row: null, setDisplayRow };

  return {
    row: displayRow || item,
    setDisplayRow,
  };
};

/** Edit / view toggle — resets when modal closes. */
export const useDetailEditMode = (isOpen) => {
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!isOpen) setIsEditing(false);
  }, [isOpen]);

  const startEdit = useCallback(() => setIsEditing(true), []);
  const cancelEdit = useCallback(() => setIsEditing(false), []);

  return { isEditing, setIsEditing, startEdit, cancelEdit };
};

/** Delete confirmation flow shared by detail modals. */
export const useDetailDelete = ({
  onDelete,
  onClose,
  onAfterDelete,
  errorMessage = "Could not delete record.",
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteConfirm = useCallback(
    async (id) => {
      if (!onDelete) return;

      setDeleting(true);
      try {
        await onDelete(id);
        setConfirmDelete(false);
        onAfterDelete?.();
        onClose?.();
      } catch (error) {
        toast.error(error.message || errorMessage);
      } finally {
        setDeleting(false);
      }
    },
    [onDelete, onClose, onAfterDelete, errorMessage]
  );

  return {
    confirmDelete,
    setConfirmDelete,
    deleting,
    handleDeleteConfirm,
  };
};
