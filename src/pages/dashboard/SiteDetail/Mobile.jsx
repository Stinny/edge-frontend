import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Layout, Shield, GitMerge, FileText, ChevronLeft,
  AlertCircle, Edit2, Check, X, ExternalLink, Key, Copy, Plus, Trash2,
} from 'react-feather';
import { useGetSiteQuery, useUpdateSiteMutation } from '../../../api/sitesApiSlice';
import { useGetNotesForSiteQuery, useCreateNoteMutation, useUpdateNoteMutation, useDeleteNoteMutation } from '../../../api/notesApiSlice';
import JaceLicenseModal from '../../../components/JaceLicenseModal';

const TABS = [
  {
    key: 'overview',
    label: 'Overview',
    icon: Layout,
    sections: [
      {
        title: 'Contact',
        fields: [
          { key: 'siteAddress', label: 'Site Address' },
          { key: 'siteContact', label: 'Site Contact' },
          { key: 'sitePhone',   label: 'Site Phone' },
          { key: 'clientFrom',  label: 'Client From' },
        ],
      },
      {
        title: 'Equipment',
        fields: [
          { key: 'equipType',  label: 'Equipment Type' },
          { key: 'equipName',  label: 'Equipment Name' },
          { key: 'vendor',     label: 'Vendor' },
          { key: 'bmsVersion', label: 'BMS Version' },
        ],
      },
    ],
  },
  {
    key: 'vpn',
    label: 'VPN',
    icon: Shield,
    copyable: true,
    fields: [
      { key: 'vpnInfo',    label: 'VPN Info' },
      { key: 'vpnAddress', label: 'VPN Address' },
      { key: 'vpnUser',    label: 'VPN Username' },
      { key: 'vpnPass',    label: 'VPN Password' },
      { key: 'externalIp', label: 'External IP' },
      { key: 'hostName',   label: 'Host Name' },
    ],
  },
  {
    key: 'connections',
    label: 'Connections',
    icon: GitMerge,
    sections: [
      {
        title: 'IP',
        copyable: true,
        fields: [
          { key: 'lanOneIp',  label: 'LAN 1 IP' },
          { key: 'lanTwoIp',  label: 'LAN 2 IP' },
          { key: 'lanOneSub', label: 'LAN 1 Subnet' },
          { key: 'lanTwoSub', label: 'LAN 2 Subnet' },
          { key: 'gateway',   label: 'Gateway' },
          { key: 'dnsServer', label: 'DNS Server' },
        ],
      },
      {
        title: 'Ports',
        copyable: true,
        fields: [
          { key: 'platformPort',    label: 'Platform Port' },
          { key: 'platformTlsPort', label: 'Platform TLS' },
          { key: 'foxPort',         label: 'Fox Port' },
          { key: 'foxTlsPort',      label: 'Fox TLS' },
          { key: 'httpPort',        label: 'HTTP Port' },
          { key: 'httpsPort',       label: 'HTTPS Port' },
        ],
      },
      {
        title: 'Credentials',
        copyable: true,
        fields: [
          { key: 'platformUser', label: 'Platform User' },
          { key: 'platformPass', label: 'Platform Pass' },
          { key: 'stationUser',  label: 'Station User' },
          { key: 'stationPass',  label: 'Station Pass' },
        ],
      },
      {
        title: 'BACnet',
        copyable: true,
        fields: [
          { key: 'bacnetRouterIp',    label: 'Router IP' },
          { key: 'bacnetRouterCreds', label: 'Router Creds' },
        ],
      },
    ],
  },
  {
    key: 'notes',
    label: 'Notes',
    icon: FileText,
  },
];

function Field({ label, value, textarea, copyable }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex items-start justify-between py-3 border-b border-neutral-100 dark:border-neutral-800 last:border-0 gap-3 ${textarea ? 'flex-col' : ''}`}>
      <span className="text-xs text-neutral-500 dark:text-neutral-600 shrink-0">{label}</span>
      <div className={`flex items-center gap-1.5 ${textarea ? 'w-full' : 'min-w-0'}`}>
        <span className={`text-sm text-neutral-900 dark:text-neutral-200 ${textarea ? 'whitespace-pre-wrap leading-relaxed w-full' : 'text-right truncate'}`}>
          {value || <span className="text-neutral-400 dark:text-neutral-700">—</span>}
        </span>
        {copyable && value && (
          <button onClick={handleCopy} className="shrink-0 text-neutral-400">
            {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
          </button>
        )}
      </div>
    </div>
  );
}

function EditField({ label, value, onChange, textarea }) {
  const base = 'bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-colors w-full';
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">{label}</label>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className={`${base} resize-none`} />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className={base} />
      )}
    </div>
  );
}

function SectionCard({ title, fields, site, siteId, copyable }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [updateSite, { isLoading }] = useUpdateSiteMutation();

  const startEdit = () => {
    setForm(Object.fromEntries(fields.map((f) => [f.key, site[f.key] || ''])));
    setEditing(true);
  };
  const handleCancel = () => setEditing(false);
  const handleSave = async () => {
    try { await updateSite({ id: siteId, ...form }).unwrap(); setEditing(false); }
    catch (err) { console.log(err); }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 pt-4 pb-1">
      <div className="flex items-center justify-between mb-2">
        {title ? <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">{title}</h3> : <span />}
        {editing ? (
          <div className="flex items-center gap-2">
            <button onClick={handleCancel} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800">
              <X size={11} /> Cancel
            </button>
            <button onClick={handleSave} disabled={isLoading} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs bg-neutral-900 dark:bg-white text-white dark:text-black disabled:opacity-50">
              <Check size={11} /> {isLoading ? 'Saving…' : 'Save'}
            </button>
          </div>
        ) : (
          <button onClick={startEdit} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800">
            <Edit2 size={11} /> Edit
          </button>
        )}
      </div>
      <div className="flex flex-col">
        {fields.map(({ key, label, textarea }) =>
          editing ? (
            <div key={key} className="py-2">
              <EditField label={label} value={form[key]} onChange={(v) => setForm((p) => ({ ...p, [key]: v }))} textarea={textarea} />
            </div>
          ) : (
            <Field key={key} label={label} value={site[key]} textarea={textarea} copyable={copyable} />
          )
        )}
      </div>
    </div>
  );
}

function MobileNoteCard({ note, siteId }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(note.content);
  const [updateNote, { isLoading: saving }] = useUpdateNoteMutation();
  const [deleteNote, { isLoading: deleting }] = useDeleteNoteMutation();

  const handleSave = async () => {
    if (!value.trim()) return;
    await updateNote({ id: note._id, content: value.trim(), siteId }).unwrap();
    setEditing(false);
  };

  const d = new Date(note.createdAt);
  const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 flex flex-col gap-3">
      {editing ? (
        <>
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoFocus
            rows={4}
            className="resize-none text-sm text-neutral-900 dark:text-white bg-transparent focus:outline-none leading-relaxed"
          />
          <div className="flex items-center gap-2 justify-end border-t border-neutral-100 dark:border-neutral-800 pt-2">
            <button onClick={() => { setEditing(false); setValue(note.content); }} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800">
              <X size={11} /> Cancel
            </button>
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs bg-neutral-900 dark:bg-white text-white dark:text-black disabled:opacity-50">
              <Check size={11} /> {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="text-sm text-neutral-900 dark:text-neutral-100 leading-relaxed whitespace-pre-wrap flex-1">
            {note.content}
          </p>
          <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800">
            <div>
              <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400">{note.authorName}</p>
              <p className="text-xs text-neutral-400 dark:text-neutral-600">{dateStr}</p>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setEditing(true)} className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                <Edit2 size={12} />
              </button>
              <button onClick={() => deleteNote({ id: note._id, siteId })} disabled={deleting} className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 disabled:opacity-50">
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function MobileNotesTab({ siteId }) {
  const { data: notes = [], isLoading } = useGetNotesForSiteQuery(siteId);
  const [createNote, { isLoading: creating }] = useCreateNoteMutation();
  const [adding, setAdding] = useState(false);
  const [newContent, setNewContent] = useState('');

  const handleCreate = async () => {
    if (!newContent.trim()) return;
    await createNote({ siteId, content: newContent.trim() }).unwrap();
    setNewContent('');
    setAdding(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
          {notes.length} note{notes.length !== 1 ? 's' : ''}
        </p>
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-900 dark:bg-white text-white dark:text-black"
        >
          <Plus size={12} /> Add Note
        </button>
      </div>

      {adding && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 mb-4">
          <textarea
            autoFocus
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Write a note…"
            rows={4}
            className="w-full resize-none text-sm text-neutral-900 dark:text-white bg-transparent focus:outline-none placeholder-neutral-400 dark:placeholder-neutral-600 leading-relaxed mb-3"
          />
          <div className="flex items-center gap-2 justify-end border-t border-neutral-100 dark:border-neutral-800 pt-3">
            <button onClick={() => { setAdding(false); setNewContent(''); }} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800">
              <X size={11} /> Cancel
            </button>
            <button onClick={handleCreate} disabled={creating || !newContent.trim()} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs bg-neutral-900 dark:bg-white text-white dark:text-black disabled:opacity-50">
              <Check size={11} /> {creating ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <p className="text-sm text-neutral-400 dark:text-neutral-600">Loading notes…</p>
      ) : notes.length === 0 && !adding ? (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-12 flex flex-col items-center justify-center gap-2">
          <FileText size={16} className="text-neutral-400 dark:text-neutral-600" />
          <p className="text-neutral-400 dark:text-neutral-600 text-sm">No notes yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {notes.map((note) => (
            <MobileNoteCard key={note._id} note={note} siteId={siteId} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SiteDetailMobile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [licenseOpen, setLicenseOpen] = useState(false);

  const { data: site, isLoading, isError } = useGetSiteQuery(id);
  const currentTab = TABS.find((t) => t.key === activeTab);

  if (isLoading) {
    return <main className="p-5"><p className="text-neutral-400 text-sm">Loading site…</p></main>;
  }
  if (isError || !site) {
    return (
      <main className="p-5 flex flex-col items-center justify-center gap-2 pt-16">
        <AlertCircle size={18} className="text-red-400" />
        <p className="text-neutral-500 text-sm">Site not found</p>
      </main>
    );
  }

  return (
    <main className="p-5">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-neutral-500 hover:text-neutral-900 dark:hover:text-white text-sm mb-4"
      >
        <ChevronLeft size={15} /> Back
      </button>

      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-neutral-900 dark:text-white mb-0.5">
          {site.customer || 'Unnamed Site'}
        </h1>
        <p className="text-neutral-500 text-xs">
          {site.building ? `${site.building} · ` : ''}{site.siteAddress || 'No address'}
        </p>
        {site.updatedAt && (() => {
          const d = new Date(site.updatedAt);
          const today = new Date();
          const isToday = d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth() && d.getDate() === today.getDate();
          return <p className="text-xs text-neutral-400 mt-0.5">Updated {isToday ? 'Today' : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>;
        })()}

        {/* Action buttons */}
        <div className="flex items-center gap-2 mt-3">
          <a
            href={`${window.location.origin}/site/${id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300"
          >
            <ExternalLink size={12} /> Site Info
          </a>
          {site.jaceLicense && (
            <button
              onClick={() => setLicenseOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300"
            >
              <Key size={12} /> License
            </button>
          )}
          {site.sharepointLink && (
            <a
              href={site.sharepointLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300"
            >
              <ExternalLink size={12} /> SharePoint
            </a>
          )}
        </div>
      </div>

      {/* Tabs — horizontal scroll */}
      <div className="flex items-center gap-1 mb-4 overflow-x-auto pb-px -mx-5 px-5 border-b border-neutral-200 dark:border-neutral-800 scrollbar-hide">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium whitespace-nowrap rounded-t-lg transition-colors relative -mb-px shrink-0 ${
              activeTab === key
                ? 'text-neutral-900 dark:text-white border border-b-white dark:border-b-neutral-900 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900'
                : 'text-neutral-500 border border-transparent'
            }`}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {currentTab.key === 'notes' ? (
        <MobileNotesTab siteId={id} />
      ) : currentTab.sections ? (
        <div className="flex flex-col gap-3">
          {currentTab.sections.map((section) => (
            <SectionCard
              key={section.title}
              title={section.title}
              fields={section.fields}
              site={site}
              siteId={id}
              copyable={section.copyable}
            />
          ))}
        </div>
      ) : (
        <SectionCard
          key={currentTab.key}
          fields={currentTab.fields}
          site={site}
          siteId={id}
          copyable={currentTab.copyable}
        />
      )}

      {licenseOpen && (
        <JaceLicenseModal xmlString={site.jaceLicense} onClose={() => setLicenseOpen(false)} />
      )}
    </main>
  );
}
