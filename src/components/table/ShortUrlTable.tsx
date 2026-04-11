import type { ShortUrlTableProps } from "./types";
import SortableHeaderColumn from "./SortableHeaderColumn";

import ShortUrlTableRow from "./ShortUrlTableRow";

export default function ShortUrlTable({
  data,
  onDelete,
  sortKey,
  sortDir,
  onSort,
}: ShortUrlTableProps) {
  return (
    <div className="table-responsive">
      <table className="custom-table">
        <thead>
          <tr>
            <SortableHeaderColumn
              label="Short Link"
              columnKey="fullShortUrl"
              sortKey={sortKey}
              sortDir={sortDir}
              onSort={onSort}
            />
            <SortableHeaderColumn
              label="Original URL"
              columnKey="originalUrl"
              sortKey={sortKey}
              sortDir={sortDir}
              onSort={onSort}
            />
            <SortableHeaderColumn
              label="Created"
              columnKey="createdAt"
              sortKey={sortKey}
              sortDir={sortDir}
              onSort={onSort}
            />
            <th style={{ textAlign: "right" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((link) => (
            <ShortUrlTableRow key={link.id} link={link} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
