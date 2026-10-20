import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, X, MapPin, AlertCircle, ChevronLeft, ChevronRight, List, Grid, Plus } from 'react-feather';
import { useGetSitesQuery, useCreateSiteMutation } from '../../../api/sitesApiSlice';

const SEARCH_KEYS = ['customer', 'building', 'equipName', 'equipType', 'vendor', 'siteAddress'];
const PER_PAGE = 16;

function getPageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = new Set([1, total, current]);
  if (current > 1) pages.add(current - 1);
  if (current < total) pages.add(current + 1);

  const sorted = [...pages].sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push('...');
    result.push(sorted[i]);
  }
  return result;
}

export default function Sites() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('q') ?? '';
  const setSearch = (val) => setSearchParams(val ? { q: val } : {}, { replace: true });
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState(
    () => localStorage.getItem('sitesView') ?? 'list'
  );

  const setView = (mode) => {
    setViewMode(mode);
    localStorage.setItem('sitesView', mode);
  };
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ customer: '', building: '', siteAddress: '' });
  const [formError, setFormError] = useState('');
  const [createSite, { isLoading: creating }] = useCreateSiteMutation();

  const openModal = () => { setForm({ customer: '', building: '', siteAddress: '' }); setFormError(''); setModalOpen(true); };
  const closeModal = () => setModalOpen(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.customer.trim()) { setFormError('Customer name is required'); return; }
    try {
      const site = await createSite(form).unwrap();
      closeModal();
      navigate(`/dashboard/sites/${site._id}`);
    } catch {
      setFormError('Failed to create site');
    }
  };

  const { data: sites = [], isLoading, isError } = useGetSitesQuery();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return sites;
    return sites.filter((site) =>
      SEARCH_KEYS.some((key) => site[key]?.toLowerCase().includes(q))
    );
  }, [sites, search]);

  useEffect(() => { setPage(1); }, [search]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const btnBase = 'p-1.5 rounded-md transition-colors';
  const btnActive = 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm';
  const btnInactive = 'text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300';

  return (
    <main className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-1">Sites</h1>
          <p className="text-neutral-500 text-sm">
            {isLoading ? 'Loading…' : `${sites.length} site${sites.length !== 1 ? 's' : ''} total`}
          </p>
        </div>
      </div>

      {/* Search + view toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 flex-1 min-w-0 mr-3">
          <div className="relative max-w-sm w-full">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by customer, building, equipment…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg pl-9 pr-9 py-2 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-600 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600 transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
                aria-label="Clear search"
              >
                <X size={13} />
              </button>
            )}
          </div>
          <button
            onClick={openModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-900 dark:bg-white text-white dark:text-black hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors shrink-0"
          >
            <Plus size={13} /> New Site
          </button>
        </div>

        <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 rounded-lg p-0.5 ml-3 shrink-0">
          <button
            onClick={() => setView('list')}
            className={`${btnBase} ${viewMode === 'list' ? btnActive : btnInactive}`}
            aria-label="List view"
          >
            <List size={15} />
          </button>
          <button
            onClick={() => setView('grid')}
            className={`${btnBase} ${viewMode === 'grid' ? btnActive : btnInactive}`}
            aria-label="Grid view"
          >
            <Grid size={15} />
          </button>
        </div>
      </div>

      {/* Content */}
      {isError ? (
        <div className="flex flex-col items-center justify-center gap-2 py-16">
          <AlertCircle size={18} className="text-red-400" />
          <p className="text-neutral-500 text-sm">Failed to load sites</p>
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center py-16">
          <p className="text-neutral-400 dark:text-neutral-600 text-sm">Loading sites…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-16">
          <MapPin size={18} className="text-neutral-400 dark:text-neutral-600" />
          <p className="text-neutral-400 dark:text-neutral-600 text-sm">
            {search ? 'No sites match your search' : 'No sites yet'}
          </p>
        </div>
      ) : (
        <>
          {viewMode === 'list' ? (
            <div className="flex flex-col gap-2">
              {paginated.map((site) => (
                <div
                  key={site._id}
                  onClick={() => navigate(`/dashboard/sites/${site._id}`)}
                  className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-5 py-4 flex items-center justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors cursor-pointer"
                >
                  <div className="flex flex-col gap-0.5 min-w-0 mr-6">
                    <span className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
                      {site.customer || <span className="font-normal text-neutral-400 dark:text-neutral-600">Unnamed</span>}
                    </span>
                    <span className="text-xs text-neutral-500 truncate">
                      {site.building || <span className="text-neutral-300 dark:text-neutral-700">—</span>}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {site.equipName && (
                      <span className="text-sm text-neutral-500 dark:text-neutral-400 max-w-48 truncate">
                        {site.equipName}
                      </span>
                    )}
                    {site.equipType && (
                      <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 whitespace-nowrap">
                        {site.equipType}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {paginated.map((site) => (
                <div
                  key={site._id}
                  onClick={() => navigate(`/dashboard/sites/${site._id}`)}
                  className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 flex flex-col gap-3 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white leading-snug line-clamp-2">
                      {site.customer || <span className="font-normal text-neutral-400 dark:text-neutral-600">Unnamed</span>}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1 truncate">
                      {site.building || <span className="text-neutral-300 dark:text-neutral-700">—</span>}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {site.equipName && (
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                        {site.equipName}
                      </p>
                    )}
                    {site.equipType && (
                      <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 w-fit">
                        {site.equipType}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-5">
              <p className="text-xs text-neutral-400 dark:text-neutral-600">
                {filtered.length} result{filtered.length !== 1 ? 's' : ''} · page {page} of {totalPages}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={15} />
                </button>

                {getPageNumbers(page, totalPages).map((p, i) =>
                  p === '...' ? (
                    <span key={`ellipsis-${i}`} className="w-8 text-center text-xs text-neutral-400 dark:text-neutral-600">
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                        p === page
                          ? 'bg-neutral-900 dark:bg-white text-white dark:text-black'
                          : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-neutral-100 dark:border-neutral-800">
              <h2 className="text-base font-semibold text-neutral-900 dark:text-white">New Site</h2>
              <button onClick={closeModal} className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 flex flex-col gap-4">
              {formError && (
                <p className="text-xs text-red-500 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/50 rounded-lg px-3 py-2">
                  {formError}
                </p>
              )}
              {[
                { key: 'customer', label: 'Customer Name', placeholder: 'Acme Corp' },
                { key: 'building', label: 'Building', placeholder: 'Main Office' },
                { key: 'siteAddress', label: 'Site Address', placeholder: '123 Main St, City, State' },
              ].map(({ key, label, placeholder }) => (
                <div key={key} className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    {label}{key === 'customer' && <span className="text-red-400 ml-0.5">*</span>}
                  </label>
                  <input
                    type="text"
                    value={form[key]}
                    onChange={(e) => { setForm((p) => ({ ...p, [key]: e.target.value })); setFormError(''); }}
                    placeholder={placeholder}
                    className="bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-600 focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-colors"
                  />
                </div>
              ))}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={closeModal} className="px-4 py-2 rounded-lg text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={creating} className="px-4 py-2 rounded-lg text-sm font-medium bg-neutral-900 dark:bg-white text-white dark:text-black hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors disabled:opacity-50">
                  {creating ? 'Creating…' : 'Create Site'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
