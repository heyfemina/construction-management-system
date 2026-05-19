function ConfirmDialog({
  title,
  message,
  onConfirm,
  onCancel,
}) {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        padding: "30px",
        borderRadius: "10px",
      }}
    >
      <h2
        style={{
          marginBottom: "15px",
        }}
      >
        {title}
      </h2>

      <p
        style={{
          marginBottom: "20px",
        }}
      >
        {message}
      </p>

      <div
        style={{
          display: "flex",
          gap: "10px",
        }}
      >
        <button
          onClick={onConfirm}
          style={{
            padding: "10px 20px",
            backgroundColor: "#dc2626",
            color: "#ffffff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Confirm
        </button>

        <button
          onClick={onCancel}
          style={{
            padding: "10px 20px",
            backgroundColor: "#6b7280",
            color: "#ffffff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default ConfirmDialog;