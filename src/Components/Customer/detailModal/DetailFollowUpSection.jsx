import { useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { Button } from "../../Buttons";
import { DateTimeFieldGroup } from "../../Inputs";
import { Badge } from "../../Badge";
import {
  deleteClientFollowUp,
  dismissClientFollowUp,
  fetchFollowUpsForClient,
} from "../../../services/clientFollowUps";
import {
  followUpAtToDraft,
  getTodayFollowUpDate,
  hasFollowUpDraftContent,
  isFollowUpDue,
} from "../../../utils/followUpDates";

const followUpDraftShape = PropTypes.shape({
  date: PropTypes.string,
  time: PropTypes.string,
  note: PropTypes.string,
});

const ReminderListItem = ({ item, isEditing, onDismiss, onDelete, disabled }) => {
  const due = isFollowUpDue(item.follow_up_at);

  return (
    <li className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-900">
            {item.follow_up_at_label}
          </span>
          <Badge variant={due ? "danger" : "info"} size="sm">
            {due ? "Due" : "Scheduled"}
          </Badge>
        </div>
        {item.note ? (
          <p className="mt-1 text-sm text-gray-600">{item.note}</p>
        ) : null}
      </div>
      {isEditing && (
        <div className="flex shrink-0 gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            text="Complete"
            onClick={() => onDismiss(item.id)}
            disabled={disabled}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            text="Delete"
            onClick={() => onDelete(item.id)}
            disabled={disabled}
          />
        </div>
      )}
    </li>
  );
};

ReminderListItem.propTypes = {
  item: PropTypes.object.isRequired,
  isEditing: PropTypes.bool,
  onDismiss: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

const DetailFollowUpSection = ({
  creditApplicationId,
  fisaReportId,
  clientName,
  isEditing = false,
  disabled = false,
  draft,
  onDraftChange,
  onRemindersChanged,
}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const minDate = getTodayFollowUpDate();

  const loadItems = useCallback(async () => {
    if (!creditApplicationId && !fisaReportId) {
      setItems([]);
      return;
    }

    setLoading(true);
    try {
      const rows = await fetchFollowUpsForClient({ creditApplicationId, fisaReportId });
      setItems(rows);
    } catch (error) {
      console.error("Error loading follow-ups:", error);
      toast.error(error.message || "Could not load reminders.");
    } finally {
      setLoading(false);
    }
  }, [creditApplicationId, fisaReportId]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const wasEditing = useRef(isEditing);
  useEffect(() => {
    if (wasEditing.current && !isEditing) {
      loadItems();
    }
    wasEditing.current = isEditing;
  }, [isEditing, loadItems]);

  useEffect(() => {
    if (!isEditing || items.length === 0 || !onDraftChange) return;
    if (hasFollowUpDraftContent(draft)) return;

    const current = items[0];
    onDraftChange(followUpAtToDraft(current.follow_up_at, current.note));
  }, [isEditing, items, draft, onDraftChange]);

  const handleDraftChange = (field) => (event) => {
    onDraftChange?.({
      ...draft,
      [field]: event.target.value,
    });
  };

  const handleDismiss = async (id) => {
    try {
      await dismissClientFollowUp(id);
      setItems((prev) => prev.filter((row) => row.id !== id));
      onRemindersChanged?.();
      toast.success("Reminder completed.");
    } catch (error) {
      console.error("Error dismissing follow-up:", error);
      toast.error(error.message || "Could not update reminder.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteClientFollowUp(id);
      setItems((prev) => prev.filter((row) => row.id !== id));
      onRemindersChanged?.();
      toast.success("Reminder deleted.");
    } catch (error) {
      console.error("Error deleting follow-up:", error);
      toast.error(error.message || "Could not delete reminder.");
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50/80 p-4">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
            Follow-up reminders
          </p>
          <p className="mt-1 text-sm text-gray-600">
            {isEditing
              ? `Set or update the reminder for ${clientName || "this client"} — one per client, saved on Save (In Progress only).`
              : `Scheduled reminder for ${clientName || "this client"}.`}
          </p>
        </div>
        {loading && <span className="text-xs text-gray-400">Loading...</span>}
      </div>

      {isEditing && (
        <DateTimeFieldGroup
          dateValue={draft?.date || ""}
          timeValue={draft?.time || ""}
          noteValue={draft?.note || ""}
          minDate={minDate}
          onDateChange={handleDraftChange("date")}
          onTimeChange={handleDraftChange("time")}
          onNoteChange={handleDraftChange("note")}
          disabled={disabled}
        />
      )}

      {!loading && items.length === 0 && !isEditing && (
        <p className="text-sm text-gray-500">No reminders scheduled.</p>
      )}

      {!loading && items.length === 0 && isEditing && (
        <p className="mt-3 text-sm text-gray-500">
          No reminder yet. Set date and time, then click Save.
        </p>
      )}

      {items.length > 0 && (
        <ul className={isEditing ? "mt-4 space-y-2" : "space-y-2"}>
          {items.map((item) => (
            <ReminderListItem
              key={item.id}
              item={item}
              isEditing={isEditing}
              onDismiss={handleDismiss}
              onDelete={handleDelete}
              disabled={disabled}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

DetailFollowUpSection.propTypes = {
  creditApplicationId: PropTypes.string,
  fisaReportId: PropTypes.string,
  clientName: PropTypes.string,
  isEditing: PropTypes.bool,
  disabled: PropTypes.bool,
  draft: followUpDraftShape,
  onDraftChange: PropTypes.func,
  onRemindersChanged: PropTypes.func,
};

export default DetailFollowUpSection;
