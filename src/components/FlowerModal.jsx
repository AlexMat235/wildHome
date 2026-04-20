import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { fetchFlowerMedia } from '../services/iNaturalistService';
import { exportFlowerPDF } from '../utils/pdfExport';
import { FLOWERS_BY_ID } from '../data/wildflowers';
import { STATE_BY_NAME } from '../data/stateData';
import { expandNativeStates } from '../data/stateData';
import { cacheGet } from '../utils/cache';
import { useGarden } from '../App';

const SUN_ICONS = { 'Full Sun': '☀️', 'Partial Shade': '⛅', 'Full Shade': '🌥️' };

// ── Photo attribution helpers ─────────────────────────────────────────────────
const LICENSE_LABELS = {
  'cc-by':        'CC BY',
  'cc-by-nc':     'CC BY-NC',
  'cc-by-sa':     'CC BY-SA',
  'cc-by-nd':     'CC BY-ND',
  'cc-by-nc-sa':  'CC BY-NC-SA',
  'cc-by-nc-nd':  'CC BY-NC-ND',
  'cc0':          'CC0',
  'all-rights-reserved': '© All Rights Reserved',
};

function formatPhotoCredit(attribution, licenseCode) {
  if (!attribution && !licenseCode) return null;
  const license = licenseCode ? (LICENSE_LABELS[licenseCode.toLowerCase()] ?? licenseCode.toUpperCase()) : null;
  if (!attribution) return license ? `Photo via iNaturalist (${license})` : 'Photo via iNaturalist';
  // Extract photographer name: iNat format is typically "(c) Name, ..." or "(c) Name (CC...)"
  const nameMatch = attribution.match(/^\(c\)\s+(.+?)(?:\s*,|\s*\()/i);
  const photographer = nameMatch?.[1]?.trim() ?? null;
  if (photographer && license) return `Photo © ${photographer} / iNaturalist (${license})`;
  if (photographer) return `Photo © ${photographer} / iNaturalist`;
  if (license) return `Photo via iNaturalist (${license})`;
  return 'Photo via iNaturalist';
}
const WATER_ICONS = { Low: '💧', Moderate: '💧💧', High: '💧💧💧' };
const POLL_COLORS = { High: 'text-yellow-700 bg-yellow-50', Medium: 'text-blue-700 bg-blue-50', Low: 'text-gray-600 bg-gray-50' };
const CONSERVATION_COLORS = {
  'Secure':               'bg-green-100 text-green-800',
  'Vulnerable':           'bg-yellow-100 text-yellow-800',
  'Imperiled':            'bg-orange-100 text-orange-800',
  'Critically Imperiled': 'bg-red-100 text-red-800',
  'Not Ranked':           'bg-gray-100 text-gray-600',
};
const CONSERVATION_ICONS = {
  'Secure':               '✅',
  'Vulnerable':           '⚠️',
  'Imperiled':            '🔶',
  'Critically Imperiled': '🔴',
  'Not Ranked':           '❓',
};

export default function FlowerModal({ flower, onClose, onSelectSimilar }) {
  const [media, setMedia]             = useState(null);
  const [imgErr, setImgErr]           = useState(false);
  const [mediaLoading, setMediaLoading] = useState(true);
  const [exporting, setExporting]     = useState(false);
  const [geoJson, setGeoJson]         = useState(null);
  const [copied, setCopied]           = useState(false);
  const { toggleGarden, isInGarden } = useGarden();

  const flowerUrl = useMemo(() =>
    `${window.location.origin}/flower/${flower.id}`, [flower.id]);

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(flowerUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      try {
        const ta = document.createElement('textarea');
        ta.value = flowerUrl;
        ta.style.cssText = 'position:fixed;opacity:0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch { /* clipboard unavailable */ }
    }
  }

  function handleShareX() {
    const states = (flower.nativeStates ?? []).slice(0, 3);
    const stateStr = states.length <= 3
      ? states.join(', ')
      : `${states.join(', ')} and more`;
    const tweet = `Check out the ${flower.commonName} (${flower.scientificName}) — a wildflower native to ${stateStr}. Find native wildflowers for your area 🌸 ${flowerUrl} #NativePlants #Wildflowers #WildHome`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`, '_blank', 'noopener,noreferrer');
  }

  const nativeStatesExpanded = expandNativeStates(flower.nativeStates ?? []);
  const inGarden = isInGarden(flower.id);

  // Fetch media
  useEffect(() => {
    let cancelled = false;
    setMediaLoading(true);
    setMedia(null);
    setImgErr(false);
    fetchFlowerMedia(flower.scientificName, flower.iNaturalistTaxonId)
      .then(m => { if (!cancelled) { setMedia(m); setMediaLoading(false); } })
      .catch(() => { if (!cancelled) setMediaLoading(false); });
    return () => { cancelled = true; };
  }, [flower.scientificName, flower.iNaturalistTaxonId]);

  // Load GeoJSON for mini-map
  useEffect(() => {
    const cached = cacheGet('us_states_geojson');
    if (cached) { setGeoJson(cached); return; }
    fetch('https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json')
      .then(r => r.json())
      .then(data => setGeoJson(data))
      .catch(() => {});
  }, []);

  const dialogRef = useRef(null);

  // Close on Escape + focus trap
  useEffect(() => {
    const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

    function onKey(e) {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab') return;

      const el = dialogRef.current;
      if (!el) return;
      const focusable = Array.from(el.querySelectorAll(FOCUSABLE));
      if (!focusable.length) return;
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
      }
    }

    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';

    // Focus the modal container on open so screen readers announce the dialog
    setTimeout(() => dialogRef.current?.focus(), 50);

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const miniMapStyle = useCallback((feature) => {
    const name = feature.properties?.name ?? '';
    const abbr = STATE_BY_NAME[name.toLowerCase()]?.abbr ?? '';
    return nativeStatesExpanded.includes(abbr)
      ? { fillColor: '#4a7c59', fillOpacity: 0.75, color: '#fff', weight: 1 }
      : { fillColor: '#d4e8d4', fillOpacity: 0.4,  color: '#fff', weight: 0.8 };
  }, [nativeStatesExpanded]);

  async function handlePDF() {
    setExporting(true);
    try {
      await exportFlowerPDF(
        { ...flower, nativeStatesExpanded },
        media?.photoUrl ?? null
      );
    } catch (e) {
      console.error('PDF export failed', e);
    } finally {
      setExporting(false);
    }
  }

  const photoUrl = media?.photoUrl;
  const similarFlowers = (flower.similarFlowers ?? [])
    .map(id => FLOWERS_BY_ID[id])
    .filter(Boolean)
    .slice(0, 3);

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-[2000] flex items-start justify-center bg-black/50 backdrop-blur-sm overflow-y-auto sm:py-4 sm:px-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${flower.commonName} — plant details`}
        tabIndex={-1}
        className="flower-modal-content relative bg-white dark:bg-gray-900 w-full sm:rounded-2xl sm:max-w-3xl sm:my-auto shadow-modal min-h-screen sm:min-h-0 outline-none"
      >

        {/* Close button — 44×44 min tap target */}
        <button
          onClick={onClose}
          aria-label={`Close ${flower.commonName} details`}
          className="absolute top-3 right-3 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
        >
          ✕
        </button>

        {/* Hero photo */}
        <div className="relative h-56 sm:h-72 sm:rounded-t-2xl overflow-hidden bg-forest-100">
          {mediaLoading ? (
            <div className="skeleton w-full h-full" aria-label="Loading photo…" />
          ) : photoUrl && !imgErr ? (
            <img
              src={photoUrl}
              alt={`${flower.commonName} (${flower.scientificName}) in bloom`}
              className="w-full h-full object-cover"
              onError={() => setImgErr(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-forest-100 to-cream-200">
              <span className="text-7xl select-none">🌸</span>
            </div>
          )}
        </div>
        {/* Photo credit beneath image */}
        {!mediaLoading && (
          <p className="text-right text-xs text-gray-400 px-4 pt-1 pb-0 italic">
            {formatPhotoCredit(media?.attribution, media?.licenseCode) ?? 'Photo via iNaturalist'}
          </p>
        )}

        <div className="p-6">

          {/* Title row */}
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div>
              <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-gray-100">{flower.commonName}</h2>
              <p className="text-sm italic text-gray-500 dark:text-gray-400 mt-0.5">{flower.scientificName}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Family: {flower.family}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Garden toggle */}
              <button
                onClick={() => toggleGarden(flower)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  inGarden
                    ? 'bg-terra-500 text-white hover:bg-terra-600'
                    : 'bg-cream-100 text-gray-700 hover:bg-cream-200'
                }`}
              >
                {inGarden ? '★' : '☆'} {inGarden ? 'Saved' : 'Save'}
              </button>
              {/* iNat link */}
              {media?.inatUrl && (
                <a
                  href={media.inatUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-cream-100 text-gray-700 hover:bg-cream-200 transition-colors"
                >
                  🔬 iNaturalist
                </a>
              )}
              {/* Report sighting deep-link */}
              <a
                href={`https://www.inaturalist.org/observations/new?taxon_id=${flower.iNaturalistTaxonId ?? ''}&taxon_name=${encodeURIComponent(flower.scientificName)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-forest-100 text-forest-800 hover:bg-forest-200 transition-colors"
              >
                📸 Report Sighting
              </a>
            </div>
          </div>

          {/* Share row */}
          <div className="share-buttons flex items-center gap-2 mb-4">
            <button
              onClick={handleCopyLink}
              aria-label="Copy link to this flower"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-forest-400 hover:text-forest-700 dark:hover:text-forest-300 transition-colors bg-transparent"
            >
              {copied ? '✅ Copied!' : '🔗 Copy Link'}
            </button>
            <button
              onClick={handleShareX}
              aria-label="Share this flower on X"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors bg-transparent"
            >
              𝕏 Share
            </button>
          </div>

          {/* Status badges row */}
          {(flower.toxicToHumans || flower.toxicToPets || flower.edible || flower.invasiveInSomeStates) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {flower.toxicToHumans && (
                <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-300 text-amber-900 text-xs font-medium px-3 py-1.5 rounded-lg">
                  ⚠️ <span><strong>Toxic to Humans</strong> — keep away from children</span>
                </div>
              )}
              {flower.toxicToPets && (
                <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-300 text-amber-900 text-xs font-medium px-3 py-1.5 rounded-lg">
                  🐾 <span><strong>Toxic to Pets</strong> — harmful to dogs and cats</span>
                </div>
              )}
              {flower.edible && (
                <div
                  className="flex items-center gap-1.5 bg-green-50 border border-green-300 text-green-900 text-xs font-medium px-3 py-1.5 rounded-lg cursor-help"
                  title={flower.edibleNotes ?? 'Parts of this plant are edible — consult foraging guides before consuming.'}
                >
                  🌿 <span><strong>Edible</strong> — hover for details</span>
                </div>
              )}
              {flower.invasiveInSomeStates && (
                <div
                  className="flex items-center gap-1.5 bg-orange-50 border border-orange-300 text-orange-900 text-xs font-medium px-3 py-1.5 rounded-lg cursor-help"
                  title={flower.invasiveNotes ?? 'Can spread aggressively in some conditions or regions.'}
                >
                  ⚠️ <span><strong>Spreads aggressively</strong> in some states</span>
                </div>
              )}
            </div>
          )}

          {/* Description */}
          <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed mb-6">{flower.description}</p>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            {[
              ['Bloom Season', flower.bloomSeason,       '🌼'],
              ['Sun',          `${SUN_ICONS[flower.sunPreference] ?? ''} ${flower.sunPreference}`, ''],
              ['Water',        `${WATER_ICONS[flower.waterNeeds] ?? ''} ${flower.waterNeeds}`, ''],
              ['Height',       flower.height,             '📏'],
              ['Spread',       flower.spread,             '↔️'],
              ['Soil',         flower.soilPreference,     '🪨'],
              ['USDA Zones',   flower.usdaZones,          '🗺️'],
              ['Pollinators',  flower.pollinatorValue,    '🐝'],
            ].map(([label, val]) => (
              <div key={label} className="bg-cream-50 dark:bg-gray-800 rounded-lg p-3 border border-cream-200 dark:border-gray-700">
                <p className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide mb-1">{label}</p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{val}</p>
              </div>
            ))}
          </div>

          {/* Pollinator + conservation badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            <div className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${POLL_COLORS[flower.pollinatorValue]}`}>
              🐝 Pollinator value: {flower.pollinatorValue}
            </div>
            {flower.conservationStatus && (
              <div className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${CONSERVATION_COLORS[flower.conservationStatus] ?? 'bg-gray-100 text-gray-600'}`}>
                {CONSERVATION_ICONS[flower.conservationStatus] ?? '•'} {flower.conservationStatus}
              </div>
            )}
          </div>

          {/* Growing tips */}
          {flower.growingTips && (
            <div className="bg-forest-50 border border-forest-200 rounded-xl p-4 mb-6">
              <h3 className="text-sm font-semibold text-forest-800 mb-2 flex items-center gap-2">
                🌱 Growing Tips
              </h3>
              <p className="text-sm text-forest-900 leading-relaxed">{flower.growingTips}</p>
            </div>
          )}

          {/* Tags */}
          {flower.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-6">
              {flower.tags.map(tag => (
                <span key={tag} className="text-xs px-2.5 py-0.5 bg-cream-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full border border-cream-300 dark:border-gray-600">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Native range section */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              🗺️ Native Range
            </h3>
            {/* Mini map */}
            {geoJson ? (
              <div className="rounded-xl overflow-hidden border border-cream-200 mb-3" style={{ height: '180px' }}>
                <MapContainer
                  center={[38.5, -96]}
                  zoom={3}
                  style={{ height: '180px', width: '100%' }}
                  scrollWheelZoom={false}
                  zoomControl={false}
                  attributionControl={false}
                  dragging={false}
                  doubleClickZoom={false}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    opacity={0.25}
                  />
                  <GeoJSON
                    key={flower.id}
                    data={geoJson}
                    style={miniMapStyle}
                  />
                </MapContainer>
              </div>
            ) : (
              <div className="h-28 rounded-xl bg-cream-100 animate-pulse mb-3" />
            )}
            {/* State list */}
            <p className="text-xs text-gray-500 dark:text-gray-400">
              <span className="font-medium text-gray-700 dark:text-gray-300">Grows natively in: </span>
              {nativeStatesExpanded.length > 0
                ? nativeStatesExpanded.join(', ')
                : 'Range data not available'}
            </p>
          </div>

          {/* Similar flowers */}
          {similarFlowers.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">🌿 Similar Native Flowers</h3>
              <div className="grid grid-cols-3 gap-3">
                {similarFlowers.map(sf => (
                  <SimilarFlowerThumb
                    key={sf.id}
                    flower={sf}
                    onClick={() => onSelectSimilar(sf)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Action bar */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-cream-200 dark:border-gray-700">
            <button
              onClick={handlePDF}
              disabled={exporting}
              className="pdf-button flex items-center gap-2 px-4 py-2 bg-terra-500 hover:bg-terra-600 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {exporting ? (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
              ) : '📄'}
              {exporting ? 'Generating…' : 'Download Planting Guide'}
            </button>
            <button
              onClick={() => window.print()}
              aria-label="Print this flower's planting guide"
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-lg transition-colors"
            >
              🖨 Print
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-cream-100 dark:bg-gray-700 hover:bg-cream-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-lg transition-colors"
            >
              Close
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

// ── Similar flower thumbnail ────────────────────────────────────────────────

function SimilarFlowerThumb({ flower, onClick }) {
  const [media, setMedia] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchFlowerMedia(flower.scientificName, flower.iNaturalistTaxonId)
      .then(m => { if (!cancelled) setMedia(m); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [flower.scientificName, flower.iNaturalistTaxonId]);

  return (
    <button
      onClick={onClick}
      className="group text-left rounded-xl overflow-hidden border border-cream-200 hover:border-forest-400 transition-colors bg-cream-50 hover:bg-white"
    >
      <div className="h-20 overflow-hidden bg-forest-50">
        {media?.thumbUrl ? (
          <img
            src={media.thumbUrl}
            alt={flower.commonName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">🌿</div>
        )}
      </div>
      <div className="p-2">
        <p className="text-xs font-medium text-gray-800 leading-tight line-clamp-2">{flower.commonName}</p>
        <p className="text-xs italic text-gray-400 mt-0.5 truncate">{flower.scientificName}</p>
      </div>
    </button>
  );
}
