import type { SortableHeaderColumnProps, SortKey, SortDir } from "./types";

function SortIndicator({ column, sortKey, sortDir }: { column: SortKey; sortKey: SortKey | null; sortDir: SortDir }) {
  if (sortKey !== column) return <span className="sort-indicator">⇅</span>;
  return <span className="sort-indicator sort-indicator-active">{sortDir === 'asc' ? '↑' : '↓'}</span>;
}

export default function SortableHeaderColumn({
  label,
  columnKey,
  sortKey,
  sortDir,
  onSort,
}: SortableHeaderColumnProps) {
  return (
    <th className="th-sortable" onClick={() => onSort(columnKey)}>
      {label} <SortIndicator column={columnKey} sortKey={sortKey} sortDir={sortDir} />
    </th>
  );
}
