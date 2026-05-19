function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "30px",
          borderRadius: "12px",
          width: "500px",
          maxWidth: "90%",
        }}
      >
        <div style={{ textAlign: "right", marginBottom: "15px" }}>
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "none",
              fontSize: "20px",
              cursor: "pointer",
            }}
          >
            ✖
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

export default Modal;