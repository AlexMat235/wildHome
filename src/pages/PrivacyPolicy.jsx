import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-cream-50 dark:bg-gray-900">
      <Helmet>
        <title>Privacy Policy | WildHome</title>
        <meta name="description" content="WildHome collects no personal data. Read our full privacy policy." />
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
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12">

        <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-8">Last updated: April 16, 2026</p>

        {/* Short version highlight box */}
        <div className="bg-forest-50 border border-forest-200 rounded-xl px-6 py-5 mb-10">
          <p className="text-forest-800 text-base font-medium leading-relaxed">
            <span className="text-2xl mr-2">🌿</span>
            <strong>The short version:</strong> WildHome collects absolutely no personal data.
            We don't use cookies, we don't track you, and we don't store anything about
            you on our servers. Everything stays on your device.
          </p>
        </div>

        <div className="prose prose-sm max-w-none space-y-8 text-gray-700 dark:text-gray-300">

          <section>
            <h2 className="text-xl font-serif font-semibold text-gray-900 dark:text-gray-100 mb-3">1. What We Collect</h2>
            <p className="leading-relaxed">
              <strong>Nothing.</strong> WildHome does not collect names, email addresses,
              location data, IP addresses, device identifiers, or any other personally
              identifiable information. There are no sign-up forms, no accounts, and no
              profiles.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-semibold text-gray-900 dark:text-gray-100 mb-3">2. Cookies &amp; Tracking</h2>
            <p className="leading-relaxed">
              We use <strong>no cookies</strong> and <strong>no third-party tracking
              scripts</strong> — no Google Analytics, no Facebook Pixel, no advertising
              networks, nothing. WildHome is built to work without any tracking technology
              whatsoever.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-semibold text-gray-900 dark:text-gray-100 mb-3">3. Local Storage</h2>
            <p className="leading-relaxed">
              The app saves two things in your browser's <code className="bg-gray-100 px-1 rounded text-sm">localStorage</code>:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 leading-relaxed">
              <li><strong>Your garden wishlist</strong> — the flower IDs you've starred. This is stored locally on your device only.</li>
              <li><strong>API response cache</strong> — plant photos and sighting counts fetched from iNaturalist are cached locally to reduce repeat API calls and speed up the app.</li>
            </ul>
            <p className="mt-2 leading-relaxed">
              This data <strong>never leaves your device</strong>. You can clear it at any
              time by clearing your browser's site data (Settings → Privacy → Clear
              browsing data in most browsers).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-semibold text-gray-900 dark:text-gray-100 mb-3">4. Third-Party APIs</h2>
            <p className="leading-relaxed">
              WildHome fetches plant photos and observation data from the{' '}
              <a href="https://www.inaturalist.org/pages/api+reference" target="_blank" rel="noopener noreferrer" className="text-forest-600 hover:underline">iNaturalist public API</a>
              {' '}and map tiles from{' '}
              <a href="https://www.openstreetmap.org" target="_blank" rel="noopener noreferrer" className="text-forest-600 hover:underline">OpenStreetMap</a>.
              These requests <strong>do not include any personal information</strong> — they
              ask only for data about specific plant species and map regions.
            </p>
            <p className="mt-2 leading-relaxed">
              For details on how those services handle data, see:{' '}
              <a href="https://www.inaturalist.org/pages/privacy" target="_blank" rel="noopener noreferrer" className="text-forest-600 hover:underline">iNaturalist Privacy Policy</a>
              {' '}and{' '}
              <a href="https://wiki.osmfoundation.org/wiki/Privacy_Policy" target="_blank" rel="noopener noreferrer" className="text-forest-600 hover:underline">OpenStreetMap Privacy Policy</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-semibold text-gray-900 dark:text-gray-100 mb-3">5. Children's Privacy</h2>
            <p className="leading-relaxed">
              WildHome does not collect any data from anyone, including children under 13.
              Because we collect no data at all, there is no special handling required for
              younger users.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-semibold text-gray-900 dark:text-gray-100 mb-3">6. Changes to This Policy</h2>
            <p className="leading-relaxed">
              If this policy ever changes, the "Last updated" date at the top of this page
              will reflect that. We do not anticipate meaningful changes since we collect
              no data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-semibold text-gray-900 dark:text-gray-100 mb-3">7. Contact</h2>
            <p className="leading-relaxed">
              If you have questions about this privacy policy, you can reach us at{' '}
              <a href="mailto:hello@wildhome.app" className="text-forest-600 hover:underline">
                hello@wildhome.app
              </a>.
            </p>
          </section>

        </div>

        <div className="mt-10 pt-6 border-t border-cream-200">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-forest-600 hover:text-forest-800 hover:underline"
          >
            ← Back to WildHome
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-forest-900 text-forest-300 py-6 px-6 text-center text-sm mt-8">
        <p>
          <span className="font-serif font-semibold text-white">WildHome</span>
          {' '} · © {new Date().getFullYear()} ·{' '}
          <Link to="/privacy" className="underline hover:text-white">Privacy Policy</Link>
        </p>
      </footer>
    </div>
  );
}
