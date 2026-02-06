import { useState, useMemo, useCallback } from "react";
import { TableHeader } from "../TableHeader/TableHeader";
import { TableRow } from "../TableRow/TableRow";
import { Pagination } from "../Pagination/Pagination";
import {
  buildTree,
  filterItems,
  sortTree,
  flattenTree,
} from "../../utils/treeUtils";
import type {
  DataItem,
  FlattenedNode,
  FilterState,
  SortState,
  SortField,
} from "../../types";
import styles from "./Table.module.scss";

interface TableProps {
  data: DataItem[];
  loading?: boolean;
  itemsPerPage?: number;
}

export const Table = ({
  data,
  loading = false,
  itemsPerPage = 10,
}: TableProps) => {
  // Set используется для O(1) проверки раскрытых узлов
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [filter, setFilter] = useState<FilterState>({ isActive: null });
  const [sortState, setSortState] = useState<SortState>({
    field: null,
    order: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Фильтруем исходные данные по статусу активности
  const filteredData = useMemo(() => {
    return filterItems(data, filter);
  }, [data, filter]);

  // Построение и обработка дерева
  const processedTree = useMemo(() => {
    let tree = buildTree(filteredData);
    tree = sortTree(tree, sortState.field, sortState.order);
    return tree;
  }, [filteredData, sortState]);

  // Пагинация применяется только к корневым элементам
  const paginationResult = useMemo(() => {
    const totalItems = processedTree.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const paginatedRoots = processedTree.slice(startIndex, endIndex);

    return {
      roots: paginatedRoots,
      totalItems,
      totalPages,
    };
  }, [processedTree, currentPage, itemsPerPage]);

  // Преобразование только пагинированных корневых элементов в плоский список для отображения
  const flattenedNodes = useMemo(() => {
    return flattenTree(paginationResult.roots, expandedIds);
  }, [paginationResult.roots, expandedIds]);

  // Обработчик переключения раскрытия строки
  const handleToggle = useCallback((id: number) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  // Обработчик изменения сортировки
  const handleSortChange = useCallback((field: SortField) => {
    setSortState((prev) => {
      if (prev.field === field) {
        // Переключаем порядок сортировки
        return {
          field,
          order: prev.order === "asc" ? "desc" : "asc",
        };
      }
      // Новое поле - сортировка по возрастанию
      return {
        field,
        order: "asc",
      };
    });
  }, []);

  // Обработчик изменения фильтра
  const handleFilterChange = useCallback((newFilter: FilterState) => {
    setFilter(newFilter);
    // Сбрасываем раскрытые строки и возвращаемся на первую страницу
    setExpandedIds(new Set());
    setCurrentPage(1);
  }, []);

  // Обработчик изменения страницы
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner} />
        <div className={styles.loadingText}>Загрузка данных...</div>
      </div>
    );
  }

  if (flattenedNodes.length === 0) {
    return (
      <>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📭</div>
          <div className={styles.emptyText}>Нет данных для отображения</div>
          <div className={styles.emptySubtext}>
            Попробуйте изменить параметры фильтра
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <TableHeader
            sortState={sortState}
            onSortChange={handleSortChange}
            filter={filter}
            onFilterChange={handleFilterChange}
          />
          <tbody>
            {flattenedNodes.map((item: FlattenedNode) => (
              <TableRow
                key={item.node.id}
                node={item.node}
                isExpanded={expandedIds.has(item.node.id)}
                isStriped={item.rootIndex % 2 === 1}
                onToggle={handleToggle}
              />
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={paginationResult.totalPages}
        totalItems={paginationResult.totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      />
    </>
  );
};
