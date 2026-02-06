import { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";
import { type FilterState } from "../../types";
import styles from "./FilterDropdown.module.scss";

interface FilterDropdownProps {
  filter: FilterState;
  onFilterChange: (filter: FilterState) => void;
}

export const FilterDropdown = ({
  filter,
  onFilterChange,
}: FilterDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Закрыть меню при клике вне
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  const handleFilterChange = (value: boolean | null) => {
    onFilterChange({ isActive: value });
    setIsOpen(false);
  };

  const handleClearFilter = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFilterChange({ isActive: null });
  };

  const getFilterLabel = () => {
    if (filter.isActive === null) return "Все";
    if (filter.isActive === true) return "Активные";
    return "Неактивные";
  };

  const isFiltered = filter.isActive !== null;

  return (
    <div className={styles.filterDropdown} ref={dropdownRef}>
      <button
        className={`${styles.filterButton} ${isFiltered ? styles.filtered : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={styles.label}>По статусу</span>
        <span className={styles.value}>{getFilterLabel()}</span>
        <ChevronDown
          size={18}
          className={`${styles.icon} ${isOpen ? styles.iconOpen : ""}`}
        />
      </button>

      {isFiltered && (
        <button
          className={styles.clearButton}
          onClick={handleClearFilter}
          title="Сбросить фильтр"
          aria-label="Clear filter"
        >
          <X size={16} />
        </button>
      )}

      {isOpen && (
        <div className={styles.dropdown}>
          <button
            className={`${styles.option} ${
              filter.isActive === null ? styles.selected : ""
            }`}
            onClick={() => handleFilterChange(null)}
          >
            Все
          </button>
          <button
            className={`${styles.option} ${
              filter.isActive === true ? styles.selected : ""
            }`}
            onClick={() => handleFilterChange(true)}
          >
            Активные
          </button>
          <button
            className={`${styles.option} ${
              filter.isActive === false ? styles.selected : ""
            }`}
            onClick={() => handleFilterChange(false)}
          >
            Неактивные
          </button>
        </div>
      )}
    </div>
  );
};
