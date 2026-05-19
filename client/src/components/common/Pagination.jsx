function Pagination({
  currentPage,
  totalPages,
  onNext,
  onPrevious,
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "15px",
        marginTop: "20px",
      }}
    >
      <button
        onClick={onPrevious}
        disabled={currentPage === 1}
        style={{
          padding: "10px 15px",
          border: "none",
          backgroundColor: "#2563eb",
          color: "#ffffff",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Previous
      </button>

      <span
        style={{
          fontWeight: "600",
          alignSelf: "center",
        }}
      >
        {currentPage} / {totalPages}
      </span>

      <button
        onClick={onNext}
        disabled={currentPage === totalPages}
        style={{
          padding: "10px 15px",
          border: "none",
          backgroundColor: "#2563eb",
          color: "#ffffff",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;