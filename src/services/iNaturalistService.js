// iNaturalist API v1 integration.
// Docs: https://api.inaturalist.org/v1/docs/
// Rate limit: ~100 requests/min unauthenticated — responses are cached to stay well under this.

import { cachedFetch, cacheGet, cacheSet } from '../utils/cache';

const BASE = 'https://api.inaturalist.org/v1';

// ── API availability tracking ─────────────────────────────────────────────────
let _apiDown = false;
let _listeners = new Set();

export function isApiDown() { return _apiDown; }

export function subscribeApiStatus(fn) {
  _listeners.add(fn);
  return () => _listeners.delete(fn);
}

function _setApiDown(val) {
  if (_apiDown === val) return;
  _apiDown = val;
  _listeners.forEach(fn => fn(val));
}

export function resetApiStatus() {
  _setApiDown(false);
}

// TTLs
const TTL_TAXON  = 7  * 24 * 60 * 60 * 1000; // 7 days — species data rarely changes
const TTL_PHOTOS = 24 * 60 * 60 * 1000;        // 24 hours
const TTL_OBS    = 6  * 60 * 60 * 1000;         // 6 hours — observation counts change

// Shared fetch with retry + CORS-friendly error handling
async function apiFetch(path, params = {}) {
  const url = new URL(`${BASE}${path}`);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) url.searchParams.set(k, v);
  });

  let attempt = 0;
  while (attempt < 3) {
    try {
      const res = await fetch(url.toString(), {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(12000),
      });
      if (!res.ok) {
        if (res.status === 429) {
          // Rate limited — back off
          await sleep(2000 * (attempt + 1));
          attempt++;
          continue;
        }
        throw new Error(`iNaturalist API error ${res.status}`);
      }
      // Successful response — mark API as available
      _setApiDown(false);
      return res.json();
    } catch (err) {
      if (attempt >= 2) {
        // All retries exhausted — mark API as down for network/timeout errors
        if (err?.name === 'TypeError' || err?.name === 'TimeoutError' || err?.message?.includes('timeout')) {
          _setApiDown(true);
        }
        throw err;
      }
      await sleep(1000 * (attempt + 1));
      attempt++;
    }
  }
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// ── Taxon search ──────────────────────────────────────────────────────────────

/**
 * Search for a plant taxon by scientific or common name.
 * Returns the best matching taxon object or null.
 */
export async function searchTaxon(name) {
  const key = `taxon_search_${name.toLowerCase().replace(/\s+/g, '_')}`;
  return cachedFetch(key, async () => {
    const data = await apiFetch('/taxa', {
      q: name,
      rank: 'species',
      iconic_taxon_name: 'Plantae',
      per_page: 5,
    });
    return data?.results?.[0] ?? null;
  }, TTL_TAXON);
}

/**
 * Get a specific taxon by its iNaturalist ID.
 */
export async function getTaxon(id) {
  const key = `taxon_${id}`;
  return cachedFetch(key, async () => {
    const data = await apiFetch(`/taxa/${id}`);
    return data?.results?.[0] ?? null;
  }, TTL_TAXON);
}

/**
 * Fetch photo URL + wikipedia summary for a flower.
 * Falls back to name search if taxonId is null.
 *
 * Returns { photoUrl, thumbUrl, attribution, summary, inatUrl } or {}
 */
export async function fetchFlowerMedia(scientificName, taxonId = null) {
  const key = `flower_media_${taxonId ?? scientificName.toLowerCase().replace(/\s+/g, '_')}`;
  return cachedFetch(key, async () => {
    let taxon = null;

    if (taxonId) {
      taxon = await getTaxon(taxonId).catch(() => null);
    }
    if (!taxon) {
      taxon = await searchTaxon(scientificName).catch(() => null);
    }
    if (!taxon) return {};

    const photo = taxon.default_photo;
    return {
      photoUrl:    photo?.medium_url    ?? null,
      thumbUrl:    photo?.square_url    ?? null,
      attribution: photo?.attribution   ?? null,
      licenseCode: photo?.license_code  ?? null,
      summary:     taxon.wikipedia_summary ?? taxon.description ?? null,
      inatUrl:     `https://www.inaturalist.org/taxa/${taxon.id}`,
      inatId:      taxon.id,
    };
  }, TTL_PHOTOS);
}

// ── Place (state) resolution ──────────────────────────────────────────────────

/**
 * Resolve an iNaturalist place_id for a US state name.
 * Uses the /places/autocomplete endpoint and caches the result long-term.
 */
export async function resolveStatePlaceId(stateName) {
  const key = `place_id_${stateName.toLowerCase().replace(/\s+/g, '_')}`;
  return cachedFetch(key, async () => {
    const data = await apiFetch('/places/autocomplete', {
      q: stateName,
      per_page: 10,
    });
    // Find the admin_level=1 result that best matches the state name
    const results = data?.results ?? [];
    const match = results.find(p =>
      p.admin_level === 1 &&
      (p.name?.toLowerCase() === stateName.toLowerCase() ||
       p.display_name?.toLowerCase().startsWith(stateName.toLowerCase()))
    ) ?? results.find(p => p.admin_level === 1);
    return match?.id ?? null;
  }, TTL_TAXON);
}

// ── Observations for map markers ──────────────────────────────────────────────

/**
 * Fetch research-grade observation points for a taxon in a place.
 * Returns array of { lat, lng, id, quality } for map markers.
 */
export async function getObservations(taxonId, placeId = null, limit = 40) {
  const key = `obs_${taxonId}_${placeId ?? 'us'}_${limit}`;
  return cachedFetch(key, async () => {
    const params = {
      taxon_id: taxonId,
      quality_grade: 'research',
      per_page: limit,
      order_by: 'votes',
      photos: true,
      geo: true,
      // Constrain to continental US
      nelat:  49.4,
      nelng:  -66.9,
      swlat:  24.4,
      swlng: -125.0,
    };
    if (placeId) params.place_id = placeId;

    const data = await apiFetch('/observations', params);
    return (data?.results ?? [])
      .filter(o => o.location)
      .map(o => {
        const [lat, lng] = o.location.split(',').map(Number);
        return { lat, lng, id: o.id, quality: o.quality_grade };
      });
  }, TTL_OBS);
}

// ── Observation count for a taxon ────────────────────────────────────────────

/**
 * Fetch the total number of research-grade observations for a taxon globally.
 * Returns a number or null if unavailable.
 */
export async function getTaxonObservationCount(taxonId) {
  if (!taxonId) return null;
  const key = `obs_count_${taxonId}`;
  return cachedFetch(key, async () => {
    const data = await apiFetch('/observations', {
      taxon_id: taxonId,
      quality_grade: 'research',
      per_page: 0,
    });
    return data?.total_results ?? null;
  }, TTL_OBS);
}

// ── Native taxa by place ──────────────────────────────────────────────────────

/**
 * Fetch a list of native plant taxa observed in a given iNaturalist place.
 * Returns an array of { inatId, scientificName, commonName, photoUrl, thumbUrl, inatUrl }
 */
export async function getNativePlantsByPlace(placeId, limit = 30) {
  const key = `native_plants_place_${placeId}_${limit}`;
  return cachedFetch(key, async () => {
    // Use observations endpoint with native=true to get taxa native to this place
    const data = await apiFetch('/observations/species_counts', {
      place_id: placeId,
      iconic_taxon_name: 'Plantae',
      quality_grade: 'research',
      native: true,
      rank: 'species',
      per_page: limit,
      order_by: 'observations_count',
    });
    return (data?.results ?? []).map(r => ({
      inatId:        r.taxon?.id,
      scientificName: r.taxon?.name,
      commonName:    r.taxon?.preferred_common_name ?? r.taxon?.name,
      photoUrl:      r.taxon?.default_photo?.medium_url ?? null,
      thumbUrl:      r.taxon?.default_photo?.square_url ?? null,
      inatUrl:       `https://www.inaturalist.org/taxa/${r.taxon?.id}`,
      count:         r.count,
    }));
  }, TTL_OBS);
}
