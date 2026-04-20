import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const INVASIVES = [
  {
    id: 'english-ivy',
    invasiveName: 'English Ivy',
    scientificName: 'Hedera helix',
    problem: 'Forms dense ground cover that smothers native understory plants and climbs trees, eventually killing them.',
    regions: ['Northeast', 'Southeast', 'Pacific Northwest'],
    alternatives: [
      { id: 'wild-ginger', name: 'Wild Ginger', note: 'Low-growing native ground cover for shaded woodland gardens' },
      { id: 'trout-lily', name: 'Trout Lily', note: 'Spring ephemeral that carpets woodland floors' },
      { id: 'blue-phlox', name: 'Blue Phlox', note: 'Spreads gently in shade and blooms in spring' },
    ],
  },
  {
    id: 'purple-loosestrife',
    invasiveName: 'Purple Loosestrife',
    scientificName: 'Lythrum salicaria',
    problem: 'Invades wetlands and riverbanks, forming monocultures that displace native marsh vegetation.',
    regions: ['Northeast', 'Midwest', 'Mountain West'],
    alternatives: [
      { id: 'swamp-rose-mallow', name: 'Swamp Rose Mallow', note: 'Tall native wetland plant with large pink flowers' },
      { id: 'swamp-milkweed', name: 'Swamp Milkweed', note: 'Wetland native that supports monarch butterflies' },
      { id: 'cardinal-flower', name: 'Cardinal Flower', note: 'Brilliant red wetland native loved by hummingbirds' },
    ],
  },
  {
    id: 'japanese-honeysuckle',
    invasiveName: 'Japanese Honeysuckle',
    scientificName: 'Lonicera japonica',
    problem: 'Aggressive vine that overtops and kills native shrubs and young trees throughout the eastern US.',
    regions: ['Northeast', 'Southeast', 'Midwest'],
    alternatives: [
      { id: 'cardinal-flower', name: 'Cardinal Flower', note: 'Provides similar tubular flowers attractive to hummingbirds' },
      { id: 'wild-columbine', name: 'Wild Columbine', note: 'Delicate native with nectar-rich flowers for pollinators' },
      { id: 'blue-wild-indigo', name: 'Blue Wild Indigo', note: 'Shrubby native that fills vertical space without climbing' },
    ],
  },
  {
    id: 'garlic-mustard',
    invasiveName: 'Garlic Mustard',
    scientificName: 'Alliaria petiolata',
    problem: 'Allelopathic herb that inhibits native plant germination by releasing chemicals into the soil.',
    regions: ['Northeast', 'Midwest', 'Southeast'],
    alternatives: [
      { id: 'wild-ginger', name: 'Wild Ginger', note: 'Low native that competes effectively in the same woodland niche' },
      { id: 'blue-phlox', name: 'Blue Phlox', note: 'Spring-blooming native that fills open woodland edges' },
      { id: 'may-apple', name: 'May Apple', note: 'Large-leafed native that shades out garlic mustard competition' },
    ],
  },
  {
    id: 'kudzu',
    invasiveName: 'Kudzu',
    scientificName: 'Pueraria montana var. lobata',
    problem: 'Grows up to a foot per day, smothering entire trees and structures; called "the vine that ate the South."',
    regions: ['Southeast', 'Midwest'],
    alternatives: [
      { id: 'blue-wild-indigo', name: 'Blue Wild Indigo', note: 'Native legume that fixes nitrogen without spreading invasively' },
      { id: 'wild-lupine', name: 'Wild Lupine', note: 'Native legume with striking blue-purple flower spikes' },
      { id: 'butterfly-weed', name: 'Butterfly Weed', note: 'Robust native that fills disturbed areas and feeds monarchs' },
    ],
  },
  {
    id: 'japanese-knotweed',
    invasiveName: 'Japanese Knotweed',
    scientificName: 'Reynoutria japonica',
    problem: 'Hollow-stemmed shrub that spreads through fragmented rhizomes and can even grow through concrete.',
    regions: ['Northeast', 'Pacific Northwest', 'Midwest'],
    alternatives: [
      { id: 'joe-pye-weed', name: 'Joe-Pye Weed', note: 'Tall native with similar stature and late-season blooms' },
      { id: 'swamp-rose-mallow', name: 'Swamp Rose Mallow', note: 'Large native shrub that fills riparian zones without spreading' },
      { id: 'canada-goldenrod', name: 'Canada Goldenrod', note: 'Tall native that provides wildlife food in disturbed areas' },
    ],
  },
  {
    id: 'autumn-olive',
    invasiveName: 'Autumn Olive',
    scientificName: 'Elaeagnus umbellata',
    problem: 'Nitrogen-fixing shrub that alters soil chemistry and produces prolific berries spread by birds.',
    regions: ['Northeast', 'Midwest', 'Southeast'],
    alternatives: [
      { id: 'obedient-plant', name: 'Obedient Plant', note: 'Spreads gently and provides similar late-season blooms' },
      { id: 'canada-goldenrod', name: 'Canada Goldenrod', note: 'Provides similar fall interest without altering soil nitrogen' },
      { id: 'new-england-aster', name: 'New England Aster', note: 'Large native with prolific fall blooms for pollinators' },
    ],
  },
  {
    id: 'burning-bush',
    invasiveName: 'Burning Bush',
    scientificName: 'Euonymus alatus',
    problem: 'Popular landscape shrub whose berries are spread by birds into woodlands, displacing native understory.',
    regions: ['Northeast', 'Midwest', 'Southeast'],
    alternatives: [
      { id: 'bottle-gentian', name: 'Bottle Gentian', note: 'Native with striking fall color and unique closed flowers' },
      { id: 'new-england-aster', name: 'New England Aster', note: 'Vivid purple fall blooms for similar seasonal interest' },
      { id: 'blazing-star', name: 'Blazing Star', note: 'Vertical spikes of magenta add drama without invasive spread' },
    ],
  },
  {
    id: 'norway-maple',
    invasiveName: 'Norway Maple',
    scientificName: 'Acer platanoides',
    problem: 'Produces dense shade and allelopathic litter that prevents native plants from establishing beneath it.',
    regions: ['Northeast', 'Midwest'],
    alternatives: [
      { id: 'bloodroot', name: 'Bloodroot', note: 'Native spring ephemeral that grows well beneath open canopies' },
      { id: 'virginia-bluebells', name: 'Virginia Bluebells', note: 'Early bloomer perfect for under-tree planting' },
      { id: 'trout-lily', name: 'Trout Lily', note: 'Thrives in dappled shade beneath deciduous trees' },
    ],
  },
  {
    id: 'common-buckthorn',
    invasiveName: 'Common Buckthorn',
    scientificName: 'Rhamnus cathartica',
    problem: 'Forms dense thickets that shade out native understory; berries act as a laxative, spreading seeds widely.',
    regions: ['Midwest', 'Northeast'],
    alternatives: [
      { id: 'wild-bergamot', name: 'Wild Bergamot', note: 'Bushy native that fills similar spaces with lavender blooms' },
      { id: 'obedient-plant', name: 'Obedient Plant', note: 'Dense-growing native that naturalizes without becoming invasive' },
      { id: 'blazing-star', name: 'Blazing Star', note: 'Tall prairie native that establishes where buckthorn is removed' },
    ],
  },
  {
    id: 'oriental-bittersweet',
    invasiveName: 'Oriental Bittersweet',
    scientificName: 'Celastrus orbiculatus',
    problem: 'Vigorous vine that girdles trees and shrubs, killing them; commonly spread through holiday wreaths.',
    regions: ['Northeast', 'Midwest', 'Southeast'],
    alternatives: [
      { id: 'wild-columbine', name: 'Wild Columbine', note: 'Delicate native that climbs gently and supports hummingbirds' },
      { id: 'cardinal-flower', name: 'Cardinal Flower', note: 'Upright native with the same "pop" of color in fall gardens' },
      { id: 'bottle-gentian', name: 'Bottle Gentian', note: 'Late-season native with vivid color in moist woodland edges' },
    ],
  },
  {
    id: 'phragmites',
    invasiveName: 'Common Reed (Invasive)',
    scientificName: 'Phragmites australis (non-native haplotype)',
    problem: 'Displaces native marsh plants and reduces wildlife habitat in wetlands across the continent.',
    regions: ['Northeast', 'Midwest', 'Southeast', 'Mountain West'],
    alternatives: [
      { id: 'swamp-rose-mallow', name: 'Swamp Rose Mallow', note: 'Tall wetland native that can compete in restored marshes' },
      { id: 'swamp-milkweed', name: 'Swamp Milkweed', note: 'Native wetland species important for monarch butterflies' },
      { id: 'cardinal-flower', name: 'Cardinal Flower', note: 'Striking red native for wet edges and stream margins' },
    ],
  },
  {
    id: 'yellow-iris',
    invasiveName: 'Yellow Flag Iris',
    scientificName: 'Iris pseudacorus',
    problem: 'Escapes cultivation and forms dense colonies in wetlands, displacing native sedges and rushes.',
    regions: ['Northeast', 'Pacific Northwest', 'Southeast'],
    alternatives: [
      { id: 'wild-blue-iris', name: 'Blue Wild Iris', note: 'Native iris relative that fills the same moist-soil niche beautifully' },
      { id: 'marsh-marigold', name: 'Marsh Marigold', note: 'Brilliant yellow native for wet conditions without invasive spread' },
      { id: 'swamp-milkweed', name: 'Swamp Milkweed', note: 'Upright pink blooms that support monarchs in wet areas' },
    ],
  },
  {
    id: 'spotted-knapweed',
    invasiveName: 'Spotted Knapweed',
    scientificName: 'Centaurea stoebe',
    problem: 'Allelopathic taproot plant that invades prairies and roadsides, driving out native grasses and forbs.',
    regions: ['Mountain West', 'Midwest', 'Pacific Northwest'],
    alternatives: [
      { id: 'purple-coneflower', name: 'Purple Coneflower', note: 'Similar purple daisy-like bloom with none of the invasive habit' },
      { id: 'blazing-star', name: 'Blazing Star', note: 'Spiky native prairie plant that fills disturbed roadsides' },
      { id: 'blanketflower', name: 'Blanketflower', note: 'Drought-tolerant native for open, sunny disturbed sites' },
    ],
  },
  {
    id: 'tree-of-heaven',
    invasiveName: 'Tree of Heaven',
    scientificName: 'Ailanthus altissima',
    problem: 'Rapidly colonizes disturbed sites, exudes allelopathic compounds, and hosts the invasive spotted lanternfly.',
    regions: ['Northeast', 'Southeast', 'Midwest', 'Pacific Northwest'],
    alternatives: [
      { id: 'fireweed', name: 'Fireweed', note: 'Native pioneer species for disturbed sites with showy pink blooms' },
      { id: 'common-evening-primrose', name: 'Common Evening Primrose', note: 'Fast-colonizing native for disturbed ground' },
      { id: 'canada-goldenrod', name: 'Canada Goldenrod', note: 'Robust native that out-competes weeds in old fields' },
    ],
  },
  {
    id: 'japanese-stiltgrass',
    invasiveName: 'Japanese Stiltgrass',
    scientificName: 'Microstegium vimineum',
    problem: 'Annual grass that carpets forest floors, out-competing native understory seedlings.',
    regions: ['Southeast', 'Northeast', 'Midwest'],
    alternatives: [
      { id: 'wild-ginger', name: 'Wild Ginger', note: 'Dense native ground cover that outcompetes weedy annual grasses' },
      { id: 'trout-lily', name: 'Trout Lily', note: 'Spring ephemeral that occupies forest floor niche naturally' },
      { id: 'may-apple', name: 'May Apple', note: 'Large-leafed native that shades out annual weeds in woodland settings' },
    ],
  },
  {
    id: 'multiflora-rose',
    invasiveName: 'Multiflora Rose',
    scientificName: 'Rosa multiflora',
    problem: 'Thorny shrub that forms impenetrable thickets in fields and forest edges, smothering native shrubs.',
    regions: ['Northeast', 'Midwest', 'Southeast'],
    alternatives: [
      { id: 'wild-bergamot', name: 'Wild Bergamot', note: 'Bushy native with fragrant blooms that fills meadow edge habitat' },
      { id: 'purple-coneflower', name: 'Purple Coneflower', note: 'Robust native that establishes in similar open-edge conditions' },
      { id: 'canada-goldenrod', name: 'Canada Goldenrod', note: 'Native that provides similar dense cover without thorns' },
    ],
  },
  {
    id: 'japanese-barberry',
    invasiveName: 'Japanese Barberry',
    scientificName: 'Berberis thunbergii',
    problem: 'Dense thorny shrub that alters soil pH and harbors deer ticks (Lyme disease vector) in its leaf litter.',
    regions: ['Northeast', 'Midwest', 'Southeast'],
    alternatives: [
      { id: 'new-england-aster', name: 'New England Aster', note: 'Mounding native with bold fall color and pollinator value' },
      { id: 'obedient-plant', name: 'Obedient Plant', note: 'Bushy native that provides similar structure in woodland edges' },
      { id: 'wild-bergamot', name: 'Wild Bergamot', note: 'Dense native perennial for hedge-like effect in sunny areas' },
    ],
  },
  {
    id: 'wineberry',
    invasiveName: 'Wineberry',
    scientificName: 'Rubus phoenicolasius',
    problem: 'Canes spread aggressively in disturbed woodland edges, displacing native brambles and understory plants.',
    regions: ['Northeast', 'Midwest', 'Southeast'],
    alternatives: [
      { id: 'wild-columbine', name: 'Wild Columbine', note: 'Native that grows in similar rocky, partially-shaded edges' },
      { id: 'fire-pink', name: 'Fire Pink', note: 'Vivid red native for rocky woodland edges and outcrops' },
      { id: 'wild-geranium', name: 'Wild Geranium', note: 'Spreads gently and naturalizes well in disturbed woodland margins' },
    ],
  },
  {
    id: 'common-barberry',
    invasiveName: 'Common Barberry',
    scientificName: 'Berberis vulgaris',
    problem: 'Alternate host for wheat stem rust fungus; banned in many states; spreads through bird-dispersed berries.',
    regions: ['Northeast', 'Midwest'],
    alternatives: [
      { id: 'blazing-star', name: 'Blazing Star', note: 'Upright prairie native with vertical interest and pollinator value' },
      { id: 'black-eyed-susan', name: 'Black-Eyed Susan', note: 'Cheerful native that naturalizes in the same open sunny sites' },
      { id: 'wild-bergamot', name: 'Wild Bergamot', note: 'Fragrant native shrub-like perennial for similar border positions' },
    ],
  },
];

const ALL_REGIONS = ['Northeast', 'Southeast', 'Midwest', 'Southwest', 'Pacific Northwest', 'Mountain West'];

export default function InvasiveAlternatives() {
  const [search, setSearch]   = useState('');
  const [region, setRegion]   = useState('All');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return INVASIVES.filter(item => {
      if (region !== 'All' && !item.regions.includes(region)) return false;
      if (q && !item.invasiveName.toLowerCase().includes(q) &&
               !item.scientificName.toLowerCase().includes(q) &&
               !item.regions.join(' ').toLowerCase().includes(q)) return false;
      return true;
    });
  }, [search, region]);

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-gray-900">
      <Helmet>
        <title>Invasive Plant Alternatives | WildHome</title>
        <meta name="description" content="Replace invasive plants with native alternatives. Find native wildflowers that fill the same ecological role without threatening local ecosystems." />
      </Helmet>

      {/* Header */}
      <header className="bg-forest-700 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl select-none">🌿</span>
            <span className="text-xl font-serif font-bold text-white group-hover:text-cream-200 transition-colors">
              WildHome
            </span>
          </Link>
          <span className="text-forest-300 text-sm hidden sm:inline">/ Invasive Alternatives</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-3">
            Invasive Plant Alternatives
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-base max-w-2xl leading-relaxed">
            Replace invasive plants with native species that fill the same ecological role —
            without threatening local ecosystems.
          </p>
          {/* Disclaimer */}
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-amber-800 text-sm">
            ⚠️ Invasive status varies by region. Check with your local cooperative extension office
            for guidance specific to your area before making removal decisions.
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search invasive plants…"
            className="flex-1 px-4 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            aria-label="Search invasive plants"
          />
          <select
            value={region}
            onChange={e => setRegion(e.target.value)}
            className="px-4 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            aria-label="Filter by region"
          >
            <option value="All">All Regions</option>
            {ALL_REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <p className="text-xs text-gray-400 mb-5">{filtered.length} invasive {filtered.length === 1 ? 'plant' : 'plants'} listed</p>

        {/* Cards */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            No invasive plants match those filters.
          </div>
        ) : (
          <div className="space-y-5">
            {filtered.map(item => (
              <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl border border-cream-200 dark:border-gray-700 overflow-hidden">
                {/* Invasive header */}
                <div className="bg-red-50 dark:bg-red-950 border-b border-red-100 dark:border-red-900 px-5 py-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h2 className="text-base font-semibold text-red-900">
                        🚫 {item.invasiveName}
                      </h2>
                      <p className="text-sm italic text-red-600">{item.scientificName}</p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {item.regions.map(r => (
                        <span key={r} className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">{r}</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-red-700 mt-2 leading-relaxed">{item.problem}</p>
                </div>

                {/* Native alternatives */}
                <div className="px-5 py-4">
                  <p className="text-xs font-semibold text-forest-600 uppercase tracking-wide mb-3">
                    Native Alternatives
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {item.alternatives.map(alt => (
                      <Link
                        key={alt.id}
                        to={`/flower/${alt.id}`}
                        className="group bg-forest-50 dark:bg-gray-700 hover:bg-forest-100 dark:hover:bg-gray-600 border border-forest-100 dark:border-gray-600 hover:border-forest-300 rounded-lg p-3 transition-colors"
                      >
                        <p className="text-sm font-medium text-forest-800 dark:text-forest-200 group-hover:text-forest-900 dark:group-hover:text-white">
                          ✅ {alt.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-snug">{alt.note}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-forest-900 text-forest-300 py-6 px-6 text-center text-sm mt-8">
        <p>
          <span className="font-serif font-semibold text-white">WildHome</span>
          {' '} · © {new Date().getFullYear()} ·{' '}
          <Link to="/" className="underline hover:text-white">Home</Link>
          {' · '}
          <Link to="/privacy" className="underline hover:text-white">Privacy Policy</Link>
        </p>
      </footer>
    </div>
  );
}
