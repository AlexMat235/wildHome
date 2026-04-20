import { useState, useMemo } from 'react';

const NURSERIES = [
  // ── National / Online ──────────────────────────────────────────────────────
  {
    id: 'prairie-nursery',
    name: 'Prairie Nursery',
    region: 'National / Online',
    url: 'https://www.prairienursery.com',
    description: 'Specializes in native prairie plants and seed mixes; a leader in ecological restoration since 1972.',
    shipsNationally: true,
  },
  {
    id: 'american-meadows',
    name: 'American Meadows',
    region: 'National / Online',
    url: 'https://www.americanmeadows.com',
    description: 'Wide selection of native wildflower seeds and plants shipped throughout the US.',
    shipsNationally: true,
  },
  {
    id: 'izel-plants',
    name: 'Izel Native Plants',
    region: 'National / Online',
    url: 'https://www.izelplants.com',
    description: 'Curated native plants for pollinators, shipped in compostable packaging to all 48 contiguous states.',
    shipsNationally: true,
  },
  {
    id: 'nearly-native',
    name: 'Nearly Native Nursery',
    region: 'National / Online',
    url: 'https://www.nearlynativenursery.com',
    description: 'Southeast-focused but ships native perennials, grasses, and shrubs nationally.',
    shipsNationally: true,
  },

  // ── Northeast ─────────────────────────────────────────────────────────────
  {
    id: 'native-plant-trust',
    name: 'Native Plant Trust',
    region: 'Northeast',
    url: 'https://www.nativeplanttrust.org',
    description: "New England's foremost native plant conservation organization, operating Go Native nurseries in Massachusetts.",
    shipsNationally: false,
  },
  {
    id: 'crickethill',
    name: 'Cricket Hill Garden',
    region: 'Northeast',
    url: 'https://www.treepeony.com/native-plants',
    description: 'Connecticut nursery with a curated selection of native perennials for northeast gardens.',
    shipsNationally: false,
  },
  {
    id: 'pinelands-nursery',
    name: 'Pinelands Nursery',
    region: 'Northeast',
    url: 'https://www.pinelandsnursery.com',
    description: 'New Jersey specialist in native plants grown from locally-sourced seed stock for the Mid-Atlantic and Northeast.',
    shipsNationally: false,
  },
  {
    id: 'gilbertson',
    name: 'Gilbertson Native Grasses & Wildflowers',
    region: 'Northeast',
    url: 'https://gilbertsonnativegrasses.com',
    description: 'Pennsylvania nursery specializing in native grasses and wildflowers for Northeast habitats.',
    shipsNationally: false,
  },

  // ── Southeast ─────────────────────────────────────────────────────────────
  {
    id: 'woodlanders',
    name: 'Woodlanders Inc.',
    region: 'Southeast',
    url: 'https://www.woodlanders.net',
    description: 'South Carolina nursery with one of the largest selections of Southeast native trees, shrubs, and perennials.',
    shipsNationally: false,
  },
  {
    id: 'florida-native-plant',
    name: 'Florida Native Plant Society Nurseries',
    region: 'Southeast',
    url: 'https://www.fnps.org/nurseries',
    description: 'Directory of Florida native plant nurseries recommended by the Florida Native Plant Society.',
    shipsNationally: false,
  },
  {
    id: 'native-landscapes',
    name: 'Native Landscapes & Garden Center',
    region: 'Southeast',
    url: 'https://nativelandscapesnursery.com',
    description: 'Georgia-based nursery focused on Southeast native plants for wildlife gardens and ecological landscaping.',
    shipsNationally: false,
  },
  {
    id: 'longleaf',
    name: 'Longleaf Botanical Gardens Nursery',
    region: 'Southeast',
    url: 'https://longleafbotanical.com',
    description: 'Alabama native plant nursery specializing in species of the Coastal Plain and Appalachian foothills.',
    shipsNationally: false,
  },

  // ── Midwest ───────────────────────────────────────────────────────────────
  {
    id: 'ion-exchange',
    name: 'Ion Exchange',
    region: 'Midwest',
    url: 'https://ionxchange.com',
    description: 'Iowa-based source for native plants and seeds for prairie and woodland restoration projects.',
    shipsNationally: true,
  },
  {
    id: 'shooting-star',
    name: 'Shooting Star Nursery',
    region: 'Midwest',
    url: 'https://shootingstarnursery.com',
    description: 'Kentucky nursery specializing in native plants of the Midwest and central Appalachians.',
    shipsNationally: false,
  },
  {
    id: 'birds-and-bees',
    name: 'Birds & Bees Wildflower Farm',
    region: 'Midwest',
    url: 'https://birdsandbeesnativeplants.com',
    description: 'Minnesota native plant farm focused on pollinator habitat plants for Upper Midwest conditions.',
    shipsNationally: false,
  },
  {
    id: 'possibility-place',
    name: 'The Possibility Place Nursery',
    region: 'Midwest',
    url: 'https://www.possibilityplace.com',
    description: 'Illinois wholesale and retail native plant nursery with extensive Midwestern prairie species.',
    shipsNationally: false,
  },

  // ── Southwest ─────────────────────────────────────────────────────────────
  {
    id: 'high-country-gardens',
    name: 'High Country Gardens',
    region: 'Southwest',
    url: 'https://www.highcountrygardens.com',
    description: 'New Mexico nursery specializing in water-wise native and adaptive plants for the arid West.',
    shipsNationally: true,
  },
  {
    id: 'desert-survivors',
    name: 'Desert Survivors',
    region: 'Southwest',
    url: 'https://www.desertsurvivors.org',
    description: 'Tucson nonprofit nursery growing native Sonoran Desert plants from locally-collected seed.',
    shipsNationally: false,
  },
  {
    id: 'albuquerque-natives',
    name: 'Agua Fria Nursery',
    region: 'Southwest',
    url: 'https://aguafrianursery.com',
    description: 'Santa Fe nursery dedicated entirely to plants native to New Mexico and the Southwest.',
    shipsNationally: false,
  },
  {
    id: 'wildtype',
    name: 'Wildtype Native Plant Nursery',
    region: 'Southwest',
    url: 'https://wildtypenatives.com',
    description: 'Texas Hill Country nursery with a focus on drought-tolerant natives for the Edwards Plateau.',
    shipsNationally: false,
  },

  // ── Pacific Northwest ─────────────────────────────────────────────────────
  {
    id: 'oaks-and-prairies',
    name: 'Oaks and Prairies Native Plant Nursery',
    region: 'Pacific Northwest',
    url: 'https://www.oaksandprairies.com',
    description: 'Oregon nursery focused on native plants for Willamette Valley habitats and backyard wildlife gardens.',
    shipsNationally: false,
  },
  {
    id: 'sound-native-plants',
    name: 'Sound Native Plants',
    region: 'Pacific Northwest',
    url: 'https://soundnativeplants.com',
    description: 'Olympia, Washington wholesale nursery growing Pacific Northwest natives from regional seed sources.',
    shipsNationally: false,
  },
  {
    id: 'naturescape',
    name: 'NatureScape Nursery',
    region: 'Pacific Northwest',
    url: 'https://naturescapenursery.com',
    description: 'Portland-area native plant nursery offering species suited to Pacific Northwest rain gardens and woodland edges.',
    shipsNationally: false,
  },
  {
    id: 'colvos-creek',
    name: 'Colvos Creek Nursery',
    region: 'Pacific Northwest',
    url: 'https://colvcreek.com',
    description: 'Washington State nursery specializing in unusual native and near-native species for the maritime Pacific Northwest.',
    shipsNationally: false,
  },

  // ── Mountain West ─────────────────────────────────────────────────────────
  {
    id: 'plants-of-the-southwest',
    name: 'Plants of the Southwest',
    region: 'Mountain West',
    url: 'https://www.plantsofthesouthwest.com',
    description: 'New Mexico nursery and seed company with extensive stock for Rocky Mountain and Great Basin gardens.',
    shipsNationally: true,
  },
  {
    id: 'colorado-native-plant',
    name: 'Colorado Native Plant Society Plant Sales',
    region: 'Mountain West',
    url: 'https://conps.org/plant-sales/',
    description: 'Annual plant sales organized by the Colorado Native Plant Society featuring regionally appropriate species.',
    shipsNationally: false,
  },
  {
    id: 'western-native-seed',
    name: 'Western Native Seed',
    region: 'Mountain West',
    url: 'https://www.westernnativeseed.com',
    description: 'Colorado seed company specializing in native wildflower and grass seed mixes for the Mountain West.',
    shipsNationally: true,
  },
  {
    id: 'utah-native-plant',
    name: 'Utah Native Plant Society Nursery',
    region: 'Mountain West',
    url: 'https://www.unps.org',
    description: 'Utah Native Plant Society resources and plant sales for Great Basin and Intermountain natives.',
    shipsNationally: false,
  },
];

const REGIONS = ['All Regions', 'National / Online', 'Northeast', 'Southeast', 'Midwest', 'Southwest', 'Pacific Northwest', 'Mountain West'];

export default function NurseryDirectory() {
  const [search, setSearch]           = useState('');
  const [shipsOnly, setShipsOnly]     = useState(false);
  const [activeRegion, setActiveRegion] = useState('All Regions');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return NURSERIES.filter(n => {
      if (shipsOnly && !n.shipsNationally) return false;
      if (activeRegion !== 'All Regions' && n.region !== activeRegion) return false;
      if (q && !n.name.toLowerCase().includes(q) && !n.region.toLowerCase().includes(q) && !n.description.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [search, shipsOnly, activeRegion]);

  // Group by region in display order
  const displayRegions = REGIONS.slice(1).filter(r =>
    activeRegion === 'All Regions' ? filtered.some(n => n.region === r) : r === activeRegion
  );

  return (
    <section className="bg-cream-50 dark:bg-gray-900 py-16 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-3">
            Native Plant Nurseries
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-base">
            Find reputable nurseries that specialize in native plants for your region.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search nurseries…"
            className="flex-1 px-4 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-400"
            aria-label="Search nurseries"
          />
          <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2">
            <input
              type="checkbox"
              checked={shipsOnly}
              onChange={e => setShipsOnly(e.target.checked)}
              className="accent-forest-600 w-4 h-4"
            />
            Ships nationally only
          </label>
        </div>

        {/* Region tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {REGIONS.map(r => (
            <button
              key={r}
              onClick={() => setActiveRegion(r)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                activeRegion === r
                  ? 'bg-forest-600 text-white border-forest-600'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-forest-400'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-10">No nurseries match your filters.</p>
        ) : (
          <div className="space-y-8">
            {displayRegions.map(region => {
              const group = filtered.filter(n => n.region === region);
              if (!group.length) return null;
              return (
                <div key={region}>
                  <h3 className="text-sm font-semibold text-forest-700 dark:text-forest-300 uppercase tracking-wide mb-3 pb-1 border-b border-cream-200 dark:border-gray-700">
                    {region}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {group.map(n => (
                      <div key={n.id} className="bg-white dark:bg-gray-800 rounded-xl border border-cream-200 dark:border-gray-700 p-4 flex flex-col gap-2 hover:border-forest-300 dark:hover:border-forest-500 transition-colors">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-snug">{n.name}</h4>
                          {n.shipsNationally && (
                            <span className="flex-shrink-0 text-xs bg-forest-50 text-forest-700 border border-forest-200 px-2 py-0.5 rounded-full">
                              Ships nationally
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed flex-1">{n.description}</p>
                        <a
                          href={n.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="self-start text-xs font-medium px-3 py-1.5 bg-forest-600 hover:bg-forest-700 text-white rounded-lg transition-colors"
                          aria-label={`Visit ${n.name} website`}
                        >
                          Visit Nursery ↗
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Disclaimer */}
        <p className="mt-8 text-xs text-gray-400 text-center">
          WildHome is not affiliated with any listed nursery. Links are provided as a resource only.
        </p>
      </div>
    </section>
  );
}
