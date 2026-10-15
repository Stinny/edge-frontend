import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Copy, Check, AlertCircle } from 'react-feather';

function Field({ label, value }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-neutral-500 dark:text-neutral-600 uppercase tracking-wider">{label}</span>
      <div className="flex items-center gap-1.5 min-w-0">
        <span className="text-sm text-neutral-900 dark:text-neutral-200 truncate">
          {value || <span className="text-neutral-400 dark:text-neutral-700">—</span>}
        </span>
        {value && (
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

function Section({ title, fields, site }) {
  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
      <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-4">{title}</h2>
      <div className="grid grid-cols-2 gap-x-8 gap-y-5">
        {fields.map(({ key, label }) => (
          <Field key={key} label={label} value={site[key]} />
        ))}
      </div>
    </div>
  );
}

export default function SiteInfo() {
  const { id } = useParams();
  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/sites/public/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setSite(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 flex flex-col">
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <p className="text-neutral-400 dark:text-neutral-600 text-sm">Loading site info…</p>
        </div>
      ) : error || !site ? (
        <div className="flex flex-col items-center justify-center gap-2 py-16">
          <AlertCircle size={18} className="text-red-400" />
          <p className="text-neutral-500 text-sm">Site not found</p>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto w-full px-8 py-12">
          <div className="mb-4">
            <p className="text-xs font-medium text-neutral-400 dark:text-neutral-600 uppercase tracking-widest mb-2">BMS Info</p>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
              {site.customer || 'Site Info'}
            </h1>
            {site.siteAddress && (
              <p className="text-sm text-neutral-500 mt-1">{site.siteAddress}</p>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <Section
              title="Site Info"
              fields={[
                { key: 'customer',   label: 'Customer' },
                { key: 'siteAddress', label: 'Address' },
                { key: 'equipType',  label: 'Equipment Type' },
                { key: 'vendor',     label: 'Vendor' },
                { key: 'hostId',     label: 'Host ID' },
                { key: 'serial',     label: 'Serial' },
                { key: 'bmsVersion', label: 'BMS Version' },
                { key: 'maintExp',   label: 'Maint. Expiry' },
              ]}
              site={site}
            />

            <Section
              title="Network"
              fields={[
                { key: 'gateway',   label: 'Gateway' },
                { key: 'dnsServer', label: 'DNS Server' },
                { key: 'lanOneIp',  label: 'LAN 1 IP' },
                { key: 'lanOneSub', label: 'LAN 1 Subnet' },
                { key: 'lanTwoIp',  label: 'LAN 2 IP' },
                { key: 'lanTwoSub', label: 'LAN 2 Subnet' },
              ]}
              site={site}
            />

            <Section
              title="Ports"
              fields={[
                { key: 'platformPort',    label: 'Platform Port' },
                { key: 'platformTlsPort', label: 'Platform TLS Port' },
                { key: 'foxPort',         label: 'Fox Port' },
                { key: 'foxTlsPort',      label: 'Fox TLS Port' },
                { key: 'httpPort',        label: 'HTTP Port' },
                { key: 'httpsPort',       label: 'HTTPS Port' },
              ]}
              site={site}
            />

            <Section
              title="Credentials"
              fields={[
                { key: 'platformUser', label: 'Platform Username' },
                { key: 'platformPass', label: 'Platform Password' },
                { key: 'stationUser',  label: 'Station Username' },
                { key: 'stationPass',  label: 'Station Password' },
              ]}
              site={site}
            />
          </div>
        </div>
      )}

      <footer className="pb-8 mb-10 text-center">
        <span className="text-sm text-neutral-400 dark:text-neutral-600">
          Powered by{' '}
          <a
            href="https://www.edgeautomationsolutions.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-600 dark:hover:text-neutral-400 transition-colors underline underline-offset-2"
          >
            Edge Automation
          </a>
        </span>
      </footer>
    </div>
  );
}
