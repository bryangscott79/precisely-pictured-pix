import { useState, useEffect, useCallback } from 'react';
import { Channel } from '@/data/channels';
import { LocalNewsStation } from '@/data/localNewsStations';

const LOCAL_NEWS_STORAGE_KEY = 'epishow-local-news-station';

// Custom event for local news changes
const LOCAL_NEWS_CHANGED_EVENT = 'epishow-local-news-changed';

// Hook to get the user's configured local news station (reactive)
export function useLocalNewsStation(): LocalNewsStation | null {
  const [station, setStation] = useState<LocalNewsStation | null>(() => {
    const saved = localStorage.getItem(LOCAL_NEWS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    // Listen for changes from other components
    const handleChange = () => {
      const saved = localStorage.getItem(LOCAL_NEWS_STORAGE_KEY);
      if (saved) {
        try {
          setStation(JSON.parse(saved));
        } catch {
          setStation(null);
        }
      } else {
        setStation(null);
      }
    };

    window.addEventListener(LOCAL_NEWS_CHANGED_EVENT, handleChange);
    // Also listen for storage events from other tabs
    window.addEventListener('storage', (e) => {
      if (e.key === LOCAL_NEWS_STORAGE_KEY) handleChange();
    });

    return () => {
      window.removeEventListener(LOCAL_NEWS_CHANGED_EVENT, handleChange);
    };
  }, []);

  return station;
}

// Hook to get local news channel (reactive, based on station)
export function useLocalNewsChannel(): Channel | null {
  const station = useLocalNewsStation();
  
  if (!station) return null;
  
  return createLocalNewsChannel(station);
}

// Get the saved local news station (non-hook version for use in other contexts)
export function getSavedLocalNewsStation(): LocalNewsStation | null {
  const savedStation = localStorage.getItem(LOCAL_NEWS_STORAGE_KEY);
  if (savedStation) {
    try {
      return JSON.parse(savedStation);
    } catch {
      return null;
    }
  }
  return null;
}

// Save local news station and dispatch change event
export function saveLocalNewsStation(station: LocalNewsStation, zipCode: string): void {
  localStorage.setItem(LOCAL_NEWS_STORAGE_KEY, JSON.stringify(station));
  localStorage.setItem('epishow-local-zip', zipCode);
  // Dispatch custom event so hooks can react
  window.dispatchEvent(new CustomEvent(LOCAL_NEWS_CHANGED_EVENT));
}

// Clear local news station
export function clearLocalNewsStation(): void {
  localStorage.removeItem(LOCAL_NEWS_STORAGE_KEY);
  localStorage.removeItem('epishow-local-zip');
  window.dispatchEvent(new CustomEvent(LOCAL_NEWS_CHANGED_EVENT));
}

// Create a local news channel from a station
export function createLocalNewsChannel(station: LocalNewsStation): Channel {
  return {
    id: 'localnews',
    name: station.name,
    icon: '📺',
    color: 'localnews',
    category: 'entertainment',
    contentRating: 'PG-13',
    description: `Live local news from ${station.city}, ${station.state}`,
    videos: [], // Populated dynamically
  };
}
