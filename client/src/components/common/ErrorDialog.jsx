import ConfirmDialog from "./ConfirmDialog";
import Modal from "./Modal";

function ErrorDialog({
  isOpen,
  title = "Something went wrong",
  message = "Please check the details and try again.",
  onClose,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ConfirmDialog
        title={title}
        message={message}
        confirmText="OK"
        cancelText="Close"
        variant="error"
        onConfirm={onClose}
        onCancel={onClose}
      />
    </Modal>
  );
}

export default ErrorDialog;
