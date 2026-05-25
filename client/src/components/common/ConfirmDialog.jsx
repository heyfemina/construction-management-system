function ConfirmDialog({
  title = "Confirm action",
  message = "Are you sure you want to continue?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  onConfirm,
  onCancel,
}) {
  return (
    <div className={`dialog-card dialog-card-${variant}`}>
      <h2>{title}</h2>

      <p>{message}</p>

      <div className="dialog-actions">
        <button
          onClick={onConfirm}
          className="dialog-confirm-button"
        >
          {confirmText}
        </button>

        <button
          onClick={onCancel}
          className="dialog-cancel-button"
        >
          {cancelText}
        </button>
      </div>
    </div>
  );
}

export default ConfirmDialog;
