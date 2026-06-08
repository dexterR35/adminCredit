import { useEffect } from "react";
import PropTypes from "prop-types";
import Button from "./Button";
import { cx } from "./utils";

const SIZE_CLASS = {
  sm: "modal--sm",
  md: "modal--md",
  lg: "modal--lg",
  xl: "modal--xl",
  "2xl": "modal--2xl",
};

export const ModalFooter = ({
  cancelText = "Cancel",
  confirmText = "Save",
  onCancel,
  onConfirm,
  confirmButtonType = "primary",
  confirmLoading = false,
  confirmDisabled = false,
  hideCancel = false,
  align = "right",
}) => (
  <div className={cx("modal-actions", align === "left" && "modal-actions--left")}>
    {!hideCancel && onCancel && (
      <Button variant="secondary" size="sm" onClick={onCancel} type="button">
        {cancelText}
      </Button>
    )}
    {onConfirm && (
      <Button
        variant={confirmButtonType === "delete" ? "danger" : "primary"}
        size="sm"
        onClick={onConfirm}
        type="button"
        loading={confirmLoading}
        disabled={confirmDisabled}
      >
        {confirmText}
      </Button>
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
  titleTrailing,
  description,
  children,
  size = "lg",
  showCloseButton = false,
  closeOnOverlay = false,
  closeOnEscape = false,
  footer,
  cancelText,
  confirmText,
  onConfirm,
  confirmButtonType = "primary",
  confirmLoading = false,
  confirmDisabled = false,
  hideFooter = false,
}) => {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleEscape = (event) => {
      if (closeOnEscape && event.key === "Escape") onClose?.();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose, closeOnEscape]);

  if (!isOpen) return null;

  const presetFooter = !footer && !hideFooter && (onConfirm || onClose);
  const footerContent = footer ?? (presetFooter ? (
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
      className="modal-overlay"
      onClick={closeOnOverlay ? onClose : undefined}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <div
        className={cx("modal", SIZE_CLASS[size] || SIZE_CLASS.lg)}
        onClick={(event) => event.stopPropagation()}
      >
        {(title || showCloseButton) && (
          <header className="modal-header">
            <div className="min-w-0 flex-1">
              {title && (
                <div className="flex items-center justify-between gap-3">
                  <h3 id="modal-title" className="modal-title">
                    {title}
                  </h3>
                  {titleTrailing && <div className="shrink-0">{titleTrailing}</div>}
                </div>
              )}
              {description && <p className="modal-description">{description}</p>}
            </div>
            {showCloseButton && onClose && (
              <button
                onClick={onClose}
                type="button"
                className="modal-close"
                aria-label="Close"
              >
                ×
              </button>
            )}
          </header>
        )}

        <div className="modal-body">{children}</div>

        {footerContent && <footer className="modal-footer">{footerContent}</footer>}
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  title: PropTypes.string,
  titleTrailing: PropTypes.node,
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

export default Modal;
