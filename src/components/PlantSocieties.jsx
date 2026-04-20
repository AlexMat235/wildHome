const SOCIETIES = [
  // ── National ──────────────────────────────────────────────────────────────
  {
    id: 'lady-bird-johnson',
    name: 'Lady Bird Johnson Wildflower Center',
    region: 'National',
    url: 'https://www.wildflower.org',
    description: 'The foremost authority on native plants in North America; maintains the Native Plants Database with 9,000+ species.',
  },
  {
    id: 'nanps',
    name: 'North American Native Plant Society',
    region: 'National',
    url: 'https://www.nanps.org',
    description: 'Canada-based but continental in scope; promotes native plant conservation and education across North America.',
  },
  {
    id: 'nwf',
    name: 'National Wildlife Federation — Native Plant Finder',
    region: 'National',
    url: 'https://www.nwf.org/NativePlantFinder/',
    description: 'Zip-code-based tool that identifies which native plants support the most wildlife in your specific area.',
  },
  {
    id: 'usda-plants',
    name: 'USDA PLANTS Database',
    region: 'National',
    url: 'https://plants.usda.gov',
    description: 'Authoritative federal database of plant distributions, nativity status, and characteristics across the US.',
  },

  // ── Northeast ─────────────────────────────────────────────────────────────
  {
    id: 'new-england-wildflower',
    name: 'New England Wildflower Society (Go Botany)',
    region: 'Northeast',
    url: 'https://gobotany.nativeplanttrust.org',
    description: 'New England\'s oldest plant conservation organization; now known as Native Plant Trust, operating the Go Botany identification app.',
  },
  {
    id: 'pa-native-plant',
    name: 'Pennsylvania Native Plant Society',
    region: 'Northeast',
    url: 'https://www.pawildflower.org',
    description: 'Promotes conservation, study, and appreciation of Pennsylvania\'s native flora through chapters statewide.',
  },
  {
    id: 'ny-native-plant',
    name: 'Native Plant Center at SUNY Westchester',
    region: 'Northeast',
    url: 'https://www.nativeplantcenter.net',
    description: 'Educational resource and clearinghouse for native plant information in the greater New York metropolitan region.',
  },
  {
    id: 'torrey-botanical',
    name: 'Torrey Botanical Society',
    region: 'Northeast',
    url: 'https://www.torreybotanical.org',
    description: 'New York–based scientific society focused on plant research and conservation in the Northeast.',
  },

  // ── Southeast ─────────────────────────────────────────────────────────────
  {
    id: 'fnps',
    name: 'Florida Native Plant Society',
    region: 'Southeast',
    url: 'https://www.fnps.org',
    description: 'Promotes preservation and restoration of Florida\'s native plants and ecosystems through 30+ local chapters.',
  },
  {
    id: 'gnps',
    name: 'Georgia Native Plant Society',
    region: 'Southeast',
    url: 'https://gnps.org',
    description: 'Supports conservation of Georgia\'s native flora and encourages native plantings in gardens and landscapes.',
  },
  {
    id: 'sc-native-plant',
    name: 'South Carolina Native Plant Society',
    region: 'Southeast',
    url: 'https://www.scnps.org',
    description: 'Works to conserve and promote native plants of South Carolina through education, research, and advocacy.',
  },
  {
    id: 'nc-wildflower',
    name: 'North Carolina Wildflower Preservation Society',
    region: 'Southeast',
    url: 'https://ncwildflower.org',
    description: 'Protects native wildflowers of North Carolina through grants, seed banking, and volunteer stewardship projects.',
  },

  // ── Midwest ───────────────────────────────────────────────────────────────
  {
    id: 'inps',
    name: 'Illinois Native Plant Society',
    region: 'Midwest',
    url: 'https://www.ill-inps.org',
    description: 'Promotes conservation and study of Illinois\' native plants; publishes the journal Erigenia.',
  },
  {
    id: 'mn-native-plant',
    name: 'Minnesota Native Plant Society',
    region: 'Midwest',
    url: 'https://www.mnnps.org',
    description: 'Dedicated to the study and conservation of Minnesota\'s native plants; runs field trips and workshops statewide.',
  },
  {
    id: 'iowa-native',
    name: 'Iowa Prairie Network',
    region: 'Midwest',
    url: 'https://www.iowaprairienetwork.org',
    description: 'Works to protect and restore Iowa\'s remaining prairie and savanna habitats.',
  },
  {
    id: 'michigan-botanical',
    name: 'Michigan Botanical Club',
    region: 'Midwest',
    url: 'https://www.michbotclub.org',
    description: 'Promotes study, conservation, and appreciation of Michigan\'s native flora through field trips and publications.',
  },

  // ── Southwest ─────────────────────────────────────────────────────────────
  {
    id: 'anps',
    name: 'Arizona Native Plant Society',
    region: 'Southwest',
    url: 'https://www.aznativeplantsociety.org',
    description: 'Dedicated to conserving Arizona\'s native plants and their habitats; offers regional chapter programs and plant events.',
  },
  {
    id: 'npsnm',
    name: 'Native Plant Society of New Mexico',
    region: 'Southwest',
    url: 'https://npsnm.org',
    description: 'Promotes conservation of New Mexico\'s diverse native flora through education, field trips, and restoration projects.',
  },
  {
    id: 'npst',
    name: 'Native Plant Society of Texas',
    region: 'Southwest',
    url: 'https://www.npsot.org',
    description: 'One of the largest state native plant societies; supports conservation and gardening with native Texas plants.',
  },

  // ── Pacific Northwest ─────────────────────────────────────────────────────
  {
    id: 'wnps',
    name: 'Washington Native Plant Society',
    region: 'Pacific Northwest',
    url: 'https://www.wnps.org',
    description: 'Protects and promotes Washington\'s native plants; operates Rare Plant Care and Conservation program.',
  },
  {
    id: 'npso',
    name: 'Native Plant Society of Oregon',
    region: 'Pacific Northwest',
    url: 'https://www.npsoregon.org',
    description: 'Works to conserve Oregon\'s native plants through education, research, and conservation programs statewide.',
  },

  // ── Mountain West ─────────────────────────────────────────────────────────
  {
    id: 'conps',
    name: 'Colorado Native Plant Society',
    region: 'Mountain West',
    url: 'https://conps.org',
    description: 'Promotes conservation of Colorado\'s diverse native flora from alpine tundra to canyon grasslands.',
  },
  {
    id: 'unps',
    name: 'Utah Native Plant Society',
    region: 'Mountain West',
    url: 'https://www.unps.org',
    description: 'Dedicated to the conservation and appreciation of Utah\'s native plants across the Great Basin and Plateaus.',
  },
  {
    id: 'montana-native',
    name: 'Montana Native Plant Society',
    region: 'Mountain West',
    url: 'https://www.mtnativeplants.org',
    description: 'Works to increase awareness and promote conservation of Montana\'s remarkable native plant diversity.',
  },
];

const REGION_ORDER = ['National', 'Northeast', 'Southeast', 'Midwest', 'Southwest', 'Pacific Northwest', 'Mountain West'];

export default function PlantSocieties() {
  return (
    <section className="bg-forest-50 dark:bg-gray-900 py-16 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-3">
            Native Plant Societies
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-base">
            Connect with local experts, find plant sales, and support organizations working
            to protect native plants in your region.
          </p>
        </div>

        <div className="space-y-7">
          {REGION_ORDER.map(region => {
            const group = SOCIETIES.filter(s => s.region === region);
            return (
              <div key={region}>
                <h3 className="text-sm font-semibold text-forest-700 dark:text-forest-300 uppercase tracking-wide mb-3 pb-1 border-b border-forest-200 dark:border-gray-700">
                  {region}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {group.map(s => (
                    <div key={s.id} className="bg-white dark:bg-gray-800 rounded-xl border border-cream-200 dark:border-gray-700 p-4 flex flex-col gap-2 hover:border-forest-300 dark:hover:border-forest-500 transition-colors">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-snug">{s.name}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed flex-1">{s.description}</p>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="self-start text-xs font-medium px-3 py-1.5 bg-forest-50 hover:bg-forest-100 text-forest-700 border border-forest-200 rounded-lg transition-colors"
                        aria-label={`Visit ${s.name} website`}
                      >
                        Visit Website ↗
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-8 text-xs text-gray-400 text-center">
          WildHome is not affiliated with any listed organization. Links are provided as a resource only.
        </p>
      </div>
    </section>
  );
}
