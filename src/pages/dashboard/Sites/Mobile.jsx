import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, X, MapPin, AlertCircle, ChevronLeft, ChevronRight, Plus } from 'react-feather';
import { useGetSitesQuery, useCreateSiteMutation } from '../../../api/sitesApiSlice';

const SEARCH_KEYS = ['customer', 'building', 'equipName', 'equipType', 'vendor', 'siteAddress'];
const PER_PAGE = 12;

export default function SitesMobile() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('q') ?? '';
  const setSearch = (val) => setSearchParams(val ? { q: val } : {}, { replace: true });
  const [page, setPage] = useState(1);

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

  return (
    <main className="p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 dark:text-white mb-0.5">Sites</h1>
          <p className="text-neutral-500 text-sm">
            {isLoading ? 'Loading…' : `${sites.length} site${sites.length !== 1 ? 's' : ''} total`}
          </p>
        </div>
        <button
          onClick={openModal}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-neutral-900 dark:bg-white text-white dark:text-black hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors shrink-0"
        >
          <Plus size={13} /> New Site
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search sites…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl pl-9 pr-9 py-2.5 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-600 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600 transition-colors"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Content */}
      {isError ? (
        <div className="flex flex-col items-center justify-center gap-2 py-12">
          <AlertCircle size={18} className="text-red-400" />
          <p className="text-neutral-500 text-sm">Failed to load sites</p>
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-neutral-400 text-sm">Loading sites…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-12">
          <MapPin size={18} className="text-neutral-400 dark:text-neutral-600" />
          <p className="text-neutral-400 text-sm">{search ? 'No sites match your search' : 'No sites yet'}</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            {paginated.map((site) => (
              <div
                key={site._id}
                onClick={() => navigate(`/dashboard/sites/${site._id}`)}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3.5 flex items-center justify-between active:bg-neutral-50 dark:active:bg-neutral-800 cursor-pointer"
              >
                <div className="flex flex-col gap-0.5 min-w-0 mr-4">
                  <span className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
                    {site.customer || <span className="font-normal text-neutral-400">Unnamed</span>}
                  </span>
                  <span className="text-xs text-neutral-500 truncate">
                    {site.building || <span className="text-neutral-300 dark:text-neutral-700">—</span>}
                  </span>
                </div>
                {site.equipType && (
                  <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 shrink-0 whitespace-nowrap">
                    {site.equipType}
                  </span>
                )}
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-neutral-500 border border-neutral-200 dark:border-neutral-800 disabled:opacity-30"
              >
                <ChevronLeft size={14} /> Prev
              </button>
              <span className="text-xs text-neutral-400">{page} / {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-neutral-500 border border-neutral-200 dark:border-neutral-800 disabled:opacity-30"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          )}
        </>
      )}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 dark:bg-black/60">
          <div className="bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 rounded-t-2xl shadow-xl w-full">
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-neutral-100 dark:border-neutral-800">
              <h2 className="text-base font-semibold text-neutral-900 dark:text-white">New Site</h2>
              <button onClick={closeModal} className="p-1.5 rounded-lg text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-5 flex flex-col gap-4">
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
                    className="bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl px-4 py-3 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-600 focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-colors"
                  />
                </div>
              ))}

              <div className="flex items-center gap-2 pt-1 pb-2">
                <button type="button" onClick={closeModal} className="flex-1 py-2.5 rounded-xl text-sm text-neutral-500 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={creating} className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-neutral-900 dark:bg-white text-white dark:text-black disabled:opacity-50 transition-colors">
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
