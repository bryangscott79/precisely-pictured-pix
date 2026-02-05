// Map of major US metro areas to their local news YouTube live streams
// We map zip code prefixes (first 3 digits) to metro areas

export interface LocalNewsStation {
  name: string;
  youtubeChannelId: string;
  youtubeSearchQuery: string; // Fallback search if no live stream
  callSign: string;
  network: 'FOX' | 'ABC' | 'CBS' | 'NBC' | 'PBS' | 'CW' | 'Independent';
  city: string;
  state: string;
}

export interface MetroArea {
  name: string;
  stations: LocalNewsStation[];
}

// Major metro areas with their local news stations
export const METRO_AREAS: Record<string, MetroArea> = {
  // Atlanta, GA - VERIFIED channel IDs Feb 2025
  'atlanta': {
    name: 'Atlanta',
    stations: [
      {
        name: 'FOX 5 Atlanta',
        youtubeChannelId: 'UCjHWv2DU5-HLpogAAr386DQ', // @fox5atlanta - VERIFIED
        youtubeSearchQuery: 'FOX 5 Atlanta live news',
        callSign: 'WAGA-TV',
        network: 'FOX',
        city: 'Atlanta',
        state: 'GA',
      },
      {
        name: 'WSB-TV Atlanta',
        youtubeChannelId: 'UCEwi0mSAsUp8V31Re0QgfHQ', // @wsaborgtv - VERIFIED
        youtubeSearchQuery: 'WSB-TV Atlanta live news',
        callSign: 'WSB-TV',
        network: 'ABC',
        city: 'Atlanta',
        state: 'GA',
      },
      {
        name: '11Alive Atlanta',
        youtubeChannelId: 'UCfplIIwkmmfMWYbMlgL3fbA', // @11alive - VERIFIED
        youtubeSearchQuery: '11Alive Atlanta live news',
        callSign: 'WXIA-TV',
        network: 'NBC',
        city: 'Atlanta',
        state: 'GA',
      },
    ],
  },
  // New York, NY
  'newyork': {
    name: 'New York',
    stations: [
      {
        name: 'FOX 5 New York',
        youtubeChannelId: 'UCpBvZDdD8GaSSTl8z89vkPw',
        youtubeSearchQuery: 'FOX 5 New York live news',
        callSign: 'WNYW',
        network: 'FOX',
        city: 'New York',
        state: 'NY',
      },
      {
        name: 'ABC 7 New York',
        youtubeChannelId: 'UCFbYI2lW8M0R8W8F8TIzHEw',
        youtubeSearchQuery: 'ABC 7 New York live news WABC',
        callSign: 'WABC-TV',
        network: 'ABC',
        city: 'New York',
        state: 'NY',
      },
      {
        name: 'NBC 4 New York',
        youtubeChannelId: 'UCbZUrR-VbOMqk0XOcXlJ5lQ',
        youtubeSearchQuery: 'NBC New York live news WNBC',
        callSign: 'WNBC',
        network: 'NBC',
        city: 'New York',
        state: 'NY',
      },
    ],
  },
  // Los Angeles, CA
  'losangeles': {
    name: 'Los Angeles',
    stations: [
      {
        name: 'FOX 11 Los Angeles',
        youtubeChannelId: 'UCdhf2TmEE6Sj1x7UxP0gFog',
        youtubeSearchQuery: 'FOX 11 Los Angeles live news KTTV',
        callSign: 'KTTV',
        network: 'FOX',
        city: 'Los Angeles',
        state: 'CA',
      },
      {
        name: 'ABC 7 Los Angeles',
        youtubeChannelId: 'UCsqLe2h8ZjQ0LrVBrBGKg5g',
        youtubeSearchQuery: 'ABC 7 Los Angeles live news KABC',
        callSign: 'KABC-TV',
        network: 'ABC',
        city: 'Los Angeles',
        state: 'CA',
      },
      {
        name: 'NBC 4 Los Angeles',
        youtubeChannelId: 'UCMffzToT82Dc0WJCMj7IICA',
        youtubeSearchQuery: 'NBC Los Angeles live news KNBC',
        callSign: 'KNBC',
        network: 'NBC',
        city: 'Los Angeles',
        state: 'CA',
      },
    ],
  },
  // Chicago, IL
  'chicago': {
    name: 'Chicago',
    stations: [
      {
        name: 'FOX 32 Chicago',
        youtubeChannelId: 'UCfMsK4nzSWBJIGg3S7J5QSA',
        youtubeSearchQuery: 'FOX 32 Chicago live news WFLD',
        callSign: 'WFLD',
        network: 'FOX',
        city: 'Chicago',
        state: 'IL',
      },
      {
        name: 'ABC 7 Chicago',
        youtubeChannelId: 'UCXvKrOtxUj_7Df2MeyQQi8g',
        youtubeSearchQuery: 'ABC 7 Chicago live news WLS',
        callSign: 'WLS-TV',
        network: 'ABC',
        city: 'Chicago',
        state: 'IL',
      },
      {
        name: 'NBC 5 Chicago',
        youtubeChannelId: 'UCBcq5z5dj6FcdkpbB3TQ0dw',
        youtubeSearchQuery: 'NBC 5 Chicago live news WMAQ',
        callSign: 'WMAQ-TV',
        network: 'NBC',
        city: 'Chicago',
        state: 'IL',
      },
    ],
  },
  // Houston, TX
  'houston': {
    name: 'Houston',
    stations: [
      {
        name: 'FOX 26 Houston',
        youtubeChannelId: 'UCrkRRNpVFZz8Wjo3k1CPlLg',
        youtubeSearchQuery: 'FOX 26 Houston live news KRIV',
        callSign: 'KRIV',
        network: 'FOX',
        city: 'Houston',
        state: 'TX',
      },
      {
        name: 'ABC 13 Houston',
        youtubeChannelId: 'UCj-xjQ1qCvwJv5ot2L0Cz2Q',
        youtubeSearchQuery: 'ABC 13 Houston live news KTRK',
        callSign: 'KTRK-TV',
        network: 'ABC',
        city: 'Houston',
        state: 'TX',
      },
    ],
  },
  // Dallas, TX
  'dallas': {
    name: 'Dallas-Fort Worth',
    stations: [
      {
        name: 'FOX 4 Dallas',
        youtubeChannelId: 'UC1rWsHG4xT6Y7G1y4O-MwEA',
        youtubeSearchQuery: 'FOX 4 Dallas live news KDFW',
        callSign: 'KDFW',
        network: 'FOX',
        city: 'Dallas',
        state: 'TX',
      },
      {
        name: 'WFAA Dallas',
        youtubeChannelId: 'UCJNgRMEqDPhxlMBmSKe5LqQ',
        youtubeSearchQuery: 'WFAA Dallas live news ABC',
        callSign: 'WFAA',
        network: 'ABC',
        city: 'Dallas',
        state: 'TX',
      },
    ],
  },
  // Phoenix, AZ
  'phoenix': {
    name: 'Phoenix',
    stations: [
      {
        name: 'FOX 10 Phoenix',
        youtubeChannelId: 'UCOuAcn-7jIBJmQAb4GpYchQ',
        youtubeSearchQuery: 'FOX 10 Phoenix live news KSAZ',
        callSign: 'KSAZ-TV',
        network: 'FOX',
        city: 'Phoenix',
        state: 'AZ',
      },
      {
        name: 'ABC 15 Phoenix',
        youtubeChannelId: 'UCKy2WHAWpIQVTYiJQKTbxNg',
        youtubeSearchQuery: 'ABC 15 Phoenix live news KNXV',
        callSign: 'KNXV-TV',
        network: 'ABC',
        city: 'Phoenix',
        state: 'AZ',
      },
    ],
  },
  // Philadelphia, PA
  'philadelphia': {
    name: 'Philadelphia',
    stations: [
      {
        name: 'FOX 29 Philadelphia',
        youtubeChannelId: 'UCbGC_JDNOtO7TjFRIBDM6sw',
        youtubeSearchQuery: 'FOX 29 Philadelphia live news WTXF',
        callSign: 'WTXF-TV',
        network: 'FOX',
        city: 'Philadelphia',
        state: 'PA',
      },
      {
        name: 'ABC 6 Philadelphia',
        youtubeChannelId: 'UCu_g9XuQAzH6kCQQOyNYE7w',
        youtubeSearchQuery: 'ABC 6 Philadelphia live news WPVI',
        callSign: 'WPVI-TV',
        network: 'ABC',
        city: 'Philadelphia',
        state: 'PA',
      },
    ],
  },
  // San Francisco, CA
  'sanfrancisco': {
    name: 'San Francisco Bay Area',
    stations: [
      {
        name: 'KTVU FOX 2',
        youtubeChannelId: 'UCGDmFc1hYYxLEYYX8aqVcLA',
        youtubeSearchQuery: 'KTVU FOX 2 San Francisco live news',
        callSign: 'KTVU',
        network: 'FOX',
        city: 'Oakland',
        state: 'CA',
      },
      {
        name: 'ABC 7 San Francisco',
        youtubeChannelId: 'UCEQLh3JMlmLRntLhMT3AYsA',
        youtubeSearchQuery: 'ABC 7 San Francisco live news KGO',
        callSign: 'KGO-TV',
        network: 'ABC',
        city: 'San Francisco',
        state: 'CA',
      },
    ],
  },
  // Seattle, WA
  'seattle': {
    name: 'Seattle',
    stations: [
      {
        name: 'FOX 13 Seattle',
        youtubeChannelId: 'UCwnwM9hChZ5d3T_ILjDMeTA',
        youtubeSearchQuery: 'FOX 13 Seattle live news KCPQ',
        callSign: 'KCPQ',
        network: 'FOX',
        city: 'Seattle',
        state: 'WA',
      },
      {
        name: 'KOMO 4 Seattle',
        youtubeChannelId: 'UCFLhWfnVlVIX1hH0-F2Kllg',
        youtubeSearchQuery: 'KOMO Seattle live news ABC',
        callSign: 'KOMO-TV',
        network: 'ABC',
        city: 'Seattle',
        state: 'WA',
      },
    ],
  },
  // Denver, CO
  'denver': {
    name: 'Denver',
    stations: [
      {
        name: 'FOX 31 Denver',
        youtubeChannelId: 'UC_6BUJL5vn5mz08O0hNp9Mg',
        youtubeSearchQuery: 'FOX 31 Denver live news KDVR',
        callSign: 'KDVR',
        network: 'FOX',
        city: 'Denver',
        state: 'CO',
      },
      {
        name: '9NEWS Denver',
        youtubeChannelId: 'UCgk7Y3YPHcN6x0F4REZMvZg',
        youtubeSearchQuery: '9NEWS Denver live news KUSA',
        callSign: 'KUSA-TV',
        network: 'NBC',
        city: 'Denver',
        state: 'CO',
      },
    ],
  },
  // Miami, FL
  'miami': {
    name: 'Miami',
    stations: [
      {
        name: 'FOX 7 Miami',
        youtubeChannelId: 'UCL_0D2F2FqQ0y42n3HCmyhQ',
        youtubeSearchQuery: 'WSVN Miami live news',
        callSign: 'WSVN',
        network: 'FOX',
        city: 'Miami',
        state: 'FL',
      },
      {
        name: 'ABC 10 Miami',
        youtubeChannelId: 'UCb9W5WK8W0l6IKJHSlsXZ0g',
        youtubeSearchQuery: 'WPLG Miami live news ABC',
        callSign: 'WPLG',
        network: 'ABC',
        city: 'Miami',
        state: 'FL',
      },
    ],
  },
  // Washington DC
  'dc': {
    name: 'Washington D.C.',
    stations: [
      {
        name: 'FOX 5 DC',
        youtubeChannelId: 'UCk6L2K7o7gB-ZQ0s_Z5jAfA',
        youtubeSearchQuery: 'FOX 5 DC live news WTTG',
        callSign: 'WTTG',
        network: 'FOX',
        city: 'Washington',
        state: 'DC',
      },
      {
        name: 'ABC 7 DC',
        youtubeChannelId: 'UCkqEKmndbNJCACfQDxOIIKg',
        youtubeSearchQuery: 'ABC 7 DC live news WJLA',
        callSign: 'WJLA-TV',
        network: 'ABC',
        city: 'Washington',
        state: 'DC',
      },
    ],
  },
  // Boston, MA
  'boston': {
    name: 'Boston',
    stations: [
      {
        name: 'FOX 25 Boston',
        youtubeChannelId: 'UC-nLl2DfKnHFdEGLgfSYZpw',
        youtubeSearchQuery: 'FOX 25 Boston live news WFXT',
        callSign: 'WFXT',
        network: 'FOX',
        city: 'Boston',
        state: 'MA',
      },
      {
        name: 'WCVB 5 Boston',
        youtubeChannelId: 'UCyA0VTB6mYvbNy1F8Kn8nDA',
        youtubeSearchQuery: 'WCVB Boston live news ABC',
        callSign: 'WCVB-TV',
        network: 'ABC',
        city: 'Boston',
        state: 'MA',
      },
    ],
  },
  // Minneapolis, MN
  'minneapolis': {
    name: 'Minneapolis',
    stations: [
      {
        name: 'FOX 9 Minneapolis',
        youtubeChannelId: 'UCxaKHpjXRVOk0F0WmwZ7bFA',
        youtubeSearchQuery: 'FOX 9 Minneapolis live news KMSP',
        callSign: 'KMSP-TV',
        network: 'FOX',
        city: 'Minneapolis',
        state: 'MN',
      },
      {
        name: 'KARE 11 Minneapolis',
        youtubeChannelId: 'UCMUr-oPxVxBSN4bQ8pJMRvQ',
        youtubeSearchQuery: 'KARE 11 Minneapolis live news NBC',
        callSign: 'KARE',
        network: 'NBC',
        city: 'Minneapolis',
        state: 'MN',
      },
    ],
  },
  // Tampa, FL
  'tampa': {
    name: 'Tampa Bay',
    stations: [
      {
        name: 'FOX 13 Tampa Bay',
        youtubeChannelId: 'UCQq0tgH_TUt8J_vJn-5r61g',
        youtubeSearchQuery: 'FOX 13 Tampa Bay live news WTVT',
        callSign: 'WTVT',
        network: 'FOX',
        city: 'Tampa',
        state: 'FL',
      },
      {
        name: 'ABC Action News Tampa',
        youtubeChannelId: 'UCYxVxe3hxMrR7Ur4RIoO7bg',
        youtubeSearchQuery: 'ABC Action News Tampa live WFTS',
        callSign: 'WFTS-TV',
        network: 'ABC',
        city: 'Tampa',
        state: 'FL',
      },
    ],
  },
  // Orlando, FL
  'orlando': {
    name: 'Orlando',
    stations: [
      {
        name: 'FOX 35 Orlando',
        youtubeChannelId: 'UCE6VwYz7bxYdSfvqy-RnvPw',
        youtubeSearchQuery: 'FOX 35 Orlando live news WOFL',
        callSign: 'WOFL',
        network: 'FOX',
        city: 'Orlando',
        state: 'FL',
      },
      {
        name: 'WFTV 9 Orlando',
        youtubeChannelId: 'UCE_-xMzHrBCi0tPIJRUdSpA',
        youtubeSearchQuery: 'WFTV Orlando live news ABC',
        callSign: 'WFTV',
        network: 'ABC',
        city: 'Orlando',
        state: 'FL',
      },
    ],
  },
};

// Map 3-digit zip code prefixes to metro areas
export const ZIP_PREFIX_TO_METRO: Record<string, string> = {
  // Atlanta (300-319)
  '300': 'atlanta', '301': 'atlanta', '302': 'atlanta', '303': 'atlanta', '304': 'atlanta',
  '305': 'atlanta', '306': 'atlanta', '307': 'atlanta', '308': 'atlanta', '309': 'atlanta',
  '310': 'atlanta', '311': 'atlanta', '312': 'atlanta', '313': 'atlanta', '314': 'atlanta',
  '315': 'atlanta', '316': 'atlanta', '317': 'atlanta', '318': 'atlanta', '319': 'atlanta',
  
  // New York (100-119)
  '100': 'newyork', '101': 'newyork', '102': 'newyork', '103': 'newyork', '104': 'newyork',
  '105': 'newyork', '106': 'newyork', '107': 'newyork', '108': 'newyork', '109': 'newyork',
  '110': 'newyork', '111': 'newyork', '112': 'newyork', '113': 'newyork', '114': 'newyork',
  '115': 'newyork', '116': 'newyork', '117': 'newyork', '118': 'newyork', '119': 'newyork',
  
  // Los Angeles (900-935)
  '900': 'losangeles', '901': 'losangeles', '902': 'losangeles', '903': 'losangeles',
  '904': 'losangeles', '905': 'losangeles', '906': 'losangeles', '907': 'losangeles',
  '908': 'losangeles', '910': 'losangeles', '911': 'losangeles', '912': 'losangeles',
  '913': 'losangeles', '914': 'losangeles', '915': 'losangeles', '916': 'losangeles',
  '917': 'losangeles', '918': 'losangeles', '935': 'losangeles',
  
  // Chicago (600-629)
  '600': 'chicago', '601': 'chicago', '602': 'chicago', '603': 'chicago', '604': 'chicago',
  '605': 'chicago', '606': 'chicago', '607': 'chicago', '608': 'chicago', '609': 'chicago',
  '610': 'chicago', '611': 'chicago', '612': 'chicago', '613': 'chicago', '614': 'chicago',
  '615': 'chicago', '616': 'chicago', '617': 'chicago', '618': 'chicago', '619': 'chicago',
  '620': 'chicago', '621': 'chicago', '622': 'chicago', '623': 'chicago', '624': 'chicago',
  '625': 'chicago', '626': 'chicago', '627': 'chicago', '628': 'chicago', '629': 'chicago',
  
  // Houston (770-779)
  '770': 'houston', '771': 'houston', '772': 'houston', '773': 'houston', '774': 'houston',
  '775': 'houston', '776': 'houston', '777': 'houston', '778': 'houston', '779': 'houston',
  
  // Dallas (750-759, 760-769)
  '750': 'dallas', '751': 'dallas', '752': 'dallas', '753': 'dallas', '754': 'dallas',
  '755': 'dallas', '756': 'dallas', '757': 'dallas', '758': 'dallas', '759': 'dallas',
  '760': 'dallas', '761': 'dallas', '762': 'dallas', '763': 'dallas', '764': 'dallas',
  '765': 'dallas', '766': 'dallas', '767': 'dallas', '768': 'dallas', '769': 'dallas',
  
  // Phoenix (850-859)
  '850': 'phoenix', '851': 'phoenix', '852': 'phoenix', '853': 'phoenix', '854': 'phoenix',
  '855': 'phoenix', '856': 'phoenix', '857': 'phoenix', '858': 'phoenix', '859': 'phoenix',
  
  // Philadelphia (190-196)
  '190': 'philadelphia', '191': 'philadelphia', '192': 'philadelphia', '193': 'philadelphia',
  '194': 'philadelphia', '195': 'philadelphia', '196': 'philadelphia',
  
  // San Francisco (940-949)
  '940': 'sanfrancisco', '941': 'sanfrancisco', '942': 'sanfrancisco', '943': 'sanfrancisco',
  '944': 'sanfrancisco', '945': 'sanfrancisco', '946': 'sanfrancisco', '947': 'sanfrancisco',
  '948': 'sanfrancisco', '949': 'sanfrancisco',
  
  // Seattle (980-989)
  '980': 'seattle', '981': 'seattle', '982': 'seattle', '983': 'seattle', '984': 'seattle',
  '985': 'seattle', '986': 'seattle', '987': 'seattle', '988': 'seattle', '989': 'seattle',
  
  // Denver (800-816)
  '800': 'denver', '801': 'denver', '802': 'denver', '803': 'denver', '804': 'denver',
  '805': 'denver', '806': 'denver', '807': 'denver', '808': 'denver', '809': 'denver',
  '810': 'denver', '811': 'denver', '812': 'denver', '813': 'denver', '814': 'denver',
  '815': 'denver', '816': 'denver',
  
  // Miami (330-335)
  '330': 'miami', '331': 'miami', '332': 'miami', '333': 'miami', '334': 'miami',
  '335': 'miami',
  
  // Washington DC (200-205, 220-223)
  '200': 'dc', '201': 'dc', '202': 'dc', '203': 'dc', '204': 'dc', '205': 'dc',
  '220': 'dc', '221': 'dc', '222': 'dc', '223': 'dc',
  
  // Boston (010-027)
  '010': 'boston', '011': 'boston', '012': 'boston', '013': 'boston', '014': 'boston',
  '015': 'boston', '016': 'boston', '017': 'boston', '018': 'boston', '019': 'boston',
  '020': 'boston', '021': 'boston', '022': 'boston', '023': 'boston', '024': 'boston',
  '025': 'boston', '026': 'boston', '027': 'boston',
  
  // Minneapolis (550-567)
  '550': 'minneapolis', '551': 'minneapolis', '552': 'minneapolis', '553': 'minneapolis',
  '554': 'minneapolis', '555': 'minneapolis', '556': 'minneapolis', '557': 'minneapolis',
  '558': 'minneapolis', '559': 'minneapolis', '560': 'minneapolis', '561': 'minneapolis',
  '562': 'minneapolis', '563': 'minneapolis', '564': 'minneapolis', '565': 'minneapolis',
  '566': 'minneapolis', '567': 'minneapolis',
  
  // Tampa (336-346)
  '336': 'tampa', '337': 'tampa', '338': 'tampa', '339': 'tampa',
  '340': 'tampa', '341': 'tampa', '342': 'tampa', '343': 'tampa', '344': 'tampa',
  '345': 'tampa', '346': 'tampa',
  
  // Orlando (327-329, 347-349)
  '327': 'orlando', '328': 'orlando', '329': 'orlando',
  '347': 'orlando', '348': 'orlando', '349': 'orlando',
};

// Get metro area from zip code
export function getMetroFromZip(zipCode: string): MetroArea | null {
  const prefix = zipCode.substring(0, 3);
  const metroKey = ZIP_PREFIX_TO_METRO[prefix];
  return metroKey ? METRO_AREAS[metroKey] : null;
}

// Get the primary local news station for a zip code
export function getLocalNewsForZip(zipCode: string): LocalNewsStation | null {
  const metro = getMetroFromZip(zipCode);
  return metro?.stations[0] || null;
}

// Get all stations for a zip code
export function getAllStationsForZip(zipCode: string): LocalNewsStation[] {
  const metro = getMetroFromZip(zipCode);
  return metro?.stations || [];
}

// Get the metro area name from a zip code
export function getMetroNameFromZip(zipCode: string): string | null {
  const metro = getMetroFromZip(zipCode);
  return metro?.name || null;
}

// ============================================
// Fallback for Uncovered Areas
// ============================================

export interface FallbackStation extends LocalNewsStation {
  isFallback: true;
}

export interface ZipCodeLookupResult {
  city: string;
  state: string;
  stateAbbr: string;
}

/**
 * Look up city/state from a zip code using the Zippopotam API
 * This is used for zip codes not in our curated database
 */
export async function lookupZipCode(zipCode: string): Promise<ZipCodeLookupResult | null> {
  try {
    const response = await fetch(`https://api.zippopotam.us/us/${zipCode}`);

    if (!response.ok) {
      console.warn(`Zip code lookup failed for ${zipCode}: ${response.status}`);
      return null;
    }

    const data = await response.json();
    const place = data.places?.[0];

    if (!place) {
      console.warn(`No place data found for zip code ${zipCode}`);
      return null;
    }

    return {
      city: place['place name'],
      state: place.state,
      stateAbbr: place['state abbreviation'],
    };
  } catch (error) {
    console.error('Error looking up zip code:', error);
    return null;
  }
}

/**
 * Create a fallback station for areas not in our curated database.
 * This generates a YouTube search query based on the city name.
 */
export function createFallbackStation(
  city: string,
  state: string,
  stateAbbr: string
): FallbackStation {
  return {
    name: `${city} Local News`,
    youtubeChannelId: '', // Not used for fallback - we search instead
    youtubeSearchQuery: `"${city}" "${state}" local news live today 2025`,
    callSign: 'LOCAL',
    network: 'Independent',
    city,
    state: stateAbbr,
    isFallback: true,
  };
}

/**
 * Check if a station is a fallback station
 */
export function isFallbackStation(station: LocalNewsStation): station is FallbackStation {
  return 'isFallback' in station && (station as FallbackStation).isFallback === true;
}
