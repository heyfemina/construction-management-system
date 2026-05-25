function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" role="presentation">
      <div className="modal-panel" role="dialog" aria-modal="true">
        <div className="modal-close-row">
          <button
            type="button"
            onClick={onClose}
            className="modal-close-button"
            aria-label="Close dialog"
          >
            x
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

export default Modal;
