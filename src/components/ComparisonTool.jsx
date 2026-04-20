import { useState, useEffect } from 'react';
import { fetchFlowerMedia } from '../services/iNaturalistService';

const ROWS = [
  { key: 'bloomSeason',    label: 'Bloom Season',   icon: '🌼' },
  { key: 'sunPreference',  label: 'Sun',             icon: '☀️' },
  { key: 'waterNeeds',     label: 'Water Needs',     icon: '💧' },
  { key: 'height',         label: 'Height',          icon: '📏' },
  { key: 'spread',         label: 'Spread',          icon: '↔️' },
  { key: 'soilPreference', label: 'Soil',            icon: '🪨' },
  { key: 'usdaZones',      label: 'USDA Zones',      icon: '🗺️' },
  { key: 'pollinatorValue',label: 'Pollinator Value',icon: '🐝' },
  { key: 'family',         label: 'Family',          icon: '🌿' },
];

export default function ComparisonTool({ flowers, onRemoveFlower, onClose }) {
  // Close on Escape
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!flowers.length) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[1500] bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Panel — full screen on mobile, inset on desktop */}
      <div className="fixed inset-0 sm:inset-x-4 sm:bottom-4 sm:top-16 z-[1600] bg-white dark:bg-gray-900 sm:rounded-2xl shadow-modal flex flex-col overflow-hidden max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cream-200 dark:border-gray-700 bg-cream-50 dark:bg-gray-800 flex-shrink-0">
          <h2 className="text-lg font-serif font-bold text-gray-900 dark:text-gray-100">⚖ Compare Flowers</h2>
          <button
            onClick={onClose}
            className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-cream-200 text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Scrollable table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                {/* Row label column */}
                <th className="text-left w-32 min-w-[120px] sticky left-0 bg-cream-50 dark:bg-gray-800 z-10 px-4 py-3 border-b border-cream-200 dark:border-gray-700" />
                {flowers.map(f => (
                  <th key={f.id} className="px-3 py-2 border-b border-cream-200 dark:border-gray-700 align-top min-w-[180px]">
                    <FlowerColumnHeader
                      flower={f}
                      onRemove={() => onRemoveFlower(f.id)}
                    />
                  </th>
                ))}
                {/* Empty slot(s) */}
                {Array.from({ length: Math.max(0, 3 - flowers.length) }).map((_, i) => (
                  <th key={`empty-${i}`} className="px-3 py-3 border-b border-cream-200 dark:border-gray-700 text-center text-gray-300 dark:text-gray-600 text-xs min-w-[160px]">
                    + Add flower
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, ri) => (
                <tr key={row.key} className={ri % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-cream-50 dark:bg-gray-800'}>
                  <td className="sticky left-0 z-10 px-4 py-3 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide whitespace-nowrap"
                    style={{ background: ri % 2 === 0 ? 'var(--comp-row-even, #fff)' : 'var(--comp-row-odd, #f5f0e8)' }}>
                    {row.icon} {row.label}
                  </td>
                  {flowers.map(f => {
                    const val = f[row.key] ?? '—';
                    const highlight =
                      row.key === 'pollinatorValue' && val === 'High'
                        ? 'text-green-700 font-medium'
                        : row.key === 'waterNeeds' && val === 'Low'
                        ? 'text-blue-600 font-medium'
                        : '';
                    return (
                      <td key={f.id} className={`px-3 py-3 text-center text-sm text-gray-800 dark:text-gray-200 ${highlight}`}>
                        {Array.isArray(val) ? val.join(', ') : val}
                      </td>
                    );
                  })}
                  {Array.from({ length: Math.max(0, 3 - flowers.length) }).map((_, i) => (
                    <td key={`empty-${i}`} className="px-3 py-3" />
                  ))}
                </tr>
              ))}

              {/* Colors row */}
              <tr className="bg-white dark:bg-gray-900">
                <td className="sticky left-0 z-10 px-4 py-3 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide bg-white dark:bg-gray-900">
                  🎨 Colors
                </td>
                {flowers.map(f => (
                  <td key={f.id} className="px-3 py-3 text-center">
                    <span className="text-xs text-gray-700 dark:text-gray-300 capitalize">
                      {(f.colors ?? []).join(', ')}
                    </span>
                  </td>
                ))}
                {Array.from({ length: Math.max(0, 3 - flowers.length) }).map((_, i) => (
                  <td key={`empty-${i}`} />
                ))}
              </tr>

              {/* Description row */}
              <tr className="bg-cream-50 dark:bg-gray-800">
                <td className="sticky left-0 z-10 px-4 py-3 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide bg-cream-50 dark:bg-gray-800">
                  📝 Notes
                </td>
                {flowers.map(f => (
                  <td key={f.id} className="px-3 py-3 text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    {f.description?.slice(0, 120)}…
                  </td>
                ))}
                {Array.from({ length: Math.max(0, 3 - flowers.length) }).map((_, i) => (
                  <td key={`empty-${i}`} />
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function FlowerColumnHeader({ flower, onRemove }) {
  const [thumbUrl, setThumbUrl] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchFlowerMedia(flower.scientificName, flower.iNaturalistTaxonId)
      .then(m => { if (!cancelled && m?.thumbUrl) setThumbUrl(m.thumbUrl); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [flower.scientificName, flower.iNaturalistTaxonId]);

  return (
    <div className="flex flex-col items-center gap-2 pb-1">
      <div className="relative">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-forest-200 bg-forest-50">
          {thumbUrl ? (
            <img src={thumbUrl} alt={flower.commonName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl">🌸</div>
          )}
        </div>
        <button
          onClick={onRemove}
          aria-label="Remove"
          className="absolute -top-1 -right-1 w-5 h-5 bg-red-400 hover:bg-red-500 text-white rounded-full flex items-center justify-center text-xs transition-colors"
        >
          ✕
        </button>
      </div>
      <div className="text-center">
        <p className="font-medium text-gray-900 dark:text-gray-100 text-xs leading-tight">{flower.commonName}</p>
        <p className="text-xs italic text-gray-400 dark:text-gray-500 leading-tight">{flower.scientificName}</p>
      </div>
    </div>
  );
}
