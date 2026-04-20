import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

// Maps a flower's first color to a Tailwind bg class for the color swatch
const COLOR_SWATCH = {
  yellow:       'bg-yellow-400',
  purple:       'bg-purple-500',
  blue:         'bg-blue-500',
  white:        'bg-gray-200',
  pink:         'bg-pink-400',
  red:          'bg-red-500',
  orange:       'bg-orange-400',
  'blue-violet':'bg-indigo-500',
  lavender:     'bg-purple-300',
  green:        'bg-green-500',
  cream:        'bg-yellow-100',
  maroon:       'bg-red-800',
};

/** Wrap the first occurrence of `query` in <strong> for bolding in the dropdown */
function Highlight({ text, query }) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <strong className="font-bold text-white">{text.slice(idx, idx + query.length)}</strong>
      {text.slice(idx + query.length)}
    </>
  );
}

export default function Header({
  gardenCount,
  onGardenOpen,
  searchQuery,
  onSearch,
  flowers = [],
  onSelectFlower,
}) {
  const [inputVal, setInputVal]     = useState(searchQuery ?? '');
  const [installPrompt, setInstallPrompt] = useState(null);
  const [suggestions, setSuggestions]     = useState([]);
  const [activeIdx, setActiveIdx]         = useState(-1);
  const [darkMode, setDarkMode]           = useLocalStorage('wildhome-dark-mode', false);

  // Sync dark class on <html> whenever darkMode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const onSearchRef    = useRef(onSearch);
  const dropdownRef    = useRef(null);  // wraps the entire search + dropdown
  const suggestRef     = useRef(null);  // the dropdown list element

  useEffect(() => { onSearchRef.current = onSearch; }, [onSearch]);

  // ── PWA install ────────────────────────────────────────────────────────────
  useEffect(() => {
    function onPrompt(e) {
      e.preventDefault();
      setInstallPrompt(e);
    }
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', () => setInstallPrompt(null));
    return () => window.removeEventListener('beforeinstallprompt', onPrompt);
  }, []);

  async function handleInstall() {
    if (!installPrompt) return;
    await installPrompt.prompt();
    setInstallPrompt(null);
  }

  // ── Debounced search ────────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => { onSearchRef.current(inputVal); }, 300);
    return () => clearTimeout(timer);
  }, [inputVal]);

  // Keep local input in sync when parent resets the search externally
  useEffect(() => {
    setInputVal(searchQuery ?? '');
  }, [searchQuery]);

  // ── Autocomplete suggestions ────────────────────────────────────────────────
  const computeSuggestions = useCallback((val) => {
    if (val.length < 2 || !flowers.length) {
      setSuggestions([]);
      setActiveIdx(-1);
      return;
    }
    const q = val.toLowerCase();
    const matches = flowers.filter(f =>
      f.commonName.toLowerCase().includes(q)     ||
      f.scientificName.toLowerCase().includes(q) ||
      (f.family && f.family.toLowerCase().includes(q)) ||
      (f.colors && f.colors.some(c => c.toLowerCase().includes(q))) ||
      (f.tags   && f.tags.some(t => t.toLowerCase().includes(q)))
    ).slice(0, 6);
    setSuggestions(matches);
    setActiveIdx(-1);
  }, [flowers]);

  useEffect(() => { computeSuggestions(inputVal); }, [inputVal, computeSuggestions]);

  // ── Close dropdown when clicking outside ───────────────────────────────────
  useEffect(() => {
    function handler(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setSuggestions([]);
        setActiveIdx(-1);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Keyboard navigation ─────────────────────────────────────────────────────
  function handleKeyDown(e) {
    if (!suggestions.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx(i => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx(i => Math.max(i - 1, -1));
    } else if (e.key === 'Escape') {
      setSuggestions([]);
      setActiveIdx(-1);
    } else if (e.key === 'Enter' && activeIdx >= 0) {
      e.preventDefault();
      selectSuggestion(suggestions[activeIdx]);
    }
  }

  function selectSuggestion(flower) {
    if (onSelectFlower) onSelectFlower(flower);
    setInputVal('');
    setSuggestions([]);
    setActiveIdx(-1);
    // Clear the debounced search so the grid resets
    onSearchRef.current('');
  }

  function handleSubmit(e) {
    e.preventDefault();
    // If a suggestion is highlighted, select it; otherwise do a normal text search
    if (activeIdx >= 0 && suggestions[activeIdx]) {
      selectSuggestion(suggestions[activeIdx]);
    } else {
      setSuggestions([]);
      onSearchRef.current(inputVal);
    }
  }

  // ── Dropdown ────────────────────────────────────────────────────────────────
  const Dropdown = suggestions.length > 0 ? (
    <ul
      ref={suggestRef}
      role="listbox"
      aria-label="Flower suggestions"
      className="absolute left-0 right-0 top-full mt-1 z-50 bg-forest-800 border border-forest-600 rounded-xl shadow-xl overflow-hidden"
    >
      {suggestions.map((f, i) => {
        const swatchClass = COLOR_SWATCH[(f.colors ?? [])[0]] ?? 'bg-gray-400';
        return (
          <li
            key={f.id}
            role="option"
            aria-selected={i === activeIdx}
            onMouseDown={() => selectSuggestion(f)}
            onMouseEnter={() => setActiveIdx(i)}
            className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors text-sm ${
              i === activeIdx
                ? 'bg-forest-600 text-white'
                : 'text-forest-100 hover:bg-forest-700'
            }`}
          >
            {/* Color swatch */}
            <span className={`flex-shrink-0 w-3 h-3 rounded-full ${swatchClass} border border-forest-500`} />

            <span className="flex-1 min-w-0">
              {/* Common name with bold highlight */}
              <span className="block truncate leading-snug">
                <Highlight text={f.commonName} query={inputVal} />
              </span>
              {/* Scientific name */}
              <span className="block truncate text-xs text-forest-300 italic leading-snug">
                <Highlight text={f.scientificName} query={inputVal} />
              </span>
            </span>

            {/* Bloom season badge */}
            <span className="flex-shrink-0 text-xs text-forest-400 hidden sm:block">
              {f.bloomSeason}
            </span>
          </li>
        );
      })}
    </ul>
  ) : null;

  return (
    <header className="sticky top-0 z-50 bg-forest-700 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 h-14">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 flex-shrink-0 group">
            <span className="text-2xl select-none">🌿</span>
            <span className="text-xl font-serif font-bold text-white group-hover:text-cream-200 transition-colors">
              WildHome
            </span>
          </a>

          {/* Desktop search bar (expands) */}
          <form
            onSubmit={handleSubmit}
            className="flex-1 max-w-md mx-4 hidden sm:block"
            autoComplete="off"
          >
            <div className="relative" ref={dropdownRef}>
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-forest-300 select-none text-sm pointer-events-none">🔍</span>
              <input
                type="search"
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search flowers by name, color, season…"
                aria-label="Search flowers"
                aria-expanded={suggestions.length > 0}
                aria-haspopup="listbox"
                aria-autocomplete="list"
                aria-activedescendant={activeIdx >= 0 ? `suggestion-${activeIdx}` : undefined}
                className="w-full pl-9 pr-3 py-1.5 text-sm bg-forest-800 text-white placeholder-forest-300 rounded-lg border border-forest-600 focus:outline-none focus:border-cream-300 focus:ring-1 focus:ring-cream-300 transition"
              />
              {Dropdown}
            </div>
          </form>

          <div className="ml-auto flex items-center gap-2">
            {/* Install App button — only shown when browser fires beforeinstallprompt */}
            {installPrompt && (
              <button
                onClick={handleInstall}
                aria-label="Install WildHome as an app"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-forest-500 hover:bg-forest-400 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <span>⬇</span>
                Install App
              </button>
            )}
            {/* Dark mode toggle — min 44×44 tap target */}
            <button
              onClick={() => setDarkMode(d => !d)}
              aria-label="Toggle dark mode"
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              className="w-11 h-11 flex items-center justify-center rounded-lg bg-forest-600 hover:bg-forest-500 text-white transition-colors text-lg"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            {/* My Garden button */}
            <button
              onClick={onGardenOpen}
              className="relative flex items-center gap-1.5 px-3 py-1.5 bg-terra-500 hover:bg-terra-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <span>🌱</span>
              <span className="hidden sm:inline">My Garden</span>
              {gardenCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-forest-900 text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                  {gardenCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        <form
          onSubmit={handleSubmit}
          className="sm:hidden pb-2"
          autoComplete="off"
        >
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-forest-300 text-sm select-none pointer-events-none">🔍</span>
            <input
              type="search"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search flowers…"
              aria-label="Search flowers"
              className="w-full pl-9 pr-3 py-1.5 text-sm bg-forest-800 text-white placeholder-forest-300 rounded-lg border border-forest-600 focus:outline-none focus:border-cream-300"
            />
            {/* Mobile dropdown shares the same `suggestions` state */}
            {suggestions.length > 0 && (
              <ul
                role="listbox"
                aria-label="Flower suggestions"
                className="absolute left-0 right-0 top-full mt-1 z-50 bg-forest-800 border border-forest-600 rounded-xl shadow-xl overflow-hidden"
              >
                {suggestions.map((f, i) => {
                  const swatchClass = COLOR_SWATCH[(f.colors ?? [])[0]] ?? 'bg-gray-400';
                  return (
                    <li
                      key={f.id}
                      role="option"
                      aria-selected={i === activeIdx}
                      onMouseDown={() => selectSuggestion(f)}
                      className="flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors text-sm text-forest-100 hover:bg-forest-700 active:bg-forest-600"
                    >
                      <span className={`flex-shrink-0 w-3 h-3 rounded-full ${swatchClass} border border-forest-500`} />
                      <span className="flex-1 min-w-0">
                        <span className="block truncate leading-snug">
                          <Highlight text={f.commonName} query={inputVal} />
                        </span>
                        <span className="block truncate text-xs text-forest-300 italic leading-snug">
                          {f.scientificName}
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </form>
      </div>
    </header>
  );
}
