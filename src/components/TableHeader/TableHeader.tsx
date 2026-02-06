import { ArrowUp, ArrowDown, ChevronsUpDown } from "lucide-react";
import { FilterDropdown } from "../FilterDropdown/FilterDropdown";
import { type SortField, type SortState, type FilterState } from "../../types";
import styles from "./TableHeader.module.scss";

interface TableHeaderProps {
  sortState: SortState;
  onSortChange: (field: SortField) => void;
  filter: FilterState;
  onFilterChange: (filter: FilterState) => void;
}

export const TableHeader = ({
  sortState,
  onSortChange,
  filter,
  onFilterChange,
}: TableHeaderProps) => {
  const getSortIcon = (field: SortField) => {
    if (sortState.field !== field) {
      return <ChevronsUpDown size={16} className={styles.sortIconInactive} />;
    }
    return sortState.order === "asc" ? (
      <ArrowUp size={16} className={styles.sortIconActive} />
    ) : (
      <ArrowDown size={16} className={styles.sortIconActive} />
    );
  };

  return (
    <thead className={styles.tableHeader}>
      <tr>
        <th className={styles.headerCellId}>
          <div className={styles.headerContent}>ID</div>
        </th>
        <th className={styles.headerCell}>
          <div className={styles.headerContent}>Имя</div>
        </th>
        <th className={styles.headerCell}>
          <button
            className={`${styles.headerContent} ${styles.sortable}`}
            onClick={() => onSortChange("email")}
          >
            Email
            {getSortIcon("email")}
          </button>
        </th>
        <th className={styles.headerCell}>
          <button
            className={`${styles.headerContent} ${styles.sortable}`}
            onClick={() => onSortChange("balance")}
          >
            Баланс
            {getSortIcon("balance")}
          </button>
        </th>
        <th className={styles.headerCellStatus}>
          <div className={styles.statusHeader}>
            <span className={styles.headerContent}>
              Статус
              <FilterDropdown filter={filter} onFilterChange={onFilterChange} />
            </span>
          </div>
        </th>
      </tr>
    </thead>
  );
};
