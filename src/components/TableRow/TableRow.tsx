import { ChevronRight, ChevronDown } from "lucide-react";
import { type TreeNode } from "../../types";
import { hasChildren } from "../../utils/treeUtils";
import styles from "./TableRow.module.scss";

interface TableRowProps {
  node: TreeNode;
  isExpanded: boolean;
  onToggle: (id: number) => void;
}

export const TableRow = ({ node, isExpanded, onToggle }: TableRowProps) => {
  const nodeHasChildren = hasChildren(node);
  const indentSize = node.level * 2;

  return (
    <tr className={styles.tableRow}>
      <td className={styles.tableCell}>
        <div
          className={styles.cellContent}
          style={{ paddingLeft: `${indentSize}rem` }}
        >
          {nodeHasChildren && (
            <button
              className={styles.expandButton}
              onClick={() => onToggle(node.id)}
              aria-label={isExpanded ? "Свернуть" : "Развернуть"}
            >
              {isExpanded ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronRight size={18} />
              )}
            </button>
          )}
          {!nodeHasChildren && <span className={styles.noChildrenSpace} />}
          <span>{node.id}</span>
        </div>
      </td>
      <td className={styles.tableCell}>
        <span className={styles.name}>{node.name}</span>
      </td>
      <td className={styles.tableCell}>
        <span className={styles.email}>{node.email}</span>
      </td>
      <td className={styles.tableCell}>
        <span className={styles.balance}>{node.balance}</span>
      </td>
      <td className={styles.tableCell}>
        <span
          className={`${styles.status} ${
            node.isActive ? styles.statusActive : styles.statusInactive
          }`}
        >
          {node.isActive ? "Активен" : "Неактивен"}
        </span>
      </td>
    </tr>
  );
};
