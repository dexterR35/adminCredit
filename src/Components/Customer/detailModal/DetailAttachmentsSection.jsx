import { useRef } from "react";
import PropTypes from "prop-types";
import { HiOutlineDocument, HiOutlineTrash, HiOutlineArrowUpTray } from "react-icons/hi2";
import { Button } from "../../Buttons";
import { Badge } from "../../Badge";
import { formatFileSize, CLIENT_ATTACHMENT_ACCEPT, CLIENT_ATTACHMENT_HELP_TEXT } from "../../../utils/fileUpload";

const attachmentPresetForName = (name = "") => {
  const lower = name.toLowerCase();
  if (lower.endsWith(".pdf")) return "pdf";
  if (/\.(png|jpe?g|webp)$/.test(lower)) return "photo";
  return "pdf";
};

const DetailAttachmentsSection = ({
  attachments = [],
  isEditing = false,
  disabled = false,
  uploading = false,
  onUpload,
  onRemove,
}) => {
  const inputRef = useRef(null);

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !onUpload) return;
    await onUpload(file);
  };

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
          Documents
        </p>
        {isEditing && onUpload && (
          <>
            <input
              ref={inputRef}
              type="file"
              className="sr-only"
              accept={CLIENT_ATTACHMENT_ACCEPT}
              onChange={handleFileChange}
              disabled={disabled || uploading}
            />
            <Button
              variant="outline"
              type="button"
              text="Add document"
              icon={<HiOutlineArrowUpTray className="h-4 w-4" aria-hidden />}
              onClick={() => inputRef.current?.click()}
              disabled={disabled || uploading}
              loading={uploading}
              loadingText="Uploading..."
              className="shrink-0"
            />
          </>
        )}
      </div>

      {isEditing && (
        <p className="mb-3 text-xs text-gray-500">{CLIENT_ATTACHMENT_HELP_TEXT}</p>
      )}

      {!attachments.length ? (
        <p className="text-sm text-gray-500">
          {isEditing ? "No documents attached yet." : "No documents."}
        </p>
      ) : (
        <ul className="space-y-2">
          {attachments.map((attachment) => {
            const preset = attachmentPresetForName(attachment.originalName);
            const canOpen = Boolean(attachment.url);

            return (
              <li
                key={attachment.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50/70 px-3 py-2.5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500">
                    <HiOutlineDocument className="h-5 w-5" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {attachment.originalName || "Document"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(attachment.fileSize)}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {canOpen ? (
                    <a
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <Badge variant="info" size="sm" interactive>
                        {preset === "photo" ? "View image" : "View file"}
                      </Badge>
                    </a>
                  ) : (
                    <Badge variant="default" size="sm">
                      Unavailable
                    </Badge>
                  )}

                  {isEditing && onRemove && !attachment.isLegacy && (
                    <button
                      type="button"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-red-200 text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                      onClick={() => onRemove(attachment)}
                      disabled={disabled || uploading}
                      aria-label={`Remove ${attachment.originalName || "document"}`}
                    >
                      <HiOutlineTrash className="h-4 w-4" aria-hidden />
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

DetailAttachmentsSection.propTypes = {
  attachments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      originalName: PropTypes.string,
      fileSize: PropTypes.number,
      url: PropTypes.string,
      isLegacy: PropTypes.bool,
    })
  ),
  isEditing: PropTypes.bool,
  disabled: PropTypes.bool,
  uploading: PropTypes.bool,
  onUpload: PropTypes.func,
  onRemove: PropTypes.func,
};

export default DetailAttachmentsSection;
