import { useState, useEffect, useCallback } from 'react';
import { fetchFlowerMedia, getTaxonObservationCount } from '../services/iNaturalistService';

async function copyFlowerUrl(flowerId) {
  const url = `${window.location.origin}/flower/${flowerId}`;
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    // Fallback for browsers without clipboard API
    try {
      const ta = document.createElement('textarea');
      ta.value = url;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      return true;
    } catch {
      return false;
    }
  }
}

const SEASON_COLORS = {
  'Spring':          'bg-green-100 text-green-800',
  'Summer':          'bg-yellow-100 text-yellow-800',
  'Fall':            'bg-orange-100 text-orange-800',
  'Spring – Summer': 'bg-lime-100 text-lime-800',
  'Summer – Fall':   'bg-amber-100 text-amber-800',
};

const SUN_ICONS = {
  'Full Sun':      '☀️',
  'Partial Shade': '⛅',
  'Full Shade':    '🌥️',
};

const COLOR_DOTS = {
  yellow:   'bg-yellow-400',
  purple:   'bg-purple-500',
  pink:     'bg-pink-400',
  blue:     'bg-blue-500',
  red:      'bg-red-500',
  white:    'bg-gray-100 border border-gray-300',
  orange:   'bg-orange-500',
  lavender: 'bg-purple-300',
  maroon:   'bg-red-800',
  brown:    'bg-yellow-900',
};

export default function FlowerCard({ flower, onSelect, onGardenToggle, inGarden, inComparison, onCompareToggle }) {
  const [media, setMedia]               = useState(null);
  const [imgErr, setImgErr]             = useState(false);
  const [mediaLoading, setMediaLoading] = useState(true);
  const [obsCount, setObsCount]         = useState(null);
  const [copied, setCopied]             = useState(false);

  const handleCopy = useCallback(async (e) => {
    e.stopPropagation();
    const ok = await copyFlowerUrl(flower.id);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [flower.id]);

  useEffect(() => {
    let cancelled = false;
    setMediaLoading(true);
    fetchFlowerMedia(flower.scientificName, flower.iNaturalistTaxonId)
      .then(m => { if (!cancelled) { setMedia(m); setMediaLoading(false); } })
      .catch(() => { if (!cancelled) setMediaLoading(false); });
    return () => { cancelled = true; };
  }, [flower.scientificName, flower.iNaturalistTaxonId]);

  useEffect(() => {
    if (!flower.iNaturalistTaxonId) return;
    let cancelled = false;
    getTaxonObservationCount(flower.iNaturalistTaxonId)
      .then(n => { if (!cancelled && n !== null) setObsCount(n); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [flower.iNaturalistTaxonId]);

  const photo = media?.photoUrl;
  const seasonClass = SEASON_COLORS[flower.bloomSeason] ?? 'bg-gray-100 text-gray-700';
  const currentMonth = new Date().getMonth() + 1; // 1-indexed
  const isBloomingNow = (flower.bloomMonths ?? []).includes(currentMonth);

  return (
    <article
      className="bg-white dark:bg-gray-800 rounded-xl2 overflow-hidden shadow-card card-hover cursor-pointer group relative"
      onClick={() => onSelect(flower)}
      aria-label={`View details for ${flower.commonName}`}
    >
      {/* Photo */}
      <div className="relative h-48 bg-forest-50 overflow-hidden">
        {mediaLoading ? (
          <div className="skeleton w-full h-full" />
        ) : photo && !imgErr ? (
          <img
            src={photo}
            alt={`${flower.commonName} in bloom`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={() => setImgErr(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-forest-100 to-cream-200">
            <span className="text-5xl select-none">🌸</span>
          </div>
        )}

        {/* Bloom season badge */}
        <span className={`absolute top-2 left-2 text-xs font-medium px-2 py-0.5 rounded-full ${seasonClass}`}>
          {flower.bloomSeason}
        </span>

        {/* Blooming now badge */}
        {isBloomingNow && (
          <span className="absolute top-9 left-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-green-500 text-white shadow-sm">
            🌸 Blooming now
          </span>
        )}

        {/* Toxicity warning — always visible */}
        {(flower.toxicToHumans || flower.toxicToPets) && (
          <span
            title={[
              flower.toxicToHumans ? '⚠️ Toxic to humans' : '',
              flower.toxicToPets   ? '🐾 Toxic to pets'   : '',
            ].filter(Boolean).join(' · ')}
            className="absolute bottom-2 left-2 bg-amber-100 border border-amber-300 text-amber-800 text-xs font-medium px-1.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm"
          >
            ⚠️
            {flower.toxicToHumans && flower.toxicToPets
              ? 'Toxic'
              : flower.toxicToHumans
              ? 'Human'
              : 'Pets'}
          </span>
        )}

        {/* Action buttons overlay — hidden on desktop until hover, always visible on mobile */}
        <div className="absolute top-2 right-2 flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          {/* Garden button — min 44×44 tap target */}
          <button
            onClick={e => { e.stopPropagation(); onGardenToggle(flower); }}
            aria-label={inGarden ? `Remove ${flower.commonName} from My Garden` : `Save ${flower.commonName} to My Garden`}
            className={`w-11 h-11 rounded-full flex items-center justify-center text-sm shadow transition-colors ${
              inGarden ? 'bg-terra-500 text-white' : 'bg-white text-gray-600 hover:bg-terra-100'
            }`}
          >
            {inGarden ? '★' : '☆'}
          </button>
          {/* Compare button — min 44×44 tap target */}
          <button
            onClick={e => { e.stopPropagation(); onCompareToggle(flower); }}
            aria-label={inComparison ? `Remove ${flower.commonName} from comparison` : `Add ${flower.commonName} to comparison`}
            className={`w-11 h-11 rounded-full flex items-center justify-center text-xs shadow transition-colors ${
              inComparison ? 'bg-forest-500 text-white' : 'bg-white text-gray-600 hover:bg-forest-100'
            }`}
          >
            ⚖
          </button>
          {/* Share/copy button — min 44×44 tap target */}
          <button
            onClick={handleCopy}
            aria-label={`Copy link to ${flower.commonName}`}
            title="Copy link to this flower"
            className="w-11 h-11 rounded-full flex items-center justify-center text-sm shadow transition-colors bg-white text-gray-600 hover:bg-green-50"
          >
            {copied ? '✅' : '🔗'}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Names */}
        <h3 className="font-serif font-semibold text-gray-900 dark:text-gray-100 text-base leading-tight">
          {flower.commonName}
        </h3>
        <p className="text-xs italic text-gray-500 dark:text-gray-400 mt-0.5">{flower.scientificName}</p>

        {/* Description */}
        <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 line-clamp-2 leading-relaxed">
          {flower.description}
        </p>

        {/* Chips row */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {/* Sun preference */}
          <span className="text-xs px-2 py-0.5 bg-cream-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
            {SUN_ICONS[flower.sunPreference]} {flower.sunPreference}
          </span>
          {/* Water */}
          <span className="text-xs px-2 py-0.5 bg-cream-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
            💧 {flower.waterNeeds}
          </span>
          {/* Color dots */}
          <span className="flex items-center gap-1 text-xs px-2 py-0.5 bg-cream-100 dark:bg-gray-700 rounded-full">
            {flower.colors.slice(0, 3).map(c => (
              <span key={c} className={`w-2.5 h-2.5 rounded-full inline-block ${COLOR_DOTS[c] ?? 'bg-gray-400'}`} title={c} />
            ))}
          </span>
          {/* Pollinator value */}
          {flower.pollinatorValue === 'High' && (
            <span className="text-xs px-2 py-0.5 bg-yellow-50 text-yellow-800 rounded-full">
              🐝 Pollinator
            </span>
          )}
        </div>

        {/* Footer: zones + obs count + iNat link */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-cream-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-xs text-forest-600 font-medium">Zones {flower.usdaZones}</span>
            {obsCount !== null && (
              <span className="text-xs text-gray-400" title="Research-grade iNaturalist observations">
                👁 {obsCount.toLocaleString()}
              </span>
            )}
          </div>
          {media?.inatUrl && (
            <a
              href={media.inatUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              aria-label={`View ${flower.commonName} on iNaturalist`}
              className="text-xs text-forest-500 hover:text-forest-700 hover:underline"
            >
              iNaturalist ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
