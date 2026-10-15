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
    <div className="flex items-center justify-between py-3 border-b border-neutral-100 dark:border-neutral-800 last:border-0">
      <span className="text-xs text-neutral-500 dark:text-neutral-600 uppercase tracking-wider shrink-0 mr-4">{label}</span>
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-sm text-neutral-900 dark:text-neutral-200 text-right truncate">
          {value || <span className="text-neutral-400 dark:text-neutral-700">—</span>}
        </span>
        {value && (
          <button
            onClick={handleCopy}
            className="shrink-0 text-neutral-400 dark:text-neutral-600"
            aria-label="Copy"
          >
            {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
          </button>
        )}
      </div>
    </div>
  );
}

function Section({ title, fields, site }) {
  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 pt-4 pb-1">
      <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">{title}</h2>
      {fields.map(({ key, label }) => (
        <Field key={key} label={label} value={site[key]} />
      ))}
    </div>
  );
}

export default function SiteInfoMobile() {
  const { id } = useParams();
  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/sites/public/${id}`)
      .then((res) => { if (!res.ok) throw new Error(); return res.json(); })
      .then((data) => { setSite(data); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 flex flex-col">
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-neutral-400 text-sm">Loading…</p>
        </div>
      ) : error || !site ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <AlertCircle size={18} className="text-red-400" />
          <p className="text-neutral-500 text-sm">Site not found</p>
        </div>
      ) : (
        <div className="flex-1 px-4 py-8 flex flex-col gap-4">
          <div className="mb-2">
            <p className="text-xs font-medium text-neutral-400 dark:text-neutral-600 uppercase tracking-widest mb-2">BMS Info</p>
            <h1 className="text-xl font-bold text-neutral-900 dark:text-white">
              {site.customer || 'Site Info'}
            </h1>
            {site.siteAddress && (
              <p className="text-sm text-neutral-500 mt-0.5">{site.siteAddress}</p>
            )}
          </div>

          <Section
            title="Site Info"
            fields={[
              { key: 'customer',    label: 'Customer' },
              { key: 'siteAddress', label: 'Address' },
              { key: 'equipType',   label: 'Equip. Type' },
              { key: 'vendor',      label: 'Vendor' },
              { key: 'hostId',      label: 'Host ID' },
              { key: 'serial',      label: 'Serial' },
              { key: 'bmsVersion',  label: 'BMS Version' },
              { key: 'maintExp',    label: 'Maint. Expiry' },
            ]}
            site={site}
          />

          <Section
            title="Network"
            fields={[
              { key: 'gateway',   label: 'Gateway' },
              { key: 'dnsServer', label: 'DNS' },
              { key: 'lanOneIp',  label: 'LAN 1 IP' },
              { key: 'lanOneSub', label: 'LAN 1 Sub' },
              { key: 'lanTwoIp',  label: 'LAN 2 IP' },
              { key: 'lanTwoSub', label: 'LAN 2 Sub' },
            ]}
            site={site}
          />

          <Section
            title="Ports"
            fields={[
              { key: 'platformPort',    label: 'Platform' },
              { key: 'platformTlsPort', label: 'Platform TLS' },
              { key: 'foxPort',         label: 'Fox' },
              { key: 'foxTlsPort',      label: 'Fox TLS' },
              { key: 'httpPort',        label: 'HTTP' },
              { key: 'httpsPort',       label: 'HTTPS' },
            ]}
            site={site}
          />

          <Section
            title="Credentials"
            fields={[
              { key: 'platformUser', label: 'Platform User' },
              { key: 'platformPass', label: 'Platform Pass' },
              { key: 'stationUser',  label: 'Station User' },
              { key: 'stationPass',  label: 'Station Pass' },
            ]}
            site={site}
          />
        </div>
      )}

      <footer className="py-5 text-center">
        <span className="text-xs text-neutral-400 dark:text-neutral-600">
          Powered by{' '}
          <a
            href="https://www.edgeautomationsolutions.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            Edge Automation
          </a>
        </span>
      </footer>
    </div>
  );
}
