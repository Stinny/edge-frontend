import { useMemo, useState } from 'react';
import { X, Copy, Check } from 'react-feather';

function parseLicense(xmlString) {
  try {
    const doc = new DOMParser().parseFromString(xmlString, 'text/xml');
    const licenseEl = doc.querySelector('license');
    if (!licenseEl) return null;

    const a = (el, name) => el.getAttribute(name) ?? '';

    const meta = {
      vendor:                a(licenseEl, 'vendor'),
      version:               a(licenseEl, 'version'),
      hostId:                a(licenseEl, 'hostId'),
      serialNumber:          a(licenseEl, 'serialNumber'),
      generated:             a(licenseEl, 'generated'),
      expiration:            a(licenseEl, 'expiration'),
      maintenanceExpiration: a(licenseEl, 'maintenanceExpiration'),
    };

    const features = Array.from(doc.querySelectorAll('feature')).map((f) => {
      const attrs = {};
      for (const { name, value } of f.attributes) {
        if (name !== 'name') attrs[name] = value;
      }
      return { name: a(f, 'name'), attrs };
    });

    const signature = doc.querySelector('signature')?.textContent?.trim() ?? '';

    return { meta, features, signature };
  } catch {
    return null;
  }
}

const META_FIELDS = [
  { key: 'vendor',                label: 'Vendor' },
  { key: 'version',               label: 'Version' },
  { key: 'hostId',                label: 'Host ID' },
  { key: 'serialNumber',          label: 'Serial Number' },
  { key: 'generated',             label: 'Generated' },
  { key: 'expiration',            label: 'Expiration' },
  { key: 'maintenanceExpiration', label: 'Maintenance Exp.' },
];

export default function JaceLicenseModal({ xmlString, onClose }) {
  const license = useMemo(() => parseLicense(xmlString), [xmlString]);
  const [view, setView] = useState('formatted');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(xmlString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!license) return null;
  const { meta, features, signature } = license;

  return (
    <div
      className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
          <div>
            <h2 className="text-base font-semibold text-neutral-900 dark:text-white">JACE License</h2>
            <p className="text-xs text-neutral-500 mt-0.5">{meta.vendor} · v{meta.version}</p>
          </div>

          <div className="flex items-center gap-2">
            {/* View toggle */}
            <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 rounded-lg p-0.5">
              <button
                onClick={() => setView('formatted')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  view === 'formatted'
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
                }`}
              >
                Formatted
              </button>
              <button
                onClick={() => setView('raw')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  view === 'raw'
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
                }`}
              >
                Raw
              </button>
            </div>

            {/* Copy button — only in raw view */}
            {view === 'raw' && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Body */}
        {view === 'formatted' ? (
          <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">
            {/* License meta */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              {META_FIELDS.map(({ key, label }) => (
                <div key={key} className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">{label}</span>
                  <span className="text-sm font-mono text-neutral-800 dark:text-neutral-200 break-all">
                    {meta[key] || <span className="font-sans text-neutral-400 dark:text-neutral-600">—</span>}
                  </span>
                </div>
              ))}
            </div>

            {/* Features */}
            <div>
              <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-3">
                Features
                <span className="ml-1.5 text-neutral-400 dark:text-neutral-600 normal-case tracking-normal font-normal">
                  ({features.length})
                </span>
              </h3>
              <div className="border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60">
                      <th className="px-4 py-2.5 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider w-44">
                        Name
                      </th>
                      <th className="px-4 py-2.5 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Attributes
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {features.map(({ name, attrs }, i) => (
                      <tr
                        key={name}
                        className={`border-b border-neutral-100 dark:border-neutral-800 last:border-0 ${
                          i % 2 !== 0 ? 'bg-neutral-50/60 dark:bg-neutral-800/20' : ''
                        }`}
                      >
                        <td className="px-4 py-2.5 font-mono text-xs font-medium text-neutral-700 dark:text-neutral-300 align-top whitespace-nowrap">
                          {name}
                        </td>
                        <td className="px-4 py-2.5 align-top">
                          <div className="flex flex-wrap gap-x-5 gap-y-1">
                            {Object.entries(attrs).map(([k, v]) => (
                              <span key={k} className="text-xs">
                                <span className="text-neutral-400 dark:text-neutral-600">{k}: </span>
                                <span className="text-neutral-600 dark:text-neutral-400">{v}</span>
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Signature */}
            {signature && (
              <div>
                <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">Signature</h3>
                <p className="font-mono text-xs text-neutral-500 dark:text-neutral-500 break-all bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-lg px-4 py-3">
                  {signature}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-y-auto flex-1 p-4">
            <pre className="font-mono text-xs text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl p-5 whitespace-pre-wrap break-all">
              {xmlString}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
