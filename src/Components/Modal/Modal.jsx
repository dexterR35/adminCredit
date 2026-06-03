import { useEffect } from "react";
import PropTypes from "prop-types";
import { Button } from "../Buttons";

const SIZE_CLASSES = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
};

const ModalFooter = ({
  cancelText = "Cancel",
  confirmText = "Save",
  onCancel,
  onConfirm,
  confirmButtonType = "submit",
  confirmLoading = false,
  confirmDisabled = false,
  hideCancel = false,
  align = "right",
}) => (
  <div className={`flex flex-wrap gap-3 ${align === "right" ? "justify-end" : "justify-start"}`}>
    {!hideCancel && onCancel && (
      <Button variant="secondary" text={cancelText} onClick={onCancel} type="button" />
    )}
    {onConfirm && (
      <Button
        text={confirmText}
        buttonType={confirmButtonType}
        onClick={onConfirm}
        type="button"
        loading={confirmLoading}
        disabled={confirmDisabled}
      />
    )}
  </div>
);

ModalFooter.propTypes = {
  cancelText: PropTypes.string,
  confirmText: PropTypes.string,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  confirmButtonType: PropTypes.string,
  confirmLoading: PropTypes.bool,
  confirmDisabled: PropTypes.bool,
  hideCancel: PropTypes.bool,
  align: PropTypes.oneOf(["left", "right"]),
};

const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "lg",
  showCloseButton = true,
  closeOnOverlay = true,
  closeOnEscape = true,
  footer,
  cancelText,
  confirmText,
  onConfirm,
  confirmButtonType = "submit",
  confirmLoading = false,
  confirmDisabled = false,
  hideFooter = false,
}) => {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleEscape = (e) => {
      if (closeOnEscape && e.key === "Escape") onClose?.();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose, closeOnEscape]);

  if (!isOpen) return null;

  const hasPresetFooter = !footer && !hideFooter && (onConfirm || onClose);
  const footerContent = footer ?? (hasPresetFooter ? (
    <ModalFooter
      cancelText={cancelText}
      confirmText={confirmText}
      onCancel={onClose}
      onConfirm={onConfirm}
      confirmButtonType={confirmButtonType}
      confirmLoading={confirmLoading}
      confirmDisabled={confirmDisabled}
    />
  ) : null);

  return (
    <div
      className="dash-modal-overlay"
      onClick={closeOnOverlay ? onClose : undefined}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <div
        className={`dash-modal w-full ${SIZE_CLASSES[size] || SIZE_CLASSES.lg}`}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || showCloseButton) && (
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="min-w-0">
              {title && (
                <h3 id="modal-title" className="dash-modal-title">
                  {title}
                </h3>
              )}
              {description && (
                <p className="mt-1 text-sm text-gray-500">{description}</p>
              )}
            </div>
            {showCloseButton && onClose && (
              <button
                onClick={onClose}
                type="button"
                className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close"
              >
                ×
              </button>
            )}
          </div>
        )}

        <div className="text-gray-700">{children}</div>

        {footerContent && <div className="mt-6 border-t border-gray-100 pt-4">{footerContent}</div>}
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  title: PropTypes.string,
  description: PropTypes.string,
  children: PropTypes.node,
  size: PropTypes.oneOf(["sm", "md", "lg", "xl", "2xl"]),
  showCloseButton: PropTypes.bool,
  closeOnOverlay: PropTypes.bool,
  closeOnEscape: PropTypes.bool,
  footer: PropTypes.node,
  cancelText: PropTypes.string,
  confirmText: PropTypes.string,
  onConfirm: PropTypes.func,
  confirmButtonType: PropTypes.string,
  confirmLoading: PropTypes.bool,
  confirmDisabled: PropTypes.bool,
  hideFooter: PropTypes.bool,
};

export { Modal, ModalFooter };
