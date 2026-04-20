import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const REGIONS = ['Northeast', 'Southeast', 'Midwest', 'Southwest', 'Pacific Northwest', 'Mountain West'];

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

// Planting calendar data for each region.
// Keys: seeds (start indoors), sow (direct sow outdoors), transplant (set out seedlings)
// Values: arrays of month indices (0=January)
const CALENDAR = {
  Northeast: {
    frost: { last: 'Late April – mid-May', first: 'Late September – October' },
    seeds:      [1, 2, 3],        // Feb–Apr: start seeds indoors
    sow:        [3, 4, 8, 9],     // Apr–May, Sep–Oct: direct sow
    transplant: [4, 5],           // May–Jun: transplant seedlings
    notes: [
      { month: 0, text: 'Winter-sow hardy native seeds in milk jugs outdoors' },
      { month: 2, text: 'Start coneflowers, black-eyed susans, and asters indoors' },
      { month: 4, text: 'Safe to transplant after last frost (check local date)' },
      { month: 8, text: 'Direct-sow prairie seeds for cold stratification overwinter' },
      { month: 10, text: 'Divide existing perennials before ground freezes' },
    ],
  },
  Southeast: {
    frost: { last: 'Mid-February – March', first: 'November – December' },
    seeds:      [0, 1, 7, 8],     // Jan–Feb, Aug–Sep: start seeds indoors
    sow:        [1, 2, 8, 9],     // Feb–Mar, Sep–Oct: direct sow
    transplant: [2, 3, 9, 10],    // Mar–Apr, Oct–Nov: transplant
    notes: [
      { month: 1, text: 'Start seeds of milkweed, coneflower, and native salvias indoors' },
      { month: 2, text: 'Safe to transplant in most of the Southeast after last frost' },
      { month: 7, text: 'Start fall garden — many natives prefer fall planting in the South' },
      { month: 9, text: 'Ideal planting month for most Southeast natives' },
      { month: 11, text: 'Winter is mild enough for continued planting in Zone 8–9 areas' },
    ],
  },
  Midwest: {
    frost: { last: 'Late April – mid-May', first: 'Early October' },
    seeds:      [1, 2, 3],        // Feb–Apr
    sow:        [3, 4, 9, 10],    // Apr–May, Oct–Nov (cold stratification)
    transplant: [4, 5],           // May–Jun
    notes: [
      { month: 0, text: 'Winter-sow prairie natives in containers left outside to stratify' },
      { month: 2, text: 'Start blazing star, prairie smoke, and goldenrod indoors 6–8 weeks before last frost' },
      { month: 4, text: 'Best transplanting window after last frost' },
      { month: 9, text: 'Fall sowing of native prairie seed is highly effective in the Midwest' },
      { month: 10, text: 'Scatter seed on bare soil before snow — freeze-thaw stratifies naturally' },
    ],
  },
  Southwest: {
    frost: { last: 'February – March (varies by elevation)', first: 'October – November' },
    seeds:      [0, 1, 7, 8],     // Jan–Feb, Aug–Sep
    sow:        [0, 1, 8, 9],     // Jan–Feb, Sep–Oct
    transplant: [2, 3, 9, 10],    // Mar–Apr, Sep–Oct
    notes: [
      { month: 0, text: 'Desert annuals like poppies and globe mallow can be sown in January' },
      { month: 8, text: 'Monsoon season — excellent time to transplant desert natives with natural rainfall' },
      { month: 9, text: 'Fall planting is best for most Southwest shrubs and perennials' },
      { month: 11, text: 'Desert winters are mild — cool-season wildflowers can be established now' },
    ],
  },
  'Pacific Northwest': {
    frost: { last: 'March – April (west of Cascades)', first: 'November' },
    seeds:      [1, 2, 3],        // Feb–Apr
    sow:        [2, 3, 9, 10],    // Mar–Apr, Sep–Oct
    transplant: [3, 4, 5],        // Apr–Jun
    notes: [
      { month: 2, text: 'Start camas, columbine, and bleeding heart indoors' },
      { month: 3, text: 'Wet spring soils are ideal for transplanting natives in the PNW' },
      { month: 8, text: 'Late summer — reduce competition by clearing invasive grasses before fall planting' },
      { month: 9, text: 'Fall rains make October–November ideal for planting shrubs and trees' },
      { month: 10, text: 'Native bulbs like camas can be planted in fall for spring bloom' },
    ],
  },
  'Mountain West': {
    frost: { last: 'Mid-May – June (elevation-dependent)', first: 'Mid-September – October' },
    seeds:      [2, 3, 4],        // Mar–May: start indoors
    sow:        [4, 5, 9, 10],    // May–Jun, Sep–Oct
    transplant: [5, 6],           // Jun–Jul
    notes: [
      { month: 0, text: 'Winter-sow alpine and subalpine natives in deep winter for natural cold stratification' },
      { month: 3, text: 'Start penstemons, columbines, and native grasses indoors 8 weeks before last frost' },
      { month: 5, text: 'Short window after last frost — plant as soon as soil is workable' },
      { month: 8, text: 'Scatter seed in September before first frost for spring germination' },
      { month: 9, text: 'Plant native shrubs and perennials in fall with good establishment before winter' },
    ],
  },
};

const MONTH_ABBR = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function MonthCell({ monthIdx, seeds, sow, transplant, frost, notes, isCurrent }) {
  const hasSeed       = seeds.includes(monthIdx);
  const hasSow        = sow.includes(monthIdx);
  const hasTransplant = transplant.includes(monthIdx);
  const monthNote     = notes.find(n => n.month === monthIdx);

  return (
    <div
      className={`rounded-xl border p-3 text-xs ${
        isCurrent
          ? 'border-terra-400 ring-2 ring-terra-300 bg-terra-50 dark:bg-terra-900/30'
          : 'border-cream-200 dark:border-gray-700 bg-white dark:bg-gray-800'
      }`}
    >
      <div className="font-bold text-gray-700 dark:text-gray-200 mb-2">
        {MONTH_ABBR[monthIdx]}
        {isCurrent && <span className="ml-1 text-terra-500 text-xs">← Now</span>}
      </div>
      <div className="space-y-1">
        {hasSeed       && <div className="flex items-center gap-1 text-purple-700"><span>🌱</span> Start seeds indoors</div>}
        {hasSow        && <div className="flex items-center gap-1 text-green-700"><span>🌿</span> Direct sow outdoors</div>}
        {hasTransplant && <div className="flex items-center gap-1 text-forest-700"><span>🌸</span> Transplant seedlings</div>}
        {!hasSeed && !hasSow && !hasTransplant && (
          <div className="text-gray-300">—</div>
        )}
      </div>
      {monthNote && (
        <p className="mt-2 text-gray-500 dark:text-gray-400 leading-snug text-xs border-t border-cream-100 dark:border-gray-700 pt-1">
          {monthNote.text}
        </p>
      )}
    </div>
  );
}

export default function PlantingCalendar() {
  const [activeRegion, setActiveRegion] = useState('Northeast');
  const currentMonthIdx = new Date().getMonth();
  const cal = CALENDAR[activeRegion];

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-gray-900">
      <Helmet>
        <title>Planting Calendar | WildHome</title>
        <meta name="description" content="Find the best times to start seeds, direct sow, and transplant native wildflowers in your US region." />
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
          <span className="text-forest-300 text-sm hidden sm:inline">/ Planting Calendar</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-3">
            Native Wildflower Planting Calendar
          </h1>
          <p className="text-gray-500 max-w-2xl leading-relaxed">
            Know when to start seeds indoors, direct sow outside, and transplant seedlings
            — organized by US region and cross-referenced with native wildflower bloom data.
          </p>
        </div>

        {/* Region selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          {REGIONS.map(r => (
            <button
              key={r}
              onClick={() => setActiveRegion(r)}
              className={`px-4 py-2 text-sm font-medium rounded-xl border transition-colors ${
                activeRegion === r
                  ? 'bg-forest-600 text-white border-forest-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-forest-400'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Frost dates banner */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl px-5 py-3 flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
          <span className="text-2xl">❄️</span>
          <div>
            <span className="font-medium text-blue-800">{activeRegion} frost dates (approximate):</span>
            <span className="text-blue-700 ml-2">Last frost: {cal.frost.last}</span>
            <span className="text-blue-500 mx-2">·</span>
            <span className="text-blue-700">First frost: {cal.frost.first}</span>
          </div>
          <p className="text-xs text-blue-500 sm:ml-auto">Check your local extension office for your exact zip code frost dates.</p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-5 text-xs text-gray-600">
          <span className="flex items-center gap-1"><span>🌱</span> Start seeds indoors</span>
          <span className="flex items-center gap-1"><span>🌿</span> Direct sow outdoors</span>
          <span className="flex items-center gap-1"><span>🌸</span> Transplant seedlings</span>
          <span className="ml-auto flex items-center gap-1 text-terra-600 font-medium"><span>←</span> Current month</span>
        </div>

        {/* 12-month grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-10">
          {MONTHS.map((_, mi) => (
            <MonthCell
              key={mi}
              monthIdx={mi}
              seeds={cal.seeds}
              sow={cal.sow}
              transplant={cal.transplant}
              frost={cal.frost}
              notes={cal.notes}
              isCurrent={mi === currentMonthIdx}
            />
          ))}
        </div>

        {/* Back link */}
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-forest-600 hover:text-forest-800 hover:underline">
          ← Back to WildHome
        </Link>
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
