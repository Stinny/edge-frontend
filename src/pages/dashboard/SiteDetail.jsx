import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Layout,
  Shield,
  GitMerge,
  FileText,
  ChevronLeft,
  AlertCircle,
  Edit2,
  Check,
  X,
  ExternalLink,
  Key,
  Copy,
} from 'react-feather';
import { useGetSiteQuery, useUpdateSiteMutation } from '../../api/sitesApiSlice';
import JaceLicenseModal from '../../components/JaceLicenseModal';

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
          { key: 'platformTlsPort', label: 'Platform TLS Port' },
          { key: 'foxPort',         label: 'Fox Port' },
          { key: 'foxTlsPort',      label: 'Fox TLS Port' },
          { key: 'httpPort',        label: 'HTTP Port' },
          { key: 'httpsPort',       label: 'HTTPS Port' },
        ],
      },
      {
        title: 'Credentials',
        copyable: true,
        fields: [
          { key: 'platformUser', label: 'Platform Username' },
          { key: 'platformPass', label: 'Platform Password' },
          { key: 'stationUser',  label: 'Station Username' },
          { key: 'stationPass',  label: 'Station Password' },
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
    fields: [
      { key: 'notesOne', label: 'Notes 1', textarea: true },
      { key: 'notesTwo', label: 'Notes 2', textarea: true },
    ],
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
    <div className={`flex flex-col gap-1 ${textarea ? 'col-span-2' : ''}`}>
      <span className="text-xs text-neutral-500 dark:text-neutral-600">{label}</span>
      <div className="flex items-center gap-1.5 min-w-0">
        <span className={`text-sm text-neutral-900 dark:text-neutral-200 min-w-0 ${textarea ? 'whitespace-pre-wrap leading-relaxed' : 'truncate'}`}>
          {value || <span className="text-neutral-400 dark:text-neutral-700">—</span>}
        </span>
        {copyable && value && (
          <button
            onClick={handleCopy}
            className="shrink-0 text-neutral-400 dark:text-neutral-600 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
            aria-label="Copy to clipboard"
          >
            {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
          </button>
        )}
      </div>
    </div>
  );
}

function EditField({ label, value, onChange, textarea }) {
  const base = 'bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-600 focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-colors w-full';
  return (
    <div className={`flex flex-col gap-1.5 ${textarea ? 'col-span-2' : ''}`}>
      <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
        {label}
      </label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          className={`${base} resize-none`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={base}
        />
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
    try {
      await updateSite({ id: siteId, ...form }).unwrap();
      setEditing(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-5">
        {title ? (
          <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
            {title}
          </h3>
        ) : (
          <span />
        )}

        {editing ? (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <X size={12} />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-900 dark:bg-white text-white dark:text-black hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors disabled:opacity-50"
            >
              <Check size={12} />
              {isLoading ? 'Saving…' : 'Save'}
            </button>
          </div>
        ) : (
          <button
            onClick={startEdit}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <Edit2 size={12} />
            Edit
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-5">
        {fields.map(({ key, label, textarea }) =>
          editing ? (
            <EditField
              key={key}
              label={label}
              value={form[key]}
              onChange={(v) => setForm((prev) => ({ ...prev, [key]: v }))}
              textarea={textarea}
            />
          ) : (
            <Field key={key} label={label} value={site[key]} textarea={textarea} copyable={copyable} />
          )
        )}
      </div>
    </div>
  );
}

export default function SiteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [licenseOpen, setLicenseOpen] = useState(false);

  const { data: site, isLoading, isError } = useGetSiteQuery(id);

  const currentTab = TABS.find((t) => t.key === activeTab);

  if (isLoading) {
    return (
      <main className="p-8">
        <p className="text-neutral-400 dark:text-neutral-600 text-sm">Loading site…</p>
      </main>
    );
  }

  if (isError || !site) {
    return (
      <main className="p-8 flex flex-col items-center justify-center gap-2 pt-24">
        <AlertCircle size={18} className="text-red-400" />
        <p className="text-neutral-500 text-sm">Site not found</p>
      </main>
    );
  }

  return (
    <main className="p-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-white text-sm mb-6 transition-colors"
      >
        <ChevronLeft size={15} />
        Back to Sites
      </button>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-1">
            {site.customer || 'Unnamed Site'}
          </h1>
          <p className="text-neutral-500 text-sm">
            {site.building ? `${site.building} · ` : ''}{site.siteAddress || 'No address'}
          </p>
          {site.updatedAt && (() => {
            const d = new Date(site.updatedAt);
            const today = new Date();
            const isToday = d.getFullYear() === today.getFullYear() &&
              d.getMonth() === today.getMonth() &&
              d.getDate() === today.getDate();
            return (
              <p className="text-xs text-neutral-400 dark:text-neutral-600 mt-1">
                Updated {isToday ? 'Today' : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            );
          })()}
        </div>
        <div className="flex items-center gap-2">
          {site.jaceLicense && (
            <button
              onClick={() => setLicenseOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
            >
              <Key size={14} />
              License
            </button>
          )}
          <a
            href={`${window.location.origin}/site/${id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
          >
            <ExternalLink size={14} />
            Site Info
          </a>
          {site.sharepointLink && (
            <a
              href={site.sharepointLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
            >
              <ExternalLink size={14} />
              SharePoint
            </a>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 border-b border-neutral-200 dark:border-neutral-800 pb-0">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors relative -mb-px ${
              activeTab === key
                ? 'text-neutral-900 dark:text-white border border-b-white dark:border-b-neutral-900 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900'
                : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 border border-transparent'
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {currentTab.sections ? (
        <div className="flex flex-col gap-4">
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
        <JaceLicenseModal
          xmlString={site.jaceLicense}
          onClose={() => setLicenseOpen(false)}
        />
      )}
    </main>
  );
}
