import { useState } from 'react';
import { BLOOM_SEASONS, FLOWER_COLORS, SUN_PREFS, WATER_NEEDS } from '../data/wildflowers';

const COLOR_SWATCHES = {
  yellow:   'bg-yellow-400',
  purple:   'bg-purple-500',
  pink:     'bg-pink-400',
  blue:     'bg-blue-500',
  red:      'bg-red-500',
  white:    'bg-white border border-gray-300',
  orange:   'bg-orange-500',
  lavender: 'bg-purple-300',
};

export default function FilterPanel({ filters, onChange, resultCount, totalCount }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  function toggle(key, value) {
    const current = filters[key] ?? [];
    const next = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    onChange({ ...filters, [key]: next });
  }

  function clearAll() {
    onChange({ bloomSeason: [], color: [], sunPreference: [], waterNeeds: [] });
  }

  const hasActiveFilters = Object.values(filters).some(arr => arr.length > 0);
  const activeCount = Object.values(filters).reduce((n, arr) => n + arr.length, 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-cream-200 dark:border-gray-700 shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
          <span>🎛</span> Filters
          <span className="text-xs font-normal text-gray-400 dark:text-gray-500">
            ({resultCount} of {totalCount})
          </span>
          {activeCount > 0 && (
            <span className="bg-forest-600 text-white text-xs rounded-full px-1.5 py-0.5 leading-none">
              {activeCount}
            </span>
          )}
        </h3>
        <div className="flex items-center gap-3">
          {hasActiveFilters && (
            <button
              onClick={clearAll}
              className="text-xs text-terra-500 hover:text-terra-700 font-medium"
            >
              Clear all
            </button>
          )}
          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(o => !o)}
            className="sm:hidden text-xs text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg px-2 py-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={mobileOpen ? 'Collapse filters' : 'Expand filters'}
          >
            {mobileOpen ? '▲ Hide' : '▼ Show'}
          </button>
        </div>
      </div>

      {/* Filter grid — always visible on sm+, togglable on mobile */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${mobileOpen ? '' : 'hidden sm:grid'}`}>

        {/* Bloom season */}
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Season</p>
          <div className="flex flex-wrap gap-1.5">
            {BLOOM_SEASONS.map(s => {
              const active = (filters.bloomSeason ?? []).includes(s);
              return (
                <button
                  key={s}
                  onClick={() => toggle('bloomSeason', s)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                    active
                      ? 'bg-forest-600 text-white border-forest-600'
                      : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-forest-400'
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* Color */}
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Color</p>
          <div className="flex flex-wrap gap-1.5">
            {FLOWER_COLORS.map(c => {
              const active = (filters.color ?? []).includes(c);
              return (
                <button
                  key={c}
                  onClick={() => toggle('color', c)}
                  title={c}
                  className={`w-6 h-6 rounded-full transition-all ${COLOR_SWATCHES[c] ?? 'bg-gray-400'} ${
                    active ? 'ring-2 ring-offset-1 ring-forest-500 scale-110' : 'opacity-80 hover:opacity-100'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Sun preference */}
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Sun</p>
          <div className="flex flex-wrap gap-1.5">
            {SUN_PREFS.map(s => {
              const active = (filters.sunPreference ?? []).includes(s);
              const icon = s === 'Full Sun' ? '☀️' : s === 'Partial Shade' ? '⛅' : '🌥️';
              return (
                <button
                  key={s}
                  onClick={() => toggle('sunPreference', s)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                    active
                      ? 'bg-yellow-500 text-white border-yellow-500'
                      : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-yellow-400'
                  }`}
                >
                  {icon} {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* Water needs */}
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Water</p>
          <div className="flex flex-wrap gap-1.5">
            {WATER_NEEDS.map(w => {
              const active = (filters.waterNeeds ?? []).includes(w);
              const drops = w === 'Low' ? '💧' : w === 'Moderate' ? '💧💧' : '💧💧💧';
              return (
                <button
                  key={w}
                  onClick={() => toggle('waterNeeds', w)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                    active
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-blue-400'
                  }`}
                >
                  {drops} {w}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
