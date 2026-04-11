import { useState } from 'react';
import type { IShortUrl } from '../types/shorturl';

export type SortKey = 'fullShortUrl' | 'originalUrl' | 'createdAt';
export type SortDir = 'asc' | 'desc';

interface ShortUrlTableProps {
  data: IShortUrl[];
  onDelete: (id: number) => void;
  sortKey: SortKey | null;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function CopyButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`btn btn-secondary btn-sm ${copied ? 'btn-copy-success' : ''}`}
      title="Copy to clipboard"
    >
      {copied ? '✓ Copied' : '⎘ Copy'}
    </button>
  );
}

function SortIndicator({ column, sortKey, sortDir }: { column: SortKey; sortKey: SortKey | null; sortDir: SortDir }) {
  if (sortKey !== column) return <span className="sort-indicator">⇅</span>;
  return <span className="sort-indicator sort-indicator-active">{sortDir === 'asc' ? '↑' : '↓'}</span>;
}

export default function ShortUrlTable({ data, onDelete, sortKey, sortDir, onSort }: ShortUrlTableProps) {
  return (
    <div className="table-responsive">
      <table className="custom-table">
        <thead>
          <tr>
            <th className="th-sortable" onClick={() => onSort('fullShortUrl')}>
              Short Link <SortIndicator column="fullShortUrl" sortKey={sortKey} sortDir={sortDir} />
            </th>
            <th className="th-sortable" onClick={() => onSort('originalUrl')}>
              Original URL <SortIndicator column="originalUrl" sortKey={sortKey} sortDir={sortDir} />
            </th>
            <th className="th-sortable" onClick={() => onSort('createdAt')}>
              Created <SortIndicator column="createdAt" sortKey={sortKey} sortDir={sortDir} />
            </th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((link) => (
            <tr key={link.id}>
              <td>
                <a
                  href={link.fullShortUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="short-link"
                >
                  {link.fullShortUrl}
                  <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>↗</span>
                </a>
              </td>
              <td>
                <div className="original-url" title={link.originalUrl}>
                  {link.originalUrl}
                </div>
              </td>
              <td>
                <span className="date-cell">
                  {link.createdAt ? formatDate(link.createdAt) : '—'}
                </span>
              </td>
              <td>
                <div className="actions-cell">
                  <CopyButton url={link.fullShortUrl} />
                  <button
                    onClick={() => onDelete(link.id)}
                    className="btn btn-danger btn-sm"
                    title="Delete link"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}