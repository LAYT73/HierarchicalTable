export interface DataItem {
  id: number;
  parentId: number;
  isActive: boolean;
  balance: string;
  name: string;
  email: string;
}

export interface TreeNode extends DataItem {
  children: TreeNode[];
  level: number;
}

export interface FlattenedNode {
  node: TreeNode;
  rootIndex: number;
}

export type SortField = "balance" | "email";
export type SortOrder = "asc" | "desc";

export interface FilterState {
  isActive: boolean | null; // null = показать все
}

export interface SortState {
  field: SortField | null;
  order: SortOrder;
}

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
}
