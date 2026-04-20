import { useState } from 'react';
import { resolveState } from '../services/geocodingService';

export default function LocationPicker({ currentLocation, onLocationResolved }) {
  const [inputVal, setInputVal] = useState('');
  const [error, setError]       = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    const val = inputVal.trim();
    if (!val) return;
    setError(null);
    const loc = resolveState(val);
    if (!loc) {
      setError('State not recognized. Try a full name like "Ohio" or abbreviation like "OH".');
      return;
    }
    onLocationResolved(loc);
    setInputVal('');
  }

  return (
    <div className="w-full">
      {currentLocation?.state ? (
        /* ── Active location pill ─────────────────────────────────────── */
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-forest-100 border border-forest-300 text-forest-800 px-4 py-2 rounded-full text-sm font-medium">
            <span>📍</span>
            <span>{currentLocation.displayName || currentLocation.stateName}</span>
          </div>
          <button
            onClick={() => onLocationResolved(null)}
            className="text-xs text-gray-500 hover:text-gray-700 underline"
          >
            Change location
          </button>
        </div>
      ) : (
        /* ── State input ──────────────────────────────────────────────── */
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm mx-auto sm:mx-0">
          <input
            type="text"
            value={inputVal}
            onChange={e => { setInputVal(e.target.value); setError(null); }}
            placeholder="Enter your state (e.g. Ohio)"
            className="flex-1 px-4 py-2.5 text-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/60 bg-white/20 text-white placeholder-forest-200"
            aria-label="Enter your state"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={!inputVal.trim()}
            className="px-4 py-2.5 bg-terra-500 hover:bg-terra-600 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-colors shadow-sm"
          >
            Go
          </button>
        </form>
      )}
      {error && (
        <p className="mt-2 text-red-200 text-xs flex items-center gap-1">
          <span>⚠️</span> {error}
        </p>
      )}
    </div>
  );
}
