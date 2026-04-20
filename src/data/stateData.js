// US State data: names, abbreviations, iNaturalist place IDs, and region groupings.
// iNaturalist place IDs are the admin_level=1 place IDs for each US state.
// These are used to filter observations/taxa by state in the iNaturalist API.

export const US_STATES = [
  { name: 'Alabama',        abbr: 'AL', fips: '01', inatPlaceId: 32,   lat: 32.8,  lng: -86.8  },
  { name: 'Alaska',         abbr: 'AK', fips: '02', inatPlaceId: 19,   lat: 64.2,  lng: -153.4 },
  { name: 'Arizona',        abbr: 'AZ', fips: '04', inatPlaceId: 31,   lat: 34.3,  lng: -111.1 },
  { name: 'Arkansas',       abbr: 'AR', fips: '05', inatPlaceId: 33,   lat: 34.8,  lng: -92.2  },
  { name: 'California',     abbr: 'CA', fips: '06', inatPlaceId: 14,   lat: 37.2,  lng: -119.0 },
  { name: 'Colorado',       abbr: 'CO', fips: '08', inatPlaceId: 34,   lat: 39.0,  lng: -105.5 },
  { name: 'Connecticut',    abbr: 'CT', fips: '09', inatPlaceId: 35,   lat: 41.6,  lng: -72.7  },
  { name: 'Delaware',       abbr: 'DE', fips: '10', inatPlaceId: 36,   lat: 39.0,  lng: -75.5  },
  { name: 'Florida',        abbr: 'FL', fips: '12', inatPlaceId: 21,   lat: 28.6,  lng: -81.5  },
  { name: 'Georgia',        abbr: 'GA', fips: '13', inatPlaceId: 38,   lat: 32.7,  lng: -83.4  },
  { name: 'Hawaii',         abbr: 'HI', fips: '15', inatPlaceId: 39,   lat: 20.3,  lng: -156.4 },
  { name: 'Idaho',          abbr: 'ID', fips: '16', inatPlaceId: 40,   lat: 44.4,  lng: -114.6 },
  { name: 'Illinois',       abbr: 'IL', fips: '17', inatPlaceId: 41,   lat: 40.0,  lng: -89.2  },
  { name: 'Indiana',        abbr: 'IN', fips: '18', inatPlaceId: 42,   lat: 39.9,  lng: -86.3  },
  { name: 'Iowa',           abbr: 'IA', fips: '19', inatPlaceId: 43,   lat: 42.0,  lng: -93.2  },
  { name: 'Kansas',         abbr: 'KS', fips: '20', inatPlaceId: 44,   lat: 38.5,  lng: -98.4  },
  { name: 'Kentucky',       abbr: 'KY', fips: '21', inatPlaceId: 45,   lat: 37.5,  lng: -85.3  },
  { name: 'Louisiana',      abbr: 'LA', fips: '22', inatPlaceId: 46,   lat: 31.1,  lng: -91.9  },
  { name: 'Maine',          abbr: 'ME', fips: '23', inatPlaceId: 47,   lat: 45.4,  lng: -69.0  },
  { name: 'Maryland',       abbr: 'MD', fips: '24', inatPlaceId: 48,   lat: 39.1,  lng: -76.8  },
  { name: 'Massachusetts',  abbr: 'MA', fips: '25', inatPlaceId: 49,   lat: 42.3,  lng: -71.8  },
  { name: 'Michigan',       abbr: 'MI', fips: '26', inatPlaceId: 50,   lat: 44.3,  lng: -85.4  },
  { name: 'Minnesota',      abbr: 'MN', fips: '27', inatPlaceId: 51,   lat: 46.4,  lng: -93.1  },
  { name: 'Mississippi',    abbr: 'MS', fips: '28', inatPlaceId: 52,   lat: 32.7,  lng: -89.7  },
  { name: 'Missouri',       abbr: 'MO', fips: '29', inatPlaceId: 53,   lat: 38.5,  lng: -92.5  },
  { name: 'Montana',        abbr: 'MT', fips: '30', inatPlaceId: 54,   lat: 47.0,  lng: -110.5 },
  { name: 'Nebraska',       abbr: 'NE', fips: '31', inatPlaceId: 55,   lat: 41.5,  lng: -99.9  },
  { name: 'Nevada',         abbr: 'NV', fips: '32', inatPlaceId: 56,   lat: 39.5,  lng: -116.9 },
  { name: 'New Hampshire',  abbr: 'NH', fips: '33', inatPlaceId: 57,   lat: 44.0,  lng: -71.6  },
  { name: 'New Jersey',     abbr: 'NJ', fips: '34', inatPlaceId: 58,   lat: 40.1,  lng: -74.5  },
  { name: 'New Mexico',     abbr: 'NM', fips: '35', inatPlaceId: 59,   lat: 34.5,  lng: -106.1 },
  { name: 'New York',       abbr: 'NY', fips: '36', inatPlaceId: 60,   lat: 42.9,  lng: -75.5  },
  { name: 'North Carolina', abbr: 'NC', fips: '37', inatPlaceId: 61,   lat: 35.6,  lng: -79.8  },
  { name: 'North Dakota',   abbr: 'ND', fips: '38', inatPlaceId: 62,   lat: 47.5,  lng: -100.5 },
  { name: 'Ohio',           abbr: 'OH', fips: '39', inatPlaceId: 63,   lat: 40.4,  lng: -82.8  },
  { name: 'Oklahoma',       abbr: 'OK', fips: '40', inatPlaceId: 64,   lat: 35.6,  lng: -97.5  },
  { name: 'Oregon',         abbr: 'OR', fips: '41', inatPlaceId: 65,   lat: 44.6,  lng: -122.1 },
  { name: 'Pennsylvania',   abbr: 'PA', fips: '42', inatPlaceId: 66,   lat: 40.6,  lng: -77.2  },
  { name: 'Rhode Island',   abbr: 'RI', fips: '44', inatPlaceId: 67,   lat: 41.7,  lng: -71.6  },
  { name: 'South Carolina', abbr: 'SC', fips: '45', inatPlaceId: 68,   lat: 33.9,  lng: -80.9  },
  { name: 'South Dakota',   abbr: 'SD', fips: '46', inatPlaceId: 69,   lat: 44.4,  lng: -100.2 },
  { name: 'Tennessee',      abbr: 'TN', fips: '47', inatPlaceId: 70,   lat: 35.9,  lng: -86.4  },
  { name: 'Texas',          abbr: 'TX', fips: '48', inatPlaceId: 71,   lat: 31.5,  lng: -99.3  },
  { name: 'Utah',           abbr: 'UT', fips: '49', inatPlaceId: 72,   lat: 39.3,  lng: -111.1 },
  { name: 'Vermont',        abbr: 'VT', fips: '50', inatPlaceId: 73,   lat: 44.1,  lng: -72.7  },
  { name: 'Virginia',       abbr: 'VA', fips: '51', inatPlaceId: 74,   lat: 37.5,  lng: -78.8  },
  { name: 'Washington',     abbr: 'WA', fips: '53', inatPlaceId: 75,   lat: 47.4,  lng: -120.5 },
  { name: 'West Virginia',  abbr: 'WV', fips: '54', inatPlaceId: 76,   lat: 38.9,  lng: -80.4  },
  { name: 'Wisconsin',      abbr: 'WI', fips: '55', inatPlaceId: 77,   lat: 44.6,  lng: -89.6  },
  { name: 'Wyoming',        abbr: 'WY', fips: '56', inatPlaceId: 78,   lat: 43.0,  lng: -107.6 },
  { name: 'District of Columbia', abbr: 'DC', fips: '11', inatPlaceId: 37,   lat: 38.9,  lng: -77.0  },
];

// Quick lookup maps
export const STATE_BY_ABBR = Object.fromEntries(US_STATES.map(s => [s.abbr, s]));
export const STATE_BY_NAME = Object.fromEntries(US_STATES.map(s => [s.name.toLowerCase(), s]));

// Regional groupings used by wildflower data
export const REGIONS = {
  Northeast:    ['CT','DE','DC','MA','MD','ME','NH','NJ','NY','PA','RI','VT'],
  Southeast:    ['AL','AR','FL','GA','KY','LA','MS','NC','SC','TN','VA','WV'],
  Midwest:      ['IA','IL','IN','KS','MI','MN','MO','ND','NE','OH','SD','WI'],
  GreatPlains:  ['KS','MO','ND','NE','OK','SD','TX'],
  South:        ['AL','AR','FL','GA','LA','MS','OK','SC','TN','TX'],
  MountainWest: ['AZ','CO','ID','MT','NM','NV','UT','WY'],
  PacificNW:    ['OR','WA'],
  California:   ['CA'],
  West:         ['AZ','CA','CO','ID','MT','NM','NV','OR','UT','WA','WY'],
  Alaska:       ['AK'],
  Hawaii:       ['HI'],
  EasternUS:    ['AL','AR','CT','DC','DE','FL','GA','IA','IL','IN','KS','KY','LA','MA','MD','ME','MI','MN','MO','MS','NC','ND','NE','NH','NJ','NY','OH','OK','PA','RI','SC','SD','TN','TX','VA','VT','WI','WV'],
  AllContinental: ['AL','AR','AZ','CA','CO','CT','DC','DE','FL','GA','IA','ID','IL','IN','KS','KY','LA','MA','MD','ME','MI','MN','MO','MS','MT','NC','ND','NE','NH','NJ','NM','NV','NY','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VA','VT','WA','WI','WV','WY'],
};

/** Expand region keys and abbr lists into a deduplicated array of abbreviations */
export function expandNativeStates(statesOrRegions) {
  const set = new Set();
  statesOrRegions.forEach(token => {
    if (REGIONS[token]) {
      REGIONS[token].forEach(s => set.add(s));
    } else {
      set.add(token);
    }
  });
  return Array.from(set);
}

/** Resolve a plain-text location string to a state abbreviation */
export function resolveStateFromName(input) {
  const trimmed = input.trim().toLowerCase();
  // Try direct name match
  if (STATE_BY_NAME[trimmed]) return STATE_BY_NAME[trimmed];
  // Try abbreviation (case-insensitive)
  const upper = trimmed.toUpperCase();
  if (STATE_BY_ABBR[upper]) return STATE_BY_ABBR[upper];
  // Partial match
  const match = US_STATES.find(s => s.name.toLowerCase().startsWith(trimmed) || trimmed.startsWith(s.abbr.toLowerCase()));
  return match || null;
}
