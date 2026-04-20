import { useState, useEffect } from 'react';
import { useGarden } from '../App';
import { fetchFlowerMedia } from '../services/iNaturalistService';
import { exportGardenPDF, exportGardenCSV } from '../utils/pdfExport';

export default function MyGarden({ onClose, onSelectFlower }) {
  const { gardenFlowers, toggleGarden } = useGarden();
  const [pdfExporting, setPdfExporting] = useState(false);

  async function handleExportPDF() {
    if (!gardenFlowers.length || pdfExporting) return;
    setPdfExporting(true);
    try { await exportGardenPDF(gardenFlowers); }
    finally { setPdfExporting(false); }
  }

  function handleExportCSV() {
    if (!gardenFlowers.length) return;
    exportGardenCSV(gardenFlowers);
  }

  // Close on Escape
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[1500] bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Slide-in panel */}
      <div className="fixed right-0 top-0 bottom-0 z-[1600] w-full max-w-sm bg-white dark:bg-gray-800 shadow-modal flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-cream-200 dark:border-gray-700 bg-cream-50 dark:bg-gray-900">
          <div>
            <h2 className="text-lg font-serif font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              🌱 My Garden
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {gardenFlowers.length} {gardenFlowers.length === 1 ? 'flower' : 'flowers'} saved
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-cream-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {gardenFlowers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-8 text-center gap-4 py-16">
              <span className="text-6xl">🌼</span>
              <p className="text-gray-600 dark:text-gray-300 font-medium">Your garden wishlist is empty</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                Click the ☆ star on any flower card to save it here for future reference.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-cream-100 dark:divide-gray-700">
              {gardenFlowers.map(flower => (
                <GardenRow
                  key={flower.id}
                  flower={flower}
                  onSelect={() => { onSelectFlower(flower); onClose(); }}
                  onRemove={() => toggleGarden(flower)}
                />
              ))}
            </ul>
          )}
        </div>

        {/* Footer: export buttons + hint */}
        {gardenFlowers.length > 0 && (
          <div className="px-5 py-3 border-t border-cream-200 dark:border-gray-700 bg-cream-50 dark:bg-gray-900 flex flex-col gap-2">
            <div className="flex gap-2">
              <button
                onClick={handleExportPDF}
                disabled={pdfExporting}
                aria-label="Export garden as PDF"
                className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg bg-forest-600 text-white hover:bg-forest-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {pdfExporting ? (
                  <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : '📄'}
                {pdfExporting ? 'Generating…' : 'Export PDF'}
              </button>
              <button
                onClick={handleExportCSV}
                aria-label="Export garden as CSV"
                className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg bg-terra-500 text-white hover:bg-terra-600 transition-colors"
              >
                📊 Export CSV
              </button>
            </div>
            <p className="text-xs text-gray-400 text-center">
              Tap a flower to view its full planting guide
            </p>
          </div>
        )}
      </div>
    </>
  );
}

function GardenRow({ flower, onSelect, onRemove }) {
  const [thumbUrl, setThumbUrl] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchFlowerMedia(flower.scientificName, flower.iNaturalistTaxonId)
      .then(m => { if (!cancelled && m?.thumbUrl) setThumbUrl(m.thumbUrl); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [flower.scientificName, flower.iNaturalistTaxonId]);

  return (
    <li className="flex items-center gap-3 px-4 py-3 hover:bg-cream-50 dark:hover:bg-gray-700 group">
      {/* Thumb */}
      <button onClick={onSelect} className="flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-forest-50">
        {thumbUrl ? (
          <img src={thumbUrl} alt={flower.commonName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xl">🌸</div>
        )}
      </button>

      {/* Text */}
      <button onClick={onSelect} className="flex-1 min-w-0 text-left">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{flower.commonName}</p>
        <p className="text-xs italic text-gray-400 dark:text-gray-500 truncate">{flower.scientificName}</p>
        <div className="flex gap-2 mt-1">
          <span className="text-xs text-gray-500">🌼 {flower.bloomSeason}</span>
          <span className="text-xs text-gray-500">Zones {flower.usdaZones}</span>
        </div>
      </button>

      {/* Remove */}
      <button
        onClick={onRemove}
        aria-label="Remove from garden"
        className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
      >
        ✕
      </button>
    </li>
  );
}
