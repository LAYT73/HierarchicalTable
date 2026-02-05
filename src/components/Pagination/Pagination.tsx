import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./Pagination.module.scss";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
  totalItems?: number;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
}: PaginationProps) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    onPageChange(page);
  };

  const getPageNumbers = () => {
    const delta = 2;
    const left = Math.max(1, currentPage - delta);
    const right = Math.min(totalPages, currentPage + delta);
    const pages = [];

    if (left > 1) {
      pages.push(1);
      if (left > 2) {
        pages.push("...");
      }
    }

    for (let i = left; i <= right; i++) {
      pages.push(i);
    }

    if (right < totalPages) {
      if (right < totalPages - 1) {
        pages.push("...");
      }
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = getPageNumbers();
  const startItem =
    totalItems && itemsPerPage ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem =
    totalItems && itemsPerPage
      ? Math.min(currentPage * itemsPerPage, totalItems)
      : 0;

  return (
    <div className={styles.pagination}>
      <div className={styles.paginationLeft}>
        <span className={styles.info}>
          {totalItems && itemsPerPage
            ? `${startItem}-${endItem} из ${totalItems}`
            : ""}
        </span>
      </div>

      <div className={styles.paginationCenter}>
        <button
          className={styles.button}
          onClick={handlePrevious}
          disabled={currentPage === 1}
          aria-label="Предыдущая страница"
        >
          <ChevronLeft size={18} />
        </button>

        <div className={styles.pageNumbers}>
          {pageNumbers.map((page, index) =>
            typeof page === "number" ? (
              <button
                key={index}
                className={`${styles.pageButton} ${
                  page === currentPage ? styles.active : ""
                }`}
                onClick={() => handlePageClick(page)}
              >
                {page}
              </button>
            ) : (
              <span key={index} className={styles.ellipsis}>
                {page}
              </span>
            ),
          )}
        </div>

        <button
          className={styles.button}
          onClick={handleNext}
          disabled={currentPage === totalPages}
          aria-label="Следующая страница"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className={styles.paginationRight}>
        <span className={styles.info}>
          Страница {currentPage}/{totalPages}
        </span>
      </div>
    </div>
  );
};
