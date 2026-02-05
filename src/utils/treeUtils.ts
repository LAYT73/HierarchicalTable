import type {
  DataItem,
  TreeNode,
  SortField,
  SortOrder,
  FilterState,
} from "../types";

/**
 * Фильтрует элементы по статусу активности
 * @param items - массив элементов
 * @param filter - состояние фильтра
 * @returns отфильтрованные элементы
 */
export const filterItems = (
  items: DataItem[],
  filter: FilterState,
): DataItem[] => {
  if (filter.isActive === null) {
    return items;
  }

  return items.filter((item) => item.isActive === filter.isActive);
};

/**
 * Парсит строку баланса и возвращает числовое значение
 * @param balance - строка вида "$1,234.56"
 * @returns число для сравнения
 */
export const parseBalance = (balance: string): number => {
  return parseFloat(balance.replace(/[$,]/g, ""));
};

/**
 * Строит дерево из плоского массива данных
 * @param items - плоский массив элементов
 * @returns массив корневых узлов дерева
 */
export const buildTree = (items: DataItem[]): TreeNode[] => {
  const map = new Map<number, TreeNode>();
  const roots: TreeNode[] = [];

  // Создаем узлы дерева
  items.forEach((item) => {
    map.set(item.id, {
      ...item,
      children: [],
      level: 0,
    });
  });

  // Строим иерархию
  items.forEach((item) => {
    const node = map.get(item.id)!;

    if (item.parentId === 0) {
      roots.push(node);
    } else {
      const parent = map.get(item.parentId);
      if (parent) {
        node.level = parent.level + 1;
        parent.children.push(node);
      } else {
        // Если родитель не найден, считаем элемент корневым
        roots.push(node);
      }
    }
  });

  return roots;
};

/**
 * Получает подмножество узлов для текущей страницы
 * @param nodes - узлы дерева
 * @param currentPage - текущая страница (1-based)
 * @param itemsPerPage - количество элементов на странице
 * @returns узлы для текущей страницы и информацию о навигации
 */
export const paginate = (
  nodes: TreeNode[],
  currentPage: number,
  itemsPerPage: number,
): { items: TreeNode[]; totalItems: number; totalPages: number } => {
  const totalItems = nodes.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return {
    items: nodes.slice(startIndex, endIndex),
    totalItems,
    totalPages,
  };
};

/**
 * Сортирует узлы дерева
 * @param nodes - узлы дерева
 * @param field - поле для сортировки
 * @param order - порядок сортировки
 * @returns отсортированные узлы
 */
export const sortTree = (
  nodes: TreeNode[],
  field: SortField | null,
  order: SortOrder,
): TreeNode[] => {
  if (!field) {
    return nodes;
  }

  const compareFunction = (a: TreeNode, b: TreeNode): number => {
    let comparison = 0;

    if (field === "balance") {
      const balanceA = parseBalance(a.balance);
      const balanceB = parseBalance(b.balance);
      comparison = balanceA - balanceB;
    } else if (field === "email") {
      comparison = a.email.localeCompare(b.email);
    }

    return order === "asc" ? comparison : -comparison;
  };

  const sortedNodes = [...nodes].sort(compareFunction);

  // Рекурсивно сортируем детей
  return sortedNodes.map((node) => ({
    ...node,
    children: sortTree(node.children, field, order),
  }));
};

/**
 * Преобразует дерево в плоский список для отображения
 * @param nodes - узлы дерева
 * @param expandedIds - Set с ID раскрытых узлов
 * @returns плоский список узлов для отображения
 */
export const flattenTree = (
  nodes: TreeNode[],
  expandedIds: Set<number>,
): TreeNode[] => {
  const result: TreeNode[] = [];

  const traverse = (nodeList: TreeNode[]) => {
    nodeList.forEach((node) => {
      result.push(node);

      if (expandedIds.has(node.id) && node.children.length > 0) {
        traverse(node.children);
      }
    });
  };

  traverse(nodes);
  return result;
};

/**
 * Проверяет, есть ли у узла дочерние элементы
 * @param node - узел дерева
 * @returns true если есть дети
 */
export const hasChildren = (node: TreeNode): boolean => {
  return node.children.length > 0;
};
