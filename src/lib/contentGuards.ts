// Centralized, lightweight content guards to prevent off-topic videos from being shown.
// This is intentionally title-based so it can be applied to:
// - dynamic search results (have title)
// - the actual playing title from the YouTube player (ground truth)

const normalize = (s: string) => (s || '').toLowerCase();

// Broad kids/music/off-topic terms we never want on non-kids channels.
// Keep this conservative: only obvious indicators.
const GLOBAL_BLOCK_TERMS: string[] = [
  'nursery',
  'preschool',
  'preschooler',
  'toddler',
  'toddlers',
  'kids',
  'children',
  'baby',
  'cocomelon',
  'pinkfong',
  'baby shark',
  'abc song',
  'phonics',
  'days of the week',
];

// Spanish/foreign language indicators - block these on non-Spanish channels
const FOREIGN_LANGUAGE_TERMS: string[] = [
  // Spanish indicators
  'en español',
  'en espanol',
  'español',
  'espanol',
  'latino',
  'latinoamérica',
  'latinoamerica',
  'subtitulado',
  'doblado',
  'doblaje',
  'versión en',
  'version en',
  // Portuguese
  'em português',
  'em portugues',
  'dublado',
  'dublagem',
  'legendado',
  // German
  'auf deutsch',
  'synchronisiert',
  // Italian
  'in italiano',
  'doppiato',
  // French
  'en français',
  'en francais',
  'doublé',
  // Russian
  'на русском',
  'дубляж',
  // Generic dubbed/translated indicators
  '(dub)',
  '(dubbed)',
  '(sub)',
  '(subbed)',
];

// Sports should never be music/parody/animations.
const SPORTS_EXTRA_BLOCK_TERMS: string[] = [
  'song',
  'songs',
  'music',
  'parody',
  'cartoon',
  'animation',
  'remix',
  'cover',
];

// Minimal set of "this is clearly sports" signals.
// If none appear, we treat it as off-topic for sports channels.
const SPORTS_ALLOW_TERMS: string[] = [
  'highlights',
  'highlight',
  'recap',
  'game',
  'match',
  'final',
  'playoffs',
  'season',
  'top plays',
  'best plays',
  'goals',
  'goal',
  'touchdown',
  'dunk',
  'home run',
  'homerun',
  'knockout',
  'fight',
  // leagues/sports
  'nfl',
  'nba',
  'mlb',
  'nhl',
  'ncaa',
  'premier league',
  'uefa',
  'fifa',
  'soccer',
  'football',
  'basketball',
  'baseball',
  'hockey',
  'tennis',
  'golf',
  'ufc',
  'wwe',
];

function includesAny(haystack: string, terms: string[]) {
  return terms.some((t) => haystack.includes(t));
}

export function isAllowedVideoTitle(channelId: string, title: string): boolean {
  const ch = normalize(channelId);
  const t = normalize(title);

  if (!t) return true;

  // Kids/family channels are allowed to show kids terms.
  if (ch === 'kids' || ch === 'family') return true;

  // Block foreign language content on all non-music channels
  // (Music channels may have valid international hits)
  if (!ch.startsWith('music')) {
    if (includesAny(t, FOREIGN_LANGUAGE_TERMS)) {
      console.log(`[ContentGuard] Blocked foreign language content: "${title}" on channel ${channelId}`);
      return false;
    }
  }

  // Global block terms for all other channels.
  if (includesAny(t, GLOBAL_BLOCK_TERMS)) {
    console.log(`[ContentGuard] Blocked kids content: "${title}" on channel ${channelId}`);
    return false;
  }

  // Sports/NFL extra strictness.
  if (ch === 'sports' || ch === 'nfl') {
    if (includesAny(t, SPORTS_EXTRA_BLOCK_TERMS)) {
      console.log(`[ContentGuard] Blocked music/parody on sports: "${title}"`);
      return false;
    }
    // Require at least one sports signal.
    if (!includesAny(t, SPORTS_ALLOW_TERMS)) {
      console.log(`[ContentGuard] Blocked non-sports content: "${title}"`);
      return false;
    }
  }

  return true;
}
