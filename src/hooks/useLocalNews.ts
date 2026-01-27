import { useState, useEffect } from 'react';
import { Channel, Video } from '@/data/channels';
import { LocalNewsStation } from '@/data/localNewsStations';

// Hook to get the user's configured local news channel
export function useLocalNewsChannel(): Channel | null {
  const [localChannel, setLocalChannel] = useState<Channel | null>(null);

  useEffect(() => {
    // Check localStorage for saved station
    const savedStation = localStorage.getItem('epishow-local-news-station');
    
    if (savedStation) {
      try {
        const station: LocalNewsStation = JSON.parse(savedStation);
        
        // Create a dynamic channel from the station info
        const channel: Channel = {
          id: 'localnews',
          name: `${station.name}`,
          icon: '📺',
          color: 'localnews',
          category: 'entertainment',
          contentRating: 'PG-13',
          description: `Live local news from ${station.city}, ${station.state}`,
          videos: [], // Will be populated dynamically
        };
        
        setLocalChannel(channel);
      } catch (e) {
        console.error('Failed to parse saved local news station:', e);
        setLocalChannel(null);
      }
    } else {
      setLocalChannel(null);
    }
  }, []);

  return localChannel;
}

// Get the saved local news station (non-hook version for use in other contexts)
export function getSavedLocalNewsStation(): LocalNewsStation | null {
  const savedStation = localStorage.getItem('epishow-local-news-station');
  if (savedStation) {
    try {
      return JSON.parse(savedStation);
    } catch {
      return null;
    }
  }
  return null;
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
