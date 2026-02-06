import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
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

  const isFiltered = filter.isActive !== null;

  return (
    <div className={styles.filterDropdown} ref={dropdownRef}>
      <button
        className={`${styles.inlineButton} ${isFiltered ? styles.inlineFiltered : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Фильтр по статусу"
      >
        <ChevronDown
          size={16}
          className={`${styles.inlineIcon} ${isOpen ? styles.inlineIconOpen : ""}`}
        />
        {isFiltered && <span className={styles.filterIndicator} />}
      </button>

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
