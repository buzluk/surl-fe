import type { IShortUrl } from "../../types/shorturl";

export type SortKey = 'fullShortUrl' | 'originalUrl' | 'createdAt';

export type SortDir = 'asc' | 'desc';

export interface SortableHeaderColumnProps {
  label: string;
  columnKey: SortKey;
  sortKey: SortKey | null;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
}

export interface ShortUrlTableProps {
  data: IShortUrl[];
  onDelete: (id: number) => void;
  sortKey: SortKey | null;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
}

export interface ShortUrlTableRowProps {
  link: IShortUrl;
  onDelete: (id: number) => void;
}
