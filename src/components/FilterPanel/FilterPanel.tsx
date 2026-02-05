import { type FilterState } from "../../types";
import styles from "./FilterPanel.module.scss";

interface FilterPanelProps {
  filter: FilterState;
  onFilterChange: (filter: FilterState) => void;
}

export const FilterPanel = ({ filter, onFilterChange }: FilterPanelProps) => {
  const handleFilterChange = (value: boolean | null) => {
    onFilterChange({ isActive: value });
  };

  return (
    <div className={styles.filterPanel}>
      <div className={styles.filterGroup}>
        <span className={styles.filterLabel}>Статус:</span>
        <div className={styles.filterButtons}>
          <button
            className={`${styles.filterButton} ${
              filter.isActive === null ? styles.active : ""
            }`}
            onClick={() => handleFilterChange(null)}
          >
            Все
          </button>
          <button
            className={`${styles.filterButton} ${
              filter.isActive === true ? styles.active : ""
            }`}
            onClick={() => handleFilterChange(true)}
          >
            Активные
          </button>
          <button
            className={`${styles.filterButton} ${
              filter.isActive === false ? styles.active : ""
            }`}
            onClick={() => handleFilterChange(false)}
          >
            Неактивные
          </button>
        </div>
      </div>
    </div>
  );
};
