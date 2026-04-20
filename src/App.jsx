import { createContext, useContext, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { useLocalStorage } from './hooks/useLocalStorage';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import PrivacyPolicy from './pages/PrivacyPolicy';
import InvasiveAlternatives from './pages/InvasiveAlternatives';
import PlantingCalendar from './pages/PlantingCalendar';

// ── Garden context ──────────────────────────────────────────────────────────
// Provides garden wishlist state to any component in the tree.

export const GardenContext = createContext({
  gardenFlowers: [],
  toggleGarden:  () => {},
  isInGarden:    () => false,
});

export function useGarden() {
  return useContext(GardenContext);
}

function GardenProvider({ children }) {
  const [gardenFlowers, setGardenFlowers] = useLocalStorage('wildhome_garden', []);

  const isInGarden = useCallback(
    (flowerId) => gardenFlowers.some(f => f.id === flowerId),
    [gardenFlowers]
  );

  const toggleGarden = useCallback((flower) => {
    setGardenFlowers(prev =>
      prev.some(f => f.id === flower.id)
        ? prev.filter(f => f.id !== flower.id)
        : [...prev, flower]
    );
  }, [setGardenFlowers]);

  return (
    <GardenContext.Provider value={{ gardenFlowers, toggleGarden, isInGarden }}>
      {children}
    </GardenContext.Provider>
  );
}

// ── App root ────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <HelmetProvider>
      <GardenProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Shareable flower URL — Home handles opening the modal */}
          <Route path="/flower/:flowerId" element={<Home />} />
          {/* State filter URL — Home pre-selects the state */}
          <Route path="/state/:stateCode" element={<Home />} />
          {/* Additional pages */}
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/invasive-alternatives" element={<InvasiveAlternatives />} />
          <Route path="/planting-calendar" element={<PlantingCalendar />} />
          {/* 404 catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </GardenProvider>
    </HelmetProvider>
  );
}
