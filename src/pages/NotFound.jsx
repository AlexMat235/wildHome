import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { WILDFLOWERS } from '../data/wildflowers';

// Pick 3 random flowers to suggest on the 404 page
function getRandomFlowers(count = 3) {
  const shuffled = [...WILDFLOWERS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export default function NotFound() {
  const suggestions = useMemo(() => getRandomFlowers(3), []);

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col items-center justify-center px-6 py-16 text-center">
      {/* Flower illustration */}
      <img
        src="/flower.svg"
        alt="WildHome flower"
        className="w-28 h-28 mb-6 opacity-60"
      />

      {/* Heading */}
      <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-3">
        Oops! This flower doesn't exist… yet.
      </h1>
      <p className="text-gray-500 text-base max-w-md mb-8">
        The page you're looking for couldn't be found. It may have been moved or never existed.
      </p>

      {/* Back home button */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-forest-600 hover:bg-forest-700 text-white font-medium rounded-xl transition-colors mb-12"
      >
        ← Back to WildHome
      </Link>

      {/* Flower suggestions */}
      <div className="w-full max-w-lg">
        <p className="text-sm font-medium text-gray-600 mb-4">
          You might enjoy one of these:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {suggestions.map(flower => (
            <Link
              key={flower.id}
              to={`/flower/${flower.id}`}
              className="bg-white rounded-xl border border-cream-200 p-4 hover:border-forest-300 hover:shadow-sm transition-all group"
            >
              <div className="text-3xl mb-2">🌸</div>
              <p className="text-sm font-semibold text-gray-900 group-hover:text-forest-700 transition-colors">
                {flower.commonName}
              </p>
              <p className="text-xs italic text-gray-400 mt-0.5 truncate">
                {flower.scientificName}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
