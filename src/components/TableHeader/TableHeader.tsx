import { ArrowUp, ArrowDown, ChevronsUpDown } from "lucide-react";
import { type SortField, type SortState } from "../../types";
import styles from "./TableHeader.module.scss";

interface TableHeaderProps {
  sortState: SortState;
  onSortChange: (field: SortField) => void;
}

export const TableHeader = ({ sortState, onSortChange }: TableHeaderProps) => {
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
        <th className={styles.headerCell}>
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
        <th className={styles.headerCell}>
          <div className={styles.headerContent}>Статус</div>
        </th>
      </tr>
    </thead>
  );
};
