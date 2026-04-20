import { useState, useMemo, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { WILDFLOWERS, FLOWERS_BY_ID } from '../data/wildflowers';
import { isApiDown, subscribeApiStatus, resetApiStatus, fetchFlowerMedia } from '../services/iNaturalistService';
import { expandNativeStates, STATE_BY_ABBR } from '../data/stateData';
import { useGarden } from '../App';

import Header          from '../components/Header';
import LocationPicker  from '../components/LocationPicker';
import MapView         from '../components/MapView';
import FilterPanel     from '../components/FilterPanel';
import FlowerCard      from '../components/FlowerCard';
import SkeletonCard    from '../components/SkeletonCard';
import FlowerModal     from '../components/FlowerModal';
import MyGarden        from '../components/MyGarden';
import ComparisonTool  from '../components/ComparisonTool';
import WhyNatives      from '../components/WhyNatives';
import NurseryDirectory from '../components/NurseryDirectory';
import PlantSocieties  from '../components/PlantSocieties';

// Pre-expand nativeStates for every flower once at module load
const FLOWERS_EXPANDED = WILDFLOWERS.map(f => ({
  ...f,
  nativeStatesExpanded: expandNativeStates(f.nativeStates ?? []),
}));

const EMPTY_FILTERS = { bloomSeason: [], color: [], sunPreference: [], waterNeeds: [] };
const MONTHS_FULL = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function Home() {
  const { gardenFlowers, toggleGarden, isInGarden } = useGarden();
  const { flowerId, stateCode } = useParams();
  const navigate = useNavigate();

  // ── Initial loading skeleton ────────────────────────────────────────────────
  const [initialLoad, setInitialLoad] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setInitialLoad(false), 400);
    return () => clearTimeout(t);
  }, []);

  // ── API error state ─────────────────────────────────────────────────────────
  const [apiDown, setApiDown] = useState(isApiDown);
  useEffect(() => subscribeApiStatus(setApiDown), []);
  const [apiRetryKey, setApiRetryKey] = useState(0);

  const handleApiRetry = useCallback(() => {
    resetApiStatus();
    setApiRetryKey(k => k + 1);
  }, []);

  // ── Location ────────────────────────────────────────────────────────────────
  const [location, setLocation] = useState(null);

  // ── Search & filters ────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery]   = useState('');
  const [filters, setFilters]           = useState(EMPTY_FILTERS);
  const [bloomingNowMode, setBloomingNowMode] = useState(false);

  // ── UI state ─────────────────────────────────────────────────────────────────
  const [selectedFlower, setSelectedFlower]   = useState(null);
  const [showGarden, setShowGarden]           = useState(false);
  const [compFlowers, setCompFlowers]         = useState([]);
  const [showComparison, setShowComparison]   = useState(false);
  const [seasonalView, setSeasonalView]       = useState(false);

  // ── Current date ──────────────────────────────────────────────────────────
  const currentMonth    = new Date().getMonth();      // 0-indexed
  const currentMonthNum = currentMonth + 1;           // 1-indexed for bloomMonths
  const currentMonthName = MONTHS_FULL[currentMonth];

  // ── /state/:stateCode route → set location ────────────────────────────────
  useEffect(() => {
    if (!stateCode) return;
    const stateInfo = STATE_BY_ABBR[stateCode.toUpperCase()];
    if (stateInfo) {
      setLocation({
        state: stateInfo.abbr,
        stateName: stateInfo.name,
        displayName: stateInfo.name,
        lat: stateInfo.lat,
        lng: stateInfo.lng,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateCode]);

  // ── When location is first set, default to blooming-now mode ─────────────
  useEffect(() => {
    if (location?.state) {
      setBloomingNowMode(true);
    } else {
      setBloomingNowMode(false);
    }
  }, [location?.state]);

  // ── Filter logic ─────────────────────────────────────────────────────────────
  const filteredFlowers = useMemo(() => {
    let results = FLOWERS_EXPANDED;

    if (location?.state) {
      results = results.filter(f => f.nativeStatesExpanded.includes(location.state));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(f =>
        f.commonName.toLowerCase().includes(q)        ||
        f.scientificName.toLowerCase().includes(q)    ||
        (f.colors ?? []).some(c => c.includes(q))     ||
        (f.tags   ?? []).some(t => t.includes(q))     ||
        f.family?.toLowerCase().includes(q)
      );
    }

    const { bloomSeason, color, sunPreference, waterNeeds } = filters;
    if (bloomSeason.length)    results = results.filter(f => bloomSeason.some(s => f.bloomSeason.includes(s)));
    if (color.length)          results = results.filter(f => color.some(c => (f.colors ?? []).includes(c)));
    if (sunPreference.length)  results = results.filter(f => sunPreference.includes(f.sunPreference));
    if (waterNeeds.length)     results = results.filter(f => waterNeeds.includes(f.waterNeeds));

    return results;
  }, [location, searchQuery, filters]);

  const bloomingNowFlowers = useMemo(() =>
    filteredFlowers.filter(f => (f.bloomMonths ?? []).includes(currentMonthNum)),
    [filteredFlowers, currentMonthNum]
  );

  // What to actually show in the grid
  const displayFlowers = (location && bloomingNowMode) ? bloomingNowFlowers : filteredFlowers;
  const bloomingNowEmpty = location && bloomingNowMode && bloomingNowFlowers.length === 0;

  // ── Map: which states to highlight ──────────────────────────────────────────
  const mapNativeStates = useMemo(() => {
    if (selectedFlower) return selectedFlower.nativeStatesExpanded ?? [];
    return [];
  }, [selectedFlower]);

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleStateClick = useCallback((abbr, name) => {
    setLocation(prev =>
      prev?.state === abbr
        ? null
        : { state: abbr, stateName: name, displayName: name, lat: null, lng: null }
    );
    setSelectedFlower(null);
  }, []);

  const handleSelectFlower = useCallback((flower) => {
    setSelectedFlower(flower);
    navigate(`/flower/${flower.id}`, { replace: false });
  }, [navigate]);

  const handleCloseModal = useCallback(() => {
    setSelectedFlower(null);
    navigate('/', { replace: false });
  }, [navigate]);

  const handleCompareToggle = useCallback((flower) => {
    setCompFlowers(prev => {
      const exists = prev.some(f => f.id === flower.id);
      if (exists) return prev.filter(f => f.id !== flower.id);
      if (prev.length >= 3) return prev;
      return [...prev, flower];
    });
  }, []);

  const handleSearch = useCallback((q) => {
    setSearchQuery(q);
    if (q.trim() && location) setLocation(null);
  }, [location]);

  // ── URL → modal sync (direct link to /flower/:id) ────────────────────────
  useEffect(() => {
    if (flowerId) {
      const flower = FLOWERS_EXPANDED.find(f => f.id === flowerId);
      if (flower) setSelectedFlower(flower);
    } else {
      setSelectedFlower(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flowerId]);

  // ── Seasonal bloom alert (garden flowers) ────────────────────────────────
  const [bloomAlertDismissed, setBloomAlertDismissed] = useState(false);
  const bloomingGardenFlowers = useMemo(() =>
    gardenFlowers.filter(f => (f.bloomMonths ?? []).includes(currentMonthNum)),
    [gardenFlowers, currentMonthNum]
  );

  // ── Seasonal calendar data ────────────────────────────────────────────────
  const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const flowersByMonth = useMemo(() =>
    MONTHS_SHORT.map((month, mi) => ({
      month,
      flowers: filteredFlowers.filter(f => (f.bloomMonths ?? []).includes(mi + 1)),
    })),
    [filteredFlowers]
  );

  // ── SEO meta ─────────────────────────────────────────────────────────────
  const seoTitle = selectedFlower
    ? `${selectedFlower.commonName} — Native Wildflower | WildHome`
    : location?.stateName
    ? `Native Wildflowers of ${location.stateName} | WildHome`
    : 'WildHome — Native Wildflower Finder';

  const seoDesc = selectedFlower
    ? (selectedFlower.description?.slice(0, 155) ?? `Learn about ${selectedFlower.commonName}, a native wildflower.`)
    : location?.stateName
    ? `Discover wildflowers native to ${location.stateName}. Find what to plant in your area with WildHome.`
    : 'WildHome helps you discover native wildflowers growing in your region of the United States.';

  const canonicalUrl = selectedFlower
    ? `https://wildhome.app/flower/${selectedFlower.id}`
    : location?.state
    ? `https://wildhome.app/state/${location.state}`
    : 'https://wildhome.app/';

  // ── First-load landing (no location set) ─────────────────────────────────
  const showLanding = !location && !searchQuery && Object.values(filters).every(a => !a.length);

  return (
    <div className="min-h-screen bg-cream-50">

      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDesc} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://wildhome.app/flower.svg" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDesc} />
      </Helmet>

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <Header
        gardenCount={gardenFlowers.length}
        onGardenOpen={() => setShowGarden(true)}
        searchQuery={searchQuery}
        onSearch={handleSearch}
        flowers={FLOWERS_EXPANDED}
        onSelectFlower={handleSelectFlower}
      />

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      {showLanding ? (
        /* ── First-load landing — no location yet ── */
        <section className="bg-gradient-to-br from-forest-800 via-forest-700 to-forest-600 text-white min-h-[60vh] flex flex-col items-center justify-center py-16 px-4 sm:px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-6xl mb-4 select-none">🌿</div>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-4 leading-tight">
              WildHome
            </h1>
            <p className="text-forest-200 text-lg sm:text-xl mb-8 max-w-xl mx-auto leading-relaxed">
              Discover the wildflowers that belong in your backyard
            </p>
            <div className="max-w-md mx-auto">
              <LocationPicker
                currentLocation={location}
                onLocationResolved={setLocation}
              />
            </div>
            <button
              onClick={() => setLocation({ state: null, stateName: null, displayName: null, lat: null, lng: null, _browse: true })}
              className="mt-6 text-forest-300 hover:text-white text-sm underline underline-offset-2 transition-colors"
            >
              or browse all flowers ↓
            </button>
          </div>
        </section>
      ) : (
        /* ── Location set — compact hero ── */
        <section className="bg-gradient-to-br from-forest-700 via-forest-600 to-forest-800 text-white py-6 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold leading-tight">
                {location?.stateName
                  ? `Native wildflowers of ${location.stateName}`
                  : 'Native wildflowers near you'}
              </h1>
              <p className="text-forest-200 text-sm mt-1">
                Find plants that belong here — beautiful and vital for local wildlife.
              </p>
            </div>
            <div className="flex-shrink-0">
              <LocationPicker
                currentLocation={location}
                onLocationResolved={setLocation}
              />
            </div>
          </div>
        </section>
      )}

      {/* ── Main content ────────────────────────────────────────────────────── */}
      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Flower of the Week */}
        <FlowerOfTheWeek onSelect={handleSelectFlower} />

        {/* Map + flower grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">

          {/* Map panel — 2/5 on desktop */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-20">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-gray-700">
                  {selectedFlower
                    ? `Native range: ${selectedFlower.commonName}`
                    : location?.stateName
                    ? `Flowers native to ${location.stateName}`
                    : 'Click a state to explore'}
                </h2>
                {selectedFlower && (
                  <button
                    onClick={() => setSelectedFlower(null)}
                    className="text-xs text-gray-500 hover:text-gray-700 underline"
                  >
                    ← Back to state view
                  </button>
                )}
              </div>
              <MapView
                currentState={location?.state ?? null}
                selectedFlower={selectedFlower}
                nativeStates={mapNativeStates}
                onStateClick={handleStateClick}
              />
              {/* Comparison bar */}
              {compFlowers.length > 0 && (
                <div className="mt-3 bg-white rounded-xl border border-forest-200 p-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">⚖</span>
                    <span className="text-sm font-medium text-gray-700">
                      {compFlowers.length} flower{compFlowers.length > 1 ? 's' : ''} selected
                    </span>
                    <span className="text-xs text-gray-400">(max 3)</span>
                  </div>
                  <button
                    onClick={() => setShowComparison(true)}
                    disabled={compFlowers.length < 2}
                    className="w-full sm:w-auto min-h-[44px] px-3 py-1.5 bg-forest-600 hover:bg-forest-700 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors"
                  >
                    Compare →
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Flowers panel — 3/5 on desktop */}
          <div className="lg:col-span-3">

            {/* API error banner */}
            {apiDown && (
              <div className="mb-4 flex items-start gap-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl px-4 py-3 text-sm">
                <span className="text-base leading-none mt-0.5">⚠️</span>
                <div className="flex-1">
                  <p className="font-medium">Live photos and sighting data are temporarily unavailable.</p>
                  <p className="text-amber-700 text-xs mt-0.5">Showing local plant information instead. All flower descriptions and filters still work.</p>
                </div>
                <button
                  onClick={handleApiRetry}
                  className="shrink-0 text-xs font-medium px-2.5 py-1.5 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg transition-colors"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Seasonal bloom alert banner (garden flowers) */}
            {!bloomAlertDismissed && bloomingGardenFlowers.length > 0 && (
              <div className="mb-4 flex items-start gap-3 bg-green-50 border border-green-200 text-green-900 rounded-xl px-4 py-3 text-sm">
                <span className="text-base leading-none mt-0.5">🌸</span>
                <div className="flex-1">
                  <p className="font-medium">
                    {bloomingGardenFlowers.length === 1
                      ? `${bloomingGardenFlowers[0].commonName} in your garden is blooming right now!`
                      : `${bloomingGardenFlowers.length} flowers in your garden are blooming right now!`}
                  </p>
                  <p className="text-green-700 text-xs mt-0.5 truncate">
                    {bloomingGardenFlowers.map(f => f.commonName).join(' · ')}
                  </p>
                </div>
                <button
                  onClick={() => setBloomAlertDismissed(true)}
                  aria-label="Dismiss bloom alert"
                  className="shrink-0 text-green-500 hover:text-green-700 transition-colors"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Filter panel */}
            <div className="mb-4">
              <FilterPanel
                filters={filters}
                onChange={setFilters}
                resultCount={filteredFlowers.length}
                totalCount={FLOWERS_EXPANDED.length}
              />
            </div>

            {/* View header row */}
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <h2 className="text-base font-semibold text-gray-800">
                {bloomingNowEmpty
                  ? `Nothing blooming in ${location?.stateName} this month`
                  : location && bloomingNowMode
                  ? `🌸 Blooming now in ${location.stateName}`
                  : location?.stateName
                  ? `Wildflowers native to ${location.stateName}`
                  : searchQuery
                  ? `Results for "${searchQuery}"`
                  : 'All Native Wildflowers'}
                <span className="ml-2 text-sm font-normal text-gray-400">
                  ({(bloomingNowEmpty ? filteredFlowers : displayFlowers).length})
                </span>
              </h2>

              <div className="flex items-center gap-2">
                {/* Blooming Now toggle — only when location is set */}
                {location?.state && !searchQuery && (
                  <div className="flex rounded-lg overflow-hidden border border-gray-200 text-xs">
                    <button
                      onClick={() => setBloomingNowMode(true)}
                      className={`px-2.5 py-1.5 transition-colors ${bloomingNowMode ? 'bg-green-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                      🌸 Blooming Now
                    </button>
                    <button
                      onClick={() => setBloomingNowMode(false)}
                      className={`px-2.5 py-1.5 border-l border-gray-200 transition-colors ${!bloomingNowMode ? 'bg-forest-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                      All Natives
                    </button>
                  </div>
                )}

                {/* Seasonal view toggle */}
                <button
                  onClick={() => setSeasonalView(v => !v)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                    seasonalView
                      ? 'bg-forest-600 text-white border-forest-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-forest-400'
                  }`}
                >
                  {seasonalView ? '📋 Grid' : '📅 Seasonal'}
                </button>
              </div>
            </div>

            {/* Nothing-blooming-now notice */}
            {bloomingNowEmpty && (
              <div className="mb-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-xl px-4 py-3 text-sm">
                Nothing is blooming in {location.stateName} in {currentMonthName} — showing all native flowers for your area.
              </div>
            )}

            {/* Disclaimer */}
            <p className="text-xs text-gray-400 mb-3 leading-relaxed">
              Plant information is provided as a general guide. Always verify
              native status with your local{' '}
              <a
                href="https://www.nifa.usda.gov/land-grant-colleges-and-universities-partner-website-directory"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-gray-600"
              >
                cooperative extension office
              </a>
              {' '}or state native plant society before planting.
            </p>

            {seasonalView ? (
              <SeasonalCalendar
                flowersByMonth={flowersByMonth}
                currentMonth={currentMonth}
                onSelectFlower={handleSelectFlower}
              />
            ) : initialLoad ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : (bloomingNowEmpty ? filteredFlowers : displayFlowers).length === 0 ? (
              <EmptyState
                hasLocation={!!location}
                hasFilters={searchQuery || Object.values(filters).some(a => a.length)}
                onClearFilters={() => { setFilters(EMPTY_FILTERS); setSearchQuery(''); }}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {(bloomingNowEmpty ? filteredFlowers : displayFlowers).map(flower => (
                  <FlowerCard
                    key={`${flower.id}-${apiRetryKey}`}
                    flower={flower}
                    onSelect={handleSelectFlower}
                    onGardenToggle={toggleGarden}
                    inGarden={isInGarden(flower.id)}
                    inComparison={compFlowers.some(f => f.id === flower.id)}
                    onCompareToggle={handleCompareToggle}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Why natives section */}
        <div id="why-natives" className="mt-8 -mx-4 sm:-mx-6 lg:-mx-8">
          <WhyNatives />
        </div>

        {/* Nursery directory */}
        <div id="nurseries" className="mt-0 -mx-4 sm:-mx-6 lg:-mx-8">
          <NurseryDirectory />
        </div>

        {/* Plant societies */}
        <div id="plant-societies" className="-mx-4 sm:-mx-6 lg:-mx-8">
          <PlantSocieties />
        </div>

      </main>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="bg-forest-900 text-forest-300 py-8 px-6 text-center text-sm">
        <p className="mb-1">
          <span className="font-serif font-semibold text-white">WildHome</span>
          {' '} · Built with data from{' '}
          <a href="https://www.inaturalist.org" className="underline hover:text-white" target="_blank" rel="noopener noreferrer">iNaturalist</a>
          ,{' '}
          <a href="https://plants.usda.gov" className="underline hover:text-white" target="_blank" rel="noopener noreferrer">USDA PLANTS</a>
          , and{' '}
          <a href="https://www.openstreetmap.org" className="underline hover:text-white" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>
        </p>
        <p className="text-forest-400 text-xs">
          All map data © OpenStreetMap contributors. Plant data © iNaturalist contributors (CC-BY). No API keys required.
        </p>
        <p className="text-forest-500 text-xs mt-2">
          © {new Date().getFullYear()} WildHome ·{' '}
          <a href="/privacy" className="underline hover:text-forest-300">Privacy Policy</a>
          {' · '}
          <a href="/invasive-alternatives" className="underline hover:text-forest-300">Invasive Alternatives</a>
          {' · '}
          <a href="/planting-calendar" className="underline hover:text-forest-300">Planting Calendar</a>
        </p>
      </footer>

      {/* ── Modals / overlays ───────────────────────────────────────────────── */}
      {selectedFlower && (
        <FlowerModal
          flower={selectedFlower}
          onClose={handleCloseModal}
          onSelectSimilar={(f) => { setSelectedFlower(f); navigate(`/flower/${f.id}`, { replace: true }); }}
        />
      )}

      {showGarden && (
        <MyGarden
          onClose={() => setShowGarden(false)}
          onSelectFlower={handleSelectFlower}
        />
      )}

      {showComparison && compFlowers.length >= 2 && (
        <ComparisonTool
          flowers={compFlowers}
          onRemoveFlower={(id) => setCompFlowers(prev => prev.filter(f => f.id !== id))}
          onClose={() => setShowComparison(false)}
        />
      )}
    </div>
  );
}

// ── Empty state ────────────────────────────────────────────────────────────────

// ── Flower of the Week ────────────────────────────────────────────────────────

function FlowerOfTheWeek({ onSelect }) {
  const [media, setMedia]               = useState(null);
  const [mediaLoading, setMediaLoading] = useState(true);
  const [imgErr, setImgErr]             = useState(false);

  // Deterministic week seed — same flower all week, rotates every Monday
  const weekNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  const flower     = FLOWERS_EXPANDED[weekNumber % FLOWERS_EXPANDED.length];

  useEffect(() => {
    let cancelled = false;
    fetchFlowerMedia(flower.scientificName, flower.iNaturalistTaxonId)
      .then(m => { if (!cancelled) { setMedia(m); setMediaLoading(false); } })
      .catch(() => { if (!cancelled) setMediaLoading(false); });
    return () => { cancelled = true; };
  }, [flower.scientificName, flower.iNaturalistTaxonId]);

  const photo = media?.photoUrl;
  const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const bloomMonthNames = (flower.bloomMonths ?? []).map(m => MONTH_NAMES[m - 1]).join(', ');

  return (
    <div className="mb-6 rounded-2xl overflow-hidden border border-forest-200 shadow-sm bg-white">
      {/* Label bar */}
      <div className="bg-forest-600 text-white px-5 py-2 text-xs font-semibold tracking-wide flex items-center gap-2">
        <span>🌸</span> Flower of the Week
      </div>

      <div className="flex flex-col sm:flex-row">
        {/* Photo */}
        <div className="relative sm:w-64 h-48 sm:h-auto flex-shrink-0 bg-forest-50">
          {mediaLoading ? (
            <div className="skeleton w-full h-full" />
          ) : photo && !imgErr ? (
            <img
              src={photo}
              alt={`${flower.commonName} (${flower.scientificName}) in bloom`}
              className="w-full h-full object-cover"
              onError={() => setImgErr(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl select-none">
              🌸
            </div>
          )}
          {/* Toxicity badge */}
          {(flower.toxicToHumans || flower.toxicToPets) && (
            <span className="absolute bottom-2 left-2 bg-amber-100 border border-amber-300 text-amber-800 text-xs font-medium px-1.5 py-0.5 rounded-full flex items-center gap-1">
              ⚠️ {flower.toxicToHumans && flower.toxicToPets ? 'Toxic' : flower.toxicToHumans ? 'Human' : 'Pets'}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col justify-between flex-1">
          <div>
            <h2 className="text-xl font-serif font-bold text-gray-900 leading-tight">
              {flower.commonName}
            </h2>
            <p className="text-sm italic text-gray-400 mb-3">{flower.scientificName}</p>
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
              {flower.description}
            </p>
          </div>

          {/* Badges + CTA */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {flower.bloomSeason && (
              <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full">
                🌼 {flower.bloomSeason}
              </span>
            )}
            {bloomMonthNames && (
              <span className="text-xs bg-cream-100 text-gray-600 px-2.5 py-1 rounded-full">
                📅 {bloomMonthNames}
              </span>
            )}
            {flower.nativeStatesExpanded?.length > 0 && (
              <span className="text-xs bg-forest-50 text-forest-700 px-2.5 py-1 rounded-full">
                🗺 {flower.nativeStatesExpanded.length} states
              </span>
            )}
            <button
              onClick={() => onSelect(flower)}
              className="ml-auto text-sm font-medium px-4 py-2 bg-forest-600 hover:bg-forest-700 text-white rounded-xl transition-colors"
            >
              Learn More →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Empty state ────────────────────────────────────────────────────────────────

function EmptyState({ hasLocation, hasFilters, onClearFilters }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-4 bg-white rounded-xl border border-cream-200">
      <span className="text-5xl">🌾</span>
      <div>
        <p className="text-gray-700 font-medium text-base">No flowers match those filters</p>
        <p className="text-gray-400 text-sm mt-1 max-w-xs">
          {hasFilters
            ? 'Try removing a filter or broadening your search.'
            : hasLocation
            ? "We don't have flowers catalogued for that location yet — try exploring nearby states on the map."
            : 'Enter your location above to find flowers native to your area.'}
        </p>
      </div>
      {hasFilters && (
        <button
          onClick={onClearFilters}
          className="px-4 py-2 bg-forest-600 hover:bg-forest-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}

// ── Seasonal calendar ─────────────────────────────────────────────────────────

function SeasonalCalendar({ flowersByMonth, currentMonth, onSelectFlower }) {
  const SEASON_BG = [
    'bg-blue-50 border-blue-200',
    'bg-blue-50 border-blue-200',
    'bg-green-50 border-green-200',
    'bg-green-100 border-green-300',
    'bg-lime-50 border-lime-200',
    'bg-yellow-50 border-yellow-200',
    'bg-yellow-100 border-yellow-300',
    'bg-orange-50 border-orange-200',
    'bg-orange-100 border-orange-300',
    'bg-amber-100 border-amber-300',
    'bg-red-50 border-red-200',
    'bg-blue-50 border-blue-200',
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {flowersByMonth.map(({ month, flowers }, mi) => (
        <div
          key={month}
          className={`rounded-xl border p-3 ${SEASON_BG[mi]} ${mi === currentMonth ? 'ring-2 ring-terra-400' : ''}`}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide">
              {month}
              {mi === currentMonth && <span className="ml-1.5 text-terra-500">← Now</span>}
            </h3>
            <span className="text-xs text-gray-400">{flowers.length}</span>
          </div>
          {flowers.length === 0 ? (
            <p className="text-xs text-gray-400 italic">None blooming</p>
          ) : (
            <ul className="space-y-1">
              {flowers.slice(0, 5).map(f => (
                <li key={f.id}>
                  <button
                    onClick={() => onSelectFlower(f)}
                    className="text-xs text-gray-700 hover:text-forest-700 hover:underline text-left truncate w-full"
                  >
                    {f.commonName}
                  </button>
                </li>
              ))}
              {flowers.length > 5 && (
                <li className="text-xs text-gray-400">+{flowers.length - 5} more</li>
              )}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
