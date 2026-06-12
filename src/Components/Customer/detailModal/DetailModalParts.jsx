import PropTypes from "prop-types";
import { Modal } from "../../Modal";
import { Button } from "../../Buttons";
import { Badge, statusBadgeVariant } from "../../Badge";
import { LinkDataBadge } from "../../Table/tableBadges";
import { LINK_BADGE_PRESETS } from "../../Badge/badgeStyles";
import { SelectField } from "../../Inputs";
import { FISA_STATUS_OPTIONS } from "../../../services/fisaReportStatus";

export const DetailModalShell = ({
  isOpen,
  onClose,
  title,
  description,
  status,
  showStatus = false,
  isEditing = false,
  canDelete = false,
  onDelete,
  footer,
  children,
}) => {
  const hasHeaderBadges =
    (showStatus && status) || isEditing;

  return (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title={title}
    titleTrailing={
      hasHeaderBadges ? (
      <div className="flex flex-wrap items-center justify-end gap-2">
        {showStatus && status && (
          <Badge variant={statusBadgeVariant(status)} size="sm">
            {status}
          </Badge>
        )}
        {isEditing && (
          <Badge variant="default" size="sm">
            Editing
          </Badge>
        )}
        {isEditing && canDelete && onDelete && (
          <Badge
            as="button"
            type="button"
            variant="danger"
            size="sm"
            interactive
            onClick={onDelete}
          >
            Delete
          </Badge>
        )}
      </div>
      ) : null
    }
    description={description}
    size="2xl"
    footer={footer}
  >
    <div className="space-y-6">{children}</div>
  </Modal>
  );
};

DetailModalShell.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  status: PropTypes.string,
  showStatus: PropTypes.bool,
  isEditing: PropTypes.bool,
  canDelete: PropTypes.bool,
  onDelete: PropTypes.func,
  footer: PropTypes.node,
  children: PropTypes.node,
};

export const DetailModalFooter = ({
  isEditing = false,
  canEdit = false,
  canSave = false,
  onStartEdit,
  onCancelEdit,
  onSave,
  saving = false,
  onClose,
  saveText = "Save",
  savingText = "Saving...",
  leading = null,
}) => (
  <div
    className={`flex flex-col gap-3 sm:flex-row sm:items-end ${leading ? "sm:justify-between" : "sm:justify-end"}`}
  >
    {leading ? <div className="min-w-0 w-full flex-1 sm:max-w-md">{leading}</div> : null}
    <div className="flex w-full shrink-0 flex-wrap justify-end gap-2 sm:w-auto">
      {isEditing ? (
        <>
          <Button
            variant="outline"
            text="Cancel"
            type="button"
            onClick={onCancelEdit}
            disabled={saving}
          />
          {canSave && onSave && (
            <Button
              variant="primary"
              text={saveText}
              type="button"
              onClick={onSave}
              loading={saving}
              loadingText={savingText}
            />
          )}
        </>
      ) : (
        <>
          {canEdit && onStartEdit && (
            <Button variant="primary" text="Edit" type="button" onClick={onStartEdit} />
          )}
          <Button variant="outline" text="Close" type="button" onClick={onClose} />
        </>
      )}
    </div>
  </div>
);

DetailModalFooter.propTypes = {
  isEditing: PropTypes.bool,
  canEdit: PropTypes.bool,
  canSave: PropTypes.bool,
  onStartEdit: PropTypes.func,
  onCancelEdit: PropTypes.func,
  onSave: PropTypes.func,
  saving: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  saveText: PropTypes.string,
  savingText: PropTypes.string,
  leading: PropTypes.node,
};

export const DetailSection = ({
  title,
  description,
  children,
  className = "",
}) => (
  <section className={className}>
    <div className="mb-3">
      <p className="text-xs font-medium uppercase tracking-wider text-gray-400">{title}</p>
      {description ? (
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      ) : null}
    </div>
    <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-4 sm:p-5">
      {children}
    </div>
  </section>
);

DetailSection.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
};

export const DetailStatusSelect = ({
  value,
  onChange,
  disabled = false,
  name = "record_status",
}) => (
  <div className="max-w-xs">
    <SelectField
      label="Client outcome"
      name={name}
      value={value}
      onChange={onChange}
      options={FISA_STATUS_OPTIONS}
      disabled={disabled}
    />
  </div>
);

DetailStatusSelect.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  name: PropTypes.string,
};

export const DetailDocumentsSection = ({ items = [] }) => {
  if (!items.length) return null;

  return (
    <div>
      <p className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-400">
        Documents
      </p>
      <div className="flex flex-wrap gap-2">
        {items.map(({ key, url, viewLabel, missingLabel, preset }) => (
          <LinkDataBadge
            key={key}
            url={url}
            viewLabel={viewLabel}
            missingLabel={missingLabel}
            {...LINK_BADGE_PRESETS[preset]}
          />
        ))}
      </div>
    </div>
  );
};

DetailDocumentsSection.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      url: PropTypes.string,
      viewLabel: PropTypes.string.isRequired,
      missingLabel: PropTypes.string.isRequired,
      preset: PropTypes.string.isRequired,
    })
  ),
};
