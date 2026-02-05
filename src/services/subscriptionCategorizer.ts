/**
 * Subscription Categorizer
 *
 * Intelligently categorizes YouTube subscriptions into EpiShow channels
 * using a combination of:
 * 1. Known channel mappings (exact matches for popular creators)
 * 2. Keyword-based matching (channel name patterns)
 */

export interface CategorizationResult {
  channelId: string | null;
  confidence: 'high' | 'medium' | 'low';
  matchedKeywords: string[];
}

interface CategoryMapping {
  channelId: string;
  keywords: string[];
  excludeKeywords?: string[];
}

// ============================================
// Known Channel Mappings (High Confidence)
// ============================================
// These are exact/partial matches for popular YouTube creators

const KNOWN_CHANNELS: Record<string, string> = {
  // === COOKING ===
  'nick digiovanni': 'cooking',
  'joshua weissman': 'cooking',
  'babish culinary universe': 'cooking',
  'binging with babish': 'cooking',
  'gordon ramsay': 'cooking',
  'bon appetit': 'cooking',
  'bon appétit': 'cooking',
  'epicurious': 'cooking',
  'tasty': 'cooking',
  "it's alive with brad": 'cooking',
  'matty matheson': 'cooking',
  'emmymade': 'cooking',
  'sorted food': 'cooking',
  'adam ragusea': 'cooking',
  'ethan chlebowski': 'cooking',
  'internet shaquille': 'cooking',
  'alex french guy cooking': 'cooking',
  "claire saffitz": 'cooking',
  'sam the cooking guy': 'cooking',

  // === TECHNOLOGY ===
  'mkbhd': 'tech',
  'marques brownlee': 'tech',
  'linus tech tips': 'tech',
  'linustechtips': 'tech',
  'fireship': 'tech',
  'mrwhosetheboss': 'tech',
  'dave2d': 'tech',
  'austin evans': 'tech',
  'unbox therapy': 'tech',
  'lttstore': 'tech',
  'techlinked': 'tech',
  'short circuit': 'tech',
  'tailosive tech': 'tech',
  'snazzy labs': 'tech',
  'jonathan morrison': 'tech',
  'flossy carter': 'tech',
  'erica griffin': 'tech',
  'tech altar': 'tech',
  'tech quickie': 'tech',
  'the verge': 'tech',
  'engadget': 'tech',

  // === MAKER / ENGINEERING ===
  'mark rober': 'maker',
  'stuff made here': 'maker',
  'simone giertz': 'maker',
  'colin furze': 'maker',
  'adam savage': 'maker',
  'tested': 'maker',
  'integza': 'maker',
  'william osman': 'maker',
  'michael reeves': 'maker',
  'allen pan': 'maker',
  'evan and katelyn': 'maker',
  'xyla foxlin': 'maker',
  'peter sripol': 'maker',
  'wintergatan': 'maker',
  'essential craftsman': 'maker',
  'i like to make stuff': 'maker',
  'jimmy diresta': 'maker',
  'laura kampf': 'maker',

  // === SCIENCE ===
  'veritasium': 'science',
  'kurzgesagt': 'science',
  'vsauce': 'science',
  'smarter every day': 'science',
  'smartereveryday': 'science',
  'minutephysics': 'science',
  'minute physics': 'science',
  'scishow': 'science',
  'pbs spacetime': 'science',
  'pbs space time': 'science',
  'action lab': 'science',
  'the action lab': 'science',
  'nilered': 'science',
  'nile red': 'science',
  'thought emporium': 'science',
  'applied science': 'science',
  'physics girl': 'science',
  'dr. becky': 'science',
  'astrum': 'science',
  'practical engineering': 'science',
  'real engineering': 'science',
  'steve mould': 'science',
  'tom scott': 'science',
  'michael penn': 'science',
  '3blue1brown': 'science',

  // === TEEN / ENTERTAINMENT ===
  'dude perfect': 'teen',
  'mrbeast': 'teen',
  'mr beast': 'teen',
  'beast philanthropy': 'teen',
  'beast reacts': 'teen',
  'how ridiculous': 'teen',
  'demolition ranch': 'teen',
  'preston': 'teen',
  'unspeakable': 'teen',
  'ryan trahan': 'teen',
  'airrack': 'teen',

  // === AUTOMOTIVE ===
  'donut media': 'automotive',
  'doug demuro': 'automotive',
  'top gear': 'automotive',
  'the grand tour': 'automotive',
  'jay leno': 'automotive',
  "jay leno's garage": 'automotive',
  'carwow': 'automotive',
  'throttle house': 'automotive',
  'savagegeese': 'automotive',
  'straight pipes': 'automotive',
  'hoonigan': 'automotive',
  'mighty car mods': 'automotive',
  'cleetus mcfarland': 'automotive',
  'tavarish': 'automotive',
  'car throttle': 'automotive',
  'driving 4 answers': 'automotive',

  // === PODCASTS ===
  'joe rogan': 'podcast',
  'powerfuljre': 'podcast',
  'lex fridman': 'podcast',
  'huberman lab': 'podcast',
  'andrew huberman': 'podcast',
  'diary of a ceo': 'podcast',
  'steven bartlett': 'podcast',
  'impaulsive': 'podcast',
  'logan paul': 'podcast',
  'flagrant': 'podcast',
  'andrew schulz': 'podcast',
  'h3 podcast': 'podcast',
  'h3h3': 'podcast',
  'call her daddy': 'podcast',
  'theo von': 'podcast',
  'this past weekend': 'podcast',
  'my first million': 'podcast',
  'all-in podcast': 'podcast',
  'the joe budden podcast': 'podcast',
  'joe budden': 'podcast',

  // === BUSINESS (maps to podcast as closest) ===
  'garyvee': 'podcast',
  'gary vaynerchuk': 'podcast',
  'gary vee': 'podcast',
  'pat flynn': 'podcast',
  'ali abdaal': 'podcast',
  'graham stephan': 'podcast',
  'meet kevin': 'podcast',
  'andrei jikh': 'podcast',

  // === GAMING ===
  'dream': 'gaming',
  'pewdiepie': 'gaming',
  'ninja': 'gaming',
  'markiplier': 'gaming',
  'jacksepticeye': 'gaming',
  'game grumps': 'gaming',
  'xqc': 'gaming',
  'valkyrae': 'gaming',
  'pokimane': 'gaming',
  'ludwig': 'gaming',
  'moistcr1tikal': 'gaming',
  'penguinz0': 'gaming',
  'dunkey': 'gaming',
  'videogamedunkey': 'gaming',
  'ign': 'gaming',
  'gamespot': 'gaming',
  'kotaku': 'gaming',
  'gameranx': 'gaming',
  'skill up': 'gaming',
  'kinda funny': 'gaming',

  // === HISTORY ===
  'oversimplified': 'history',
  'history matters': 'history',
  'kings and generals': 'history',
  'extra history': 'history',
  'extra credits': 'history',
  'invicta': 'history',
  'historia civilis': 'history',
  'epic history tv': 'history',
  'toldinstone': 'history',
  'fall of civilizations': 'history',
  'the history guy': 'history',

  // === NATURE / WILDLIFE ===
  'bbc earth': 'nature',
  'national geographic': 'nature',
  'nat geo': 'nature',
  'wildlife': 'nature',
  'david attenborough': 'nature',
  'brave wilderness': 'nature',
  'coyote peterson': 'nature',
  'animalogic': 'nature',
  'zefrank1': 'nature',
  'ze frank': 'nature',

  // === COMEDY ===
  'snl': 'comedy',
  'saturday night live': 'comedy',
  'key & peele': 'comedy',
  'key and peele': 'comedy',
  'college humor': 'comedy',
  'collegehumor': 'comedy',
  'dropout': 'comedy',
  'smosh': 'comedy',
  'trevor noah': 'comedy',
  'daily show': 'comedy',
  'jimmy fallon': 'comedy',
  'tonight show': 'comedy',
  'jimmy kimmel': 'comedy',
  'conan': 'comedy',
  'team coco': 'comedy',
  'seth meyers': 'comedy',
  'late night': 'comedy',
  'james corden': 'comedy',
  'late late show': 'comedy',

  // === FITNESS ===
  'athlean-x': 'fitness',
  'jeff nippard': 'fitness',
  'natacha oceane': 'fitness',
  'blogilates': 'fitness',
  'fitness blender': 'fitness',
  'sydney cummings': 'fitness',
  'yoga with adriene': 'fitness',
  'chloe ting': 'fitness',
  'pamela reif': 'fitness',
  'chris heria': 'fitness',
  'thenx': 'fitness',
  'hybrid calisthenics': 'fitness',

  // === TRAVEL ===
  'yes theory': 'travel',
  'kara and nate': 'travel',
  'drew binsky': 'travel',
  'mark wiens': 'travel',
  'best ever food review show': 'travel',
  'sonny side': 'travel',
  'rick steves': 'travel',
  'vagrant holiday': 'travel',
  'bald and bankrupt': 'travel',
  'indigo traveller': 'travel',

  // === ART ===
  'bob ross': 'art',
  'proko': 'art',
  'art for kids hub': 'art',
  'jazza': 'art',
  'draw with jazza': 'art',
  'peter draws': 'art',
  'minnie small': 'art',
  'baylee jae': 'art',
  'kasey golden': 'art',
  'lavendertowne': 'art',

  // === HOME DIY ===
  'this old house': 'diy',
  'home renovision diy': 'diy',
  'see jane drill': 'diy',
  'home repair tutor': 'diy',
  'magnolia network': 'diy',
  'the sorry girls': 'diy',
  'mr. build it': 'diy',
  'diy creators': 'diy',

  // === MUSIC ===
  'vevo': 'music',
  'genius': 'music',
  'theneedledrop': 'music',
  'anthony fantano': 'music',
  'todd in the shadows': 'music',
  'rick beato': 'music',
  'adam neely': 'music',
  'polyphonic': 'music',
  'sideways': 'music',

  // === FAITH ===
  'bible project': 'faith',
  'the bible project': 'faith',
  'ascension presents': 'faith',
  'desiring god': 'faith',
  'elevation worship': 'faith',
  'hillsong': 'faith',
  'bethel music': 'faith',
};

// ============================================
// Category Keyword Mappings (Medium Confidence)
// ============================================

const CATEGORY_KEYWORDS: CategoryMapping[] = [
  {
    channelId: 'cooking',
    keywords: ['cook', 'recipe', 'kitchen', 'chef', 'food', 'baking', 'culinary', 'meal', 'cuisine', 'restaurant'],
    excludeKeywords: ['mukbang', 'asmr eating', 'food review'],
  },
  {
    channelId: 'tech',
    keywords: ['tech', 'technology', 'gadget', 'phone', 'laptop', 'computer', 'software', 'app', 'review', 'smartphone'],
    excludeKeywords: ['gaming', 'game', 'esports'],
  },
  {
    channelId: 'science',
    keywords: ['science', 'physics', 'chemistry', 'biology', 'space', 'astronomy', 'quantum', 'experiment', 'math', 'engineering'],
  },
  {
    channelId: 'maker',
    keywords: ['diy', 'build', 'make', 'engineering', 'project', 'workshop', 'craft', 'inventor', 'fabrication', '3d print'],
  },
  {
    channelId: 'gaming',
    keywords: ['gaming', 'gamer', 'gameplay', 'lets play', 'stream', 'esports', 'playstation', 'xbox', 'nintendo', 'twitch'],
  },
  {
    channelId: 'fitness',
    keywords: ['fitness', 'workout', 'gym', 'exercise', 'yoga', 'training', 'health', 'muscle', 'cardio', 'hiit'],
  },
  {
    channelId: 'travel',
    keywords: ['travel', 'adventure', 'explore', 'destination', 'tourism', 'backpack', 'world', 'journey', 'trip'],
  },
  {
    channelId: 'automotive',
    keywords: ['car', 'auto', 'vehicle', 'motor', 'driving', 'racing', 'engine', 'motorcycle', 'supercar', 'truck'],
  },
  {
    channelId: 'history',
    keywords: ['history', 'historical', 'ancient', 'war', 'civilization', 'documentary', 'medieval', 'empire'],
    excludeKeywords: ['alternate history', 'what if'],
  },
  {
    channelId: 'comedy',
    keywords: ['comedy', 'funny', 'humor', 'sketch', 'standup', 'laugh', 'parody', 'satire', 'jokes'],
  },
  {
    channelId: 'music',
    keywords: ['music', 'song', 'album', 'artist', 'vevo', 'concert', 'band', 'singer', 'musician', 'producer'],
  },
  {
    channelId: 'art',
    keywords: ['art', 'painting', 'drawing', 'artist', 'creative', 'design', 'illustration', 'sketch', 'digital art'],
  },
  {
    channelId: 'nature',
    keywords: ['nature', 'wildlife', 'animal', 'documentary', 'planet', 'ocean', 'forest', 'earth', 'conservation'],
  },
  {
    channelId: 'kids',
    keywords: ['kids', 'children', 'nursery', 'cartoon', 'animation', 'educational kids', 'toddler', 'preschool'],
  },
  {
    channelId: 'family',
    keywords: ['family', 'family friendly', 'all ages', 'wholesome', 'family vlog'],
  },
  {
    channelId: 'podcast',
    keywords: ['podcast', 'interview', 'conversation', 'talk show', 'discussion', 'episode'],
  },
  {
    channelId: 'sports',
    keywords: ['sports', 'football', 'basketball', 'soccer', 'baseball', 'nba', 'nfl', 'highlights', 'athletic'],
  },
  {
    channelId: 'faith',
    keywords: ['faith', 'christian', 'church', 'bible', 'sermon', 'worship', 'spiritual', 'religious', 'god', 'jesus'],
  },
  {
    channelId: 'diy',
    keywords: ['home improvement', 'renovation', 'house', 'interior', 'decor', 'garden', 'remodel', 'repair'],
  },
  {
    channelId: 'collecting',
    keywords: ['collecting', 'collection', 'cards', 'coins', 'vintage', 'antique', 'rare', 'memorabilia', 'trading cards'],
  },
  {
    channelId: 'teen',
    keywords: ['challenge', 'stunt', 'extreme', 'viral', 'trending', 'react', 'prank'],
  },
];

// ============================================
// Main Categorization Functions
// ============================================

/**
 * Categorize a single YouTube subscription into an EpiShow channel
 */
export function categorizeSubscription(channelName: string): CategorizationResult {
  const normalizedName = channelName.toLowerCase().trim();

  // Check known channels first (high confidence)
  for (const [knownName, channelId] of Object.entries(KNOWN_CHANNELS)) {
    if (normalizedName.includes(knownName) || knownName.includes(normalizedName)) {
      return {
        channelId,
        confidence: 'high',
        matchedKeywords: [knownName],
      };
    }
  }

  // Keyword matching (medium/low confidence)
  let bestMatch: CategorizationResult = {
    channelId: null,
    confidence: 'low',
    matchedKeywords: [],
  };
  let maxMatches = 0;

  for (const category of CATEGORY_KEYWORDS) {
    // Check exclude keywords first
    if (category.excludeKeywords?.some(kw => normalizedName.includes(kw))) {
      continue;
    }

    const matchedKeywords = category.keywords.filter(kw => normalizedName.includes(kw));

    if (matchedKeywords.length > maxMatches) {
      maxMatches = matchedKeywords.length;
      bestMatch = {
        channelId: category.channelId,
        confidence: matchedKeywords.length >= 2 ? 'medium' : 'low',
        matchedKeywords,
      };
    }
  }

  return bestMatch;
}

/**
 * Batch categorize multiple subscriptions
 */
export function categorizeSubscriptions(
  subscriptions: Array<{ channelName: string; youtubeChannelId: string }>
): Array<{
  youtubeChannelId: string;
  channelName: string;
  matchedChannel: string | null;
  confidence: 'high' | 'medium' | 'low';
  matchedKeywords: string[];
}> {
  return subscriptions.map(sub => {
    const result = categorizeSubscription(sub.channelName);
    return {
      youtubeChannelId: sub.youtubeChannelId,
      channelName: sub.channelName,
      matchedChannel: result.channelId,
      confidence: result.confidence,
      matchedKeywords: result.matchedKeywords,
    };
  });
}

/**
 * Get all available EpiShow channel IDs (for UI dropdowns)
 */
export function getEpiShowChannelIds(): string[] {
  return [
    'tech',
    'science',
    'history',
    'nature',
    'cooking',
    'fitness',
    'travel',
    'maker',
    'diy',
    'automotive',
    'collecting',
    'art',
    'gaming',
    'sports',
    'teen',
    'comedy',
    'music',
    'music80s',
    'music90s',
    'music00s',
    'music10s',
    'kids',
    'family',
    'faith',
    'podcast',
    'movies',
    'nfl',
    'cinema80s',
  ];
}

/**
 * Get channel display name for an ID
 */
export function getChannelDisplayName(channelId: string): string {
  const displayNames: Record<string, string> = {
    tech: 'Technology',
    science: 'Science',
    history: 'History',
    nature: 'Nature',
    cooking: 'Cooking',
    fitness: 'Fitness',
    travel: 'Travel',
    maker: 'Maker',
    diy: 'Home DIY',
    automotive: 'Automotive',
    collecting: 'Collecting',
    art: 'Art & Design',
    gaming: 'Gaming',
    sports: 'Sports',
    teen: 'Teen',
    comedy: 'Comedy',
    music: 'Music',
    music80s: '80s Hits',
    music90s: '90s Classics',
    music00s: '2000s Pop',
    music10s: '2010s Bangers',
    kids: 'Kids',
    family: 'Family',
    faith: 'Faith',
    podcast: 'Podcasts',
    movies: 'Movies',
    nfl: 'NFL Highlights',
    cinema80s: '80s Cinema',
  };
  return displayNames[channelId] || channelId;
}
