function Pagination({
  currentPage,
  totalPages,
  onNext,
  onPrevious,
  totalItems = 0,
  startIndex = 0,
  endIndex = 0,
}) {
  if (totalItems <= 0 || totalPages <= 1) {
    return null;
  }

  return (
    <div className="pagination-bar">
      <span className="pagination-summary">
        Showing {startIndex + 1}-{endIndex} of {totalItems}
      </span>

      <button
        onClick={onPrevious}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      <span className="pagination-page">
        {currentPage} / {totalPages}
      </span>

      <button
        onClick={onNext}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
