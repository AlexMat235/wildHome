const REASONS = [
  {
    icon: '🦋',
    title: 'Support pollinators',
    body: 'Native plants and native insects co-evolved over thousands of years. A single oak tree supports 500+ caterpillar species. Exotic ornamentals often support none.',
  },
  {
    icon: '💧',
    title: 'Conserve water',
    body: 'Native plants are adapted to local rainfall patterns. Once established, most need little or no supplemental watering — slashing lawn irrigation needs by up to 50%.',
  },
  {
    icon: '🐦',
    title: 'Feed birds',
    body: "96% of terrestrial bird species feed insects to their chicks. Without native plants, insects disappear — and so do the birds. Native gardens are the key link in the food chain.",
  },
  {
    icon: '🌱',
    title: 'Build healthy soil',
    body: 'Deep native roots break up compaction, reduce erosion, and feed soil microbes. Prairie plants can send roots 15 feet deep — sequestering far more carbon than shallow turf grasses.',
  },
  {
    icon: '🌍',
    title: 'Fight climate change',
    body: 'Native landscapes require no synthetic fertilizers or pesticides, both of which are energy-intensive to produce and release greenhouse gases. Less mowing = fewer emissions.',
  },
  {
    icon: '🏡',
    title: 'Increase biodiversity',
    body: 'Replacing just 10% of your lawn with native plants can dramatically increase local biodiversity. Every native garden is a habitat corridor connecting larger wild areas.',
  },
];

export default function WhyNatives() {
  return (
    <section className="bg-forest-700 text-white py-16 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif font-bold mb-3">Why plant natives?</h2>
          <p className="text-forest-200 max-w-2xl mx-auto text-base leading-relaxed">
            Native wildflowers aren't just beautiful — they're the foundation of healthy local ecosystems.
            Here's why replacing even a small patch of lawn makes a real difference.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {REASONS.map(r => (
            <div key={r.title} className="bg-forest-600 rounded-xl p-5 hover:bg-forest-500 transition-colors">
              <div className="text-3xl mb-3">{r.icon}</div>
              <h3 className="font-serif font-semibold text-lg mb-2">{r.title}</h3>
              <p className="text-forest-200 text-sm leading-relaxed">{r.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-forest-300 text-sm">
            Want to go deeper?{' '}
            <a
              href="https://www.nwf.org/NativePlantFinder/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cream-300 hover:text-white underline"
            >
              National Wildlife Federation Native Plant Finder ↗
            </a>
            {' · '}
            <a
              href="https://plants.usda.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cream-300 hover:text-white underline"
            >
              USDA PLANTS Database ↗
            </a>
          </p>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center bg-forest-800 dark:bg-gray-900 rounded-2xl px-6 py-10">
          <h3 className="text-2xl font-serif font-bold text-white mb-3">
            Ready to find what grows naturally near you?
          </h3>
          <p className="text-forest-200 max-w-lg mx-auto text-sm leading-relaxed mb-6">
            Discover native wildflowers for your state and start building a garden that gives back to nature.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-2 px-6 py-3 bg-forest-400 hover:bg-forest-300 text-white font-semibold rounded-xl transition-colors text-sm"
          >
            Find My Native Flowers →
          </button>
        </div>
      </div>
    </section>
  );
}
