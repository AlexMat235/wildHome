import { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import { STATE_BY_NAME } from '../data/stateData';
import { cacheGet, cacheSet } from '../utils/cache';
import { getObservations } from '../services/iNaturalistService';

const GEOJSON_URL =
  'https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json';

const STYLE_DEFAULT  = { fillColor: '#d4e8d4', fillOpacity: 0.55, color: '#ffffff', weight: 1.5 };
const STYLE_NATIVE   = { fillColor: '#4a7c59', fillOpacity: 0.75, color: '#ffffff', weight: 1.5 };
const STYLE_CURRENT  = { fillColor: '#c17d3c', fillOpacity: 0.65, color: '#ffffff', weight: 2.5 };
const STYLE_HOVER    = { fillColor: '#8b6914', fillOpacity: 0.35, color: '#ffffff', weight: 2 };

// Fly-to helper — must live inside MapContainer
function MapController({ currentState }) {
  const map = useMap();
  useEffect(() => {
    if (!currentState) return;
    const state = Object.values(STATE_BY_NAME).find(
      s => s.abbr?.toLowerCase() === currentState.toLowerCase() ||
           s.name?.toLowerCase() === currentState.toLowerCase()
    ) || STATE_BY_NAME[currentState];
    if (state?.lat) {
      map.flyTo([state.lat, state.lng], 6, { duration: 1.2 });
    }
  }, [currentState, map]);
  return null;
}

export default function MapView({ currentState, selectedFlower, nativeStates = [], onStateClick }) {
  const [geoJson, setGeoJson]         = useState(null);
  const [geoError, setGeoError]       = useState(false);
  const [observations, setObservations] = useState([]);
  const geoJsonRef = useRef(null);

  // Load US states GeoJSON (cached in localStorage)
  useEffect(() => {
    const cached = cacheGet('us_states_geojson');
    if (cached) { setGeoJson(cached); return; }

    fetch(GEOJSON_URL)
      .then(r => r.json())
      .then(data => {
        cacheSet('us_states_geojson', data, 30 * 24 * 60 * 60 * 1000); // 30 days
        setGeoJson(data);
      })
      .catch(() => setGeoError(true));
  }, []);

  // Load observations for the selected flower
  useEffect(() => {
    if (!selectedFlower?.iNaturalistTaxonId) {
      setObservations([]);
      return;
    }
    let cancelled = false;
    getObservations(selectedFlower.iNaturalistTaxonId, null, 60)
      .then(obs => { if (!cancelled) setObservations(obs); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [selectedFlower?.iNaturalistTaxonId]);

  // Re-apply GeoJSON styles whenever nativeStates / currentState changes
  useEffect(() => {
    if (!geoJsonRef.current) return;
    geoJsonRef.current.eachLayer(layer => {
      const name  = layer.feature?.properties?.name ?? '';
      const abbr  = STATE_BY_NAME[name.toLowerCase()]?.abbr ?? '';
      layer.setStyle(getStyle(abbr));
    });
  }, [nativeStates, currentState]); // eslint-disable-line

  const getStyle = useCallback((abbr) => {
    if (abbr && abbr === currentState)          return STYLE_CURRENT;
    if (abbr && nativeStates.includes(abbr))    return STYLE_NATIVE;
    return STYLE_DEFAULT;
  }, [nativeStates, currentState]);

  const styleFeature = useCallback((feature) => {
    const name = feature.properties?.name ?? '';
    const abbr = STATE_BY_NAME[name.toLowerCase()]?.abbr ?? '';
    return getStyle(abbr);
  }, [getStyle]);

  const onEachFeature = useCallback((feature, layer) => {
    const name = feature.properties?.name ?? '';
    const abbr = STATE_BY_NAME[name.toLowerCase()]?.abbr ?? '';

    layer.on({
      mouseover(e) {
        if (abbr !== currentState && !nativeStates.includes(abbr)) {
          e.target.setStyle(STYLE_HOVER);
        }
        e.target.bringToFront();
      },
      mouseout(e) {
        e.target.setStyle(getStyle(abbr));
      },
      click() {
        if (abbr) onStateClick(abbr, name);
      },
    });

    // Tooltip: show state name + native count hint
    const nativeCount = nativeStates.length;
    const hint = selectedFlower && nativeStates.includes(abbr)
      ? `\n✓ Native range of ${selectedFlower.commonName}`
      : '';
    layer.bindTooltip(`<strong>${name}</strong>${hint ? `<br/><span style="color:#4a7c59;font-size:11px">${hint.trim()}</span>` : ''}`, {
      direction: 'auto',
      sticky: true,
    });
  }, [currentState, nativeStates, selectedFlower, onStateClick, getStyle]);

  return (
    <div className="relative rounded-xl2 overflow-hidden border border-forest-200 shadow-card map-wrapper" style={{ minHeight: '300px' }}>
      <MapContainer
        center={[38.5, -96]}
        zoom={4}
        style={{ height: 'clamp(300px, 42vw, 420px)', width: '100%' }}
        scrollWheelZoom={false}
        zoomControl={true}
        attributionControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          opacity={0.4}
        />

        {geoJson && (
          <GeoJSON
            key={`${currentState ?? 'none'}-${nativeStates.join(',')}`}
            data={geoJson}
            style={styleFeature}
            onEachFeature={onEachFeature}
            ref={geoJsonRef}
          />
        )}

        {/* Observation markers */}
        {observations.map(obs => (
          <CircleMarker
            key={obs.id}
            center={[obs.lat, obs.lng]}
            radius={5}
            pathOptions={{
              fillColor: '#4a7c59',
              fillOpacity: 0.8,
              color: '#ffffff',
              weight: 1,
            }}
          >
            <Tooltip>
              {selectedFlower?.commonName ?? 'Observation'}
              <br />
              <span style={{ fontSize: '11px', color: '#666' }}>iNaturalist sighting</span>
            </Tooltip>
          </CircleMarker>
        ))}

        {currentState && <MapController currentState={currentState} />}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg shadow px-3 py-2 text-xs space-y-1 z-[1000] pointer-events-none">
        {selectedFlower ? (
          <>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm inline-block" style={{ background: '#4a7c59' }} />
              <span>Native range</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full inline-block" style={{ background: '#4a7c59' }} />
              <span>iNat sighting</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm inline-block" style={{ background: '#c17d3c' }} />
              <span>Your state</span>
            </div>
            <div className="text-gray-400 italic">Click a state to explore</div>
          </>
        )}
      </div>

      {/* Loading / error overlay */}
      {!geoJson && !geoError && (
        <div className="absolute inset-0 flex items-center justify-center bg-cream-50/70">
          <span className="text-forest-600 text-sm animate-pulse">Loading map…</span>
        </div>
      )}
      {geoError && (
        <div className="absolute inset-0 flex items-center justify-center bg-cream-50/70">
          <p className="text-gray-500 text-sm text-center px-6">
            Map unavailable (network error). Flower data still works above.
          </p>
        </div>
      )}
    </div>
  );
}
