import { formatDate } from '../../utils/dateUtils';
import ShortLinkActionButton from './ShortLinkActionButton';
import type { ShortUrlTableRowProps } from './types';

export default function ShortUrlTableRow({ link, onDelete }: ShortUrlTableRowProps) {
  return (
    <tr>
      <td>
        <a href={link.fullShortUrl} target="_blank" rel="noreferrer" className="short-link">
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
        <ShortLinkActionButton url={link.fullShortUrl} onDelete={() => onDelete(link.id)} />
      </td>
    </tr>
  );
}
