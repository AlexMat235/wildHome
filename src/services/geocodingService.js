// Location resolution service — entirely client-side, no external API calls.
// The only supported input is a US state name or 2-letter abbreviation.
// All lookups are done against the in-memory STATE_DATA table.
//
// No user data is transmitted to any server.

// ── State data ────────────────────────────────────────────────────────────────

// State abbreviation → { name, lat, lng }
export const US_STATE_NAMES = {
  AL: { name: 'Alabama',              lat: 32.8,  lng: -86.8  },
  AK: { name: 'Alaska',               lat: 64.2,  lng: -153.4 },
  AZ: { name: 'Arizona',              lat: 34.3,  lng: -111.1 },
  AR: { name: 'Arkansas',             lat: 34.8,  lng: -92.2  },
  CA: { name: 'California',           lat: 37.2,  lng: -119.0 },
  CO: { name: 'Colorado',             lat: 39.0,  lng: -105.5 },
  CT: { name: 'Connecticut',          lat: 41.6,  lng: -72.7  },
  DC: { name: 'Washington DC',        lat: 38.9,  lng: -77.0  },
  DE: { name: 'Delaware',             lat: 39.0,  lng: -75.5  },
  FL: { name: 'Florida',              lat: 28.6,  lng: -81.5  },
  GA: { name: 'Georgia',              lat: 32.7,  lng: -83.4  },
  HI: { name: 'Hawaii',               lat: 20.3,  lng: -156.4 },
  ID: { name: 'Idaho',                lat: 44.4,  lng: -114.6 },
  IL: { name: 'Illinois',             lat: 40.0,  lng: -89.2  },
  IN: { name: 'Indiana',              lat: 39.9,  lng: -86.3  },
  IA: { name: 'Iowa',                 lat: 42.0,  lng: -93.2  },
  KS: { name: 'Kansas',               lat: 38.5,  lng: -98.4  },
  KY: { name: 'Kentucky',             lat: 37.5,  lng: -85.3  },
  LA: { name: 'Louisiana',            lat: 31.1,  lng: -91.9  },
  ME: { name: 'Maine',                lat: 45.4,  lng: -69.0  },
  MD: { name: 'Maryland',             lat: 39.1,  lng: -76.8  },
  MA: { name: 'Massachusetts',        lat: 42.3,  lng: -71.8  },
  MI: { name: 'Michigan',             lat: 44.3,  lng: -85.4  },
  MN: { name: 'Minnesota',            lat: 46.4,  lng: -93.1  },
  MS: { name: 'Mississippi',          lat: 32.7,  lng: -89.7  },
  MO: { name: 'Missouri',             lat: 38.5,  lng: -92.5  },
  MT: { name: 'Montana',              lat: 47.0,  lng: -110.5 },
  NE: { name: 'Nebraska',             lat: 41.5,  lng: -99.9  },
  NV: { name: 'Nevada',               lat: 39.5,  lng: -116.9 },
  NH: { name: 'New Hampshire',        lat: 44.0,  lng: -71.6  },
  NJ: { name: 'New Jersey',           lat: 40.1,  lng: -74.5  },
  NM: { name: 'New Mexico',           lat: 34.5,  lng: -106.1 },
  NY: { name: 'New York',             lat: 42.9,  lng: -75.5  },
  NC: { name: 'North Carolina',       lat: 35.6,  lng: -79.8  },
  ND: { name: 'North Dakota',         lat: 47.5,  lng: -100.5 },
  OH: { name: 'Ohio',                 lat: 40.4,  lng: -82.8  },
  OK: { name: 'Oklahoma',             lat: 35.6,  lng: -97.5  },
  OR: { name: 'Oregon',               lat: 44.6,  lng: -122.1 },
  PA: { name: 'Pennsylvania',         lat: 40.6,  lng: -77.2  },
  RI: { name: 'Rhode Island',         lat: 41.7,  lng: -71.6  },
  SC: { name: 'South Carolina',       lat: 33.9,  lng: -80.9  },
  SD: { name: 'South Dakota',         lat: 44.4,  lng: -100.2 },
  TN: { name: 'Tennessee',            lat: 35.9,  lng: -86.4  },
  TX: { name: 'Texas',                lat: 31.5,  lng: -99.3  },
  UT: { name: 'Utah',                 lat: 39.3,  lng: -111.1 },
  VT: { name: 'Vermont',              lat: 44.1,  lng: -72.7  },
  VA: { name: 'Virginia',             lat: 37.5,  lng: -78.8  },
  WA: { name: 'Washington',           lat: 47.4,  lng: -120.5 },
  WV: { name: 'West Virginia',        lat: 38.9,  lng: -80.4  },
  WI: { name: 'Wisconsin',            lat: 44.6,  lng: -89.6  },
  WY: { name: 'Wyoming',              lat: 43.0,  lng: -107.6 },
};

// Full state name → abbreviation (all lowercase keys)
const NAME_TO_ABBR = Object.fromEntries(
  Object.entries(US_STATE_NAMES).map(([abbr, s]) => [s.name.toLowerCase(), abbr])
);

// ── resolveState ──────────────────────────────────────────────────────────────
//
// Accepts a state name ("Ohio"), abbreviation ("OH"), or "washington dc" style.
// Returns a location object or null if not recognized.
// No network request is made.

export function resolveState(query) {
  const trimmed = query.trim();
  if (!trimmed) return null;

  // Try 2-letter abbreviation first
  const upperAbbr = trimmed.toUpperCase();
  if (US_STATE_NAMES[upperAbbr]) {
    const s = US_STATE_NAMES[upperAbbr];
    return {
      state:       upperAbbr,
      stateName:   s.name,
      displayName: s.name,
      lat:         s.lat,
      lng:         s.lng,
    };
  }

  // Try full name match (case-insensitive)
  const lower = trimmed.toLowerCase();
  const abbr  = NAME_TO_ABBR[lower];
  if (abbr) {
    const s = US_STATE_NAMES[abbr];
    return {
      state:       abbr,
      stateName:   s.name,
      displayName: s.name,
      lat:         s.lat,
      lng:         s.lng,
    };
  }

  // Try prefix match (e.g. "north" matches "North Carolina" first, then "North Dakota")
  const prefixEntry = Object.entries(NAME_TO_ABBR).find(([name]) => name.startsWith(lower));
  if (prefixEntry) {
    const [, abbr2] = prefixEntry;
    const s = US_STATE_NAMES[abbr2];
    return {
      state:       abbr2,
      stateName:   s.name,
      displayName: s.name,
      lat:         s.lat,
      lng:         s.lng,
    };
  }

  return null;
}

// ── geocodeText (kept for backward compatibility) ─────────────────────────────
// Wraps resolveState; throws if not found so callers using async/await work.
export async function geocodeText(query) {
  const loc = resolveState(query);
  if (!loc) throw new Error('State not recognized. Try a full name like "Ohio" or abbreviation "OH".');
  return loc;
}
