import React, { useEffect, useState, useCallback } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useForm } from '../hooks/useForm';
import { shortUrlService } from '../services/shortUrlService';
import { type IShortUrl } from '../types/shorturl';
import ShortUrlTable, { type SortKey, type SortDir } from '../components/ShortUrlTable';
import ConfirmModal from '../components/ConfirmModal';
import ToastContainer from '../components/ToastContainer';
import { useToast } from '../hooks/useToast';

const PAGE_SIZE = 10;

/* ── Skeleton rows ──────────────────────────────────── */
function SkeletonRows() {
  return (
    <div className="table-shell">
      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Short Link</th>
              <th>Original URL</th>
              <th>Created</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 4 }).map((_, i) => (
              <tr key={i}>
                <td><div className="skeleton" style={{ height: 14, width: 140 }} /></td>
                <td><div className="skeleton" style={{ height: 14, width: 220 }} /></td>
                <td><div className="skeleton" style={{ height: 14, width: 80 }} /></td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <div className="skeleton" style={{ height: 28, width: 64 }} />
                    <div className="skeleton" style={{ height: 28, width: 56 }} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Main Component ─────────────────────────────────── */
const DashboardPage: React.FC = () => {
  const [shortUrls, setShortUrls] = useState<IShortUrl[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  /* ── Pagination state ── */
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  /* ── Sort state ── */
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const { formData, handleChange, resetForm } = useForm({ originalUrl: '' });
  const { toasts, toast, dismiss } = useToast();

  const buildSortParam = useCallback((key: SortKey | null, dir: SortDir): string | undefined => {
    return key ? `${key},${dir}` : undefined;
  }, []);

  const fetchShortUrls = useCallback(async (page = 0, sKey = sortKey, sDir = sortDir) => {
    setLoading(true);
    try {
      const result = await shortUrlService.getAll(page, PAGE_SIZE, buildSortParam(sKey, sDir));
      setShortUrls(result.content ?? []);
      setCurrentPage(result.currentPage);
      setTotalPages(result.totalPages);
      setTotalElements(result.totalElements);
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to load your links.', 'error');
    } finally {
      setLoading(false);
    }
  }, [sortKey, sortDir, buildSortParam]);

  useEffect(() => {
    fetchShortUrls(0);
  }, [fetchShortUrls]);

  const handlePageChange = (page: number) => {
    if (page < 0 || page >= totalPages || page === currentPage) return;
    fetchShortUrls(page);
  };

  const handleSort = (key: SortKey) => {
    const newDir: SortDir = sortKey === key && sortDir === 'asc' ? 'desc' : 'asc';
    setSortKey(key);
    setSortDir(newDir);
    fetchShortUrls(0, key, newDir);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.originalUrl) return;
    setCreating(true);
    try {
      await shortUrlService.create(formData.originalUrl);
      resetForm();
      toast('Short link created successfully!', 'success');
      fetchShortUrls(0);
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Could not create the link. Please try again.', 'error');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteTarget === null) return;
    setDeleting(true);
    try {
      await shortUrlService.delete(deleteTarget);
      toast('Link deleted.', 'success');
      fetchShortUrls(currentPage);
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Delete failed. Please try again.', 'error');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const filtered = search.trim()
    ? shortUrls.filter(
        (l) =>
          l.originalUrl.toLowerCase().includes(search.toLowerCase()) ||
          l.fullShortUrl.toLowerCase().includes(search.toLowerCase())
      )
    : shortUrls;

  return (
    <MainLayout>
      <div className="dashboard-wrapper">

        {/* ── Stats Row ── */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon stat-icon-primary">🔗</div>
            <div>
              <div className="stat-value">{totalElements}</div>
              <div className="stat-label">Total Links</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon stat-icon-success">✓</div>
            <div>
              <div className="stat-value">Active</div>
              <div className="stat-label">Status</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon stat-icon-accent">⚡</div>
            <div>
              <div className="stat-value">Instant</div>
              <div className="stat-label">Redirect</div>
            </div>
          </div>
        </div>

        {/* ── Create Card ── */}
        <div className="create-card">
          <h2 className="section-heading">
            <span>✦</span> Create Short Link
          </h2>
          <form onSubmit={handleCreate} className="create-form" id="create-link-form">
            <input
              id="original-url-input"
              type="url"
              name="originalUrl"
              placeholder="Paste your long URL here…"
              className="input"
              value={formData.originalUrl}
              onChange={handleChange}
              required
              disabled={creating}
              autoComplete="off"
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={creating}
              id="shorten-btn"
            >
              {creating ? (
                <>
                  <span className="spinner" />
                  Shortening…
                </>
              ) : (
                '⚡ Shorten'
              )}
            </button>
          </form>
        </div>

        {/* ── Links Section ── */}
        <section className="links-section" id="links-section">
          <div className="section-header">
            <h3 className="section-title">
              My Links
              <span className="count-badge">{totalElements}</span>
            </h3>

            {shortUrls.length > 0 && (
              <div className="search-box">
                <span className="search-icon">🔍</span>
                <input
                  id="search-links-input"
                  type="text"
                  placeholder="Search links…"
                  className="input search-input"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            )}
          </div>

          {loading ? (
            <SkeletonRows />
          ) : filtered.length === 0 ? (
            <div className="empty-state" id="empty-state">
              {search ? (
                <>
                  <span className="empty-icon">🔍</span>
                  <p className="empty-title">No results found</p>
                  <p className="empty-sub">Try a different search term.</p>
                </>
              ) : (
                <>
                  <span className="empty-icon">🔗</span>
                  <p className="empty-title">No links yet</p>
                  <p className="empty-sub">
                    Paste a URL above and hit <strong>Shorten</strong> to get started.
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="table-shell">
              <ShortUrlTable
                data={filtered}
                onDelete={(id) => setDeleteTarget(id)}
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={handleSort}
              />

              {/* ── Pagination ── */}
              {totalPages > 1 && (
                <div className="pagination" id="pagination">
                  <button
                    className="pagination-btn"
                    disabled={currentPage === 0}
                    onClick={() => handlePageChange(currentPage - 1)}
                    aria-label="Previous page"
                  >
                    ‹ Prev
                  </button>

                  <div className="pagination-pages">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i}
                        className={`pagination-btn ${i === currentPage ? 'pagination-btn-active' : ''}`}
                        onClick={() => handlePageChange(i)}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    className="pagination-btn"
                    disabled={currentPage === totalPages - 1}
                    onClick={() => handlePageChange(currentPage + 1)}
                    aria-label="Next page"
                  >
                    Next ›
                  </button>
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      {/* ── Delete Confirmation Modal ── */}
      {deleteTarget !== null && (
        <ConfirmModal
          title="Delete this link?"
          message="This action is permanent. The short link will stop working immediately."
          confirmLabel="Delete"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}

      {/* ── Toasts ── */}
      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </MainLayout>
  );
};

export default DashboardPage;