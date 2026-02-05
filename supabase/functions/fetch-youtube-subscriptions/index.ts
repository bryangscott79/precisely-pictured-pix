import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface YouTubeSubscription {
  id: string;
  snippet: {
    title: string;
    resourceId: {
      channelId: string;
    };
    thumbnails?: {
      default?: { url: string };
    };
  };
  contentDetails?: {
    totalItemCount?: number;
  };
}

interface YouTubeSubscriptionsResponse {
  items: YouTubeSubscription[];
  nextPageToken?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
}

// ============================================
// Subscription Categorization (Inline)
// ============================================

// Known channel mappings (high confidence exact matches)
const KNOWN_CHANNELS: Record<string, string> = {
  // Cooking
  'nick digiovanni': 'cooking',
  'joshua weissman': 'cooking',
  'babish culinary universe': 'cooking',
  'binging with babish': 'cooking',
  'gordon ramsay': 'cooking',
  'bon appetit': 'cooking',
  'bon appétit': 'cooking',
  'epicurious': 'cooking',
  'tasty': 'cooking',
  'matty matheson': 'cooking',
  'adam ragusea': 'cooking',
  'ethan chlebowski': 'cooking',
  'sam the cooking guy': 'cooking',

  // Technology
  'mkbhd': 'tech',
  'marques brownlee': 'tech',
  'linus tech tips': 'tech',
  'linustechtips': 'tech',
  'fireship': 'tech',
  'mrwhosetheboss': 'tech',
  'dave2d': 'tech',
  'austin evans': 'tech',
  'unbox therapy': 'tech',
  'the verge': 'tech',

  // Maker / Engineering
  'mark rober': 'maker',
  'stuff made here': 'maker',
  'simone giertz': 'maker',
  'colin furze': 'maker',
  'adam savage': 'maker',
  'tested': 'maker',
  'william osman': 'maker',
  'michael reeves': 'maker',

  // Science
  'veritasium': 'science',
  'kurzgesagt': 'science',
  'vsauce': 'science',
  'smarter every day': 'science',
  'smartereveryday': 'science',
  'minutephysics': 'science',
  'scishow': 'science',
  'nilered': 'science',
  'tom scott': 'science',
  '3blue1brown': 'science',

  // Teen / Entertainment
  'dude perfect': 'teen',
  'mrbeast': 'teen',
  'mr beast': 'teen',
  'how ridiculous': 'teen',
  'ryan trahan': 'teen',
  'airrack': 'teen',

  // Automotive
  'donut media': 'automotive',
  'doug demuro': 'automotive',
  'top gear': 'automotive',
  'carwow': 'automotive',
  'throttle house': 'automotive',

  // Podcasts
  'joe rogan': 'podcast',
  'powerfuljre': 'podcast',
  'lex fridman': 'podcast',
  'huberman lab': 'podcast',
  'andrew huberman': 'podcast',
  'diary of a ceo': 'podcast',
  'impaulsive': 'podcast',
  'flagrant': 'podcast',
  'h3 podcast': 'podcast',
  'theo von': 'podcast',
  'my first million': 'podcast',
  'garyvee': 'podcast',
  'gary vaynerchuk': 'podcast',
  'gary vee': 'podcast',
  'ali abdaal': 'podcast',
  'graham stephan': 'podcast',

  // Gaming
  'dream': 'gaming',
  'pewdiepie': 'gaming',
  'markiplier': 'gaming',
  'jacksepticeye': 'gaming',
  'xqc': 'gaming',
  'ludwig': 'gaming',
  'dunkey': 'gaming',
  'videogamedunkey': 'gaming',

  // History
  'oversimplified': 'history',
  'history matters': 'history',
  'kings and generals': 'history',
  'extra history': 'history',

  // Nature
  'bbc earth': 'nature',
  'national geographic': 'nature',
  'nat geo': 'nature',
  'brave wilderness': 'nature',

  // Comedy
  'snl': 'comedy',
  'saturday night live': 'comedy',
  'key & peele': 'comedy',
  'college humor': 'comedy',
  'smosh': 'comedy',
  'daily show': 'comedy',
  'jimmy fallon': 'comedy',
  'tonight show': 'comedy',

  // Fitness
  'athlean-x': 'fitness',
  'jeff nippard': 'fitness',
  'blogilates': 'fitness',
  'yoga with adriene': 'fitness',
  'chloe ting': 'fitness',

  // Travel
  'yes theory': 'travel',
  'kara and nate': 'travel',
  'drew binsky': 'travel',
  'mark wiens': 'travel',

  // Art
  'bob ross': 'art',
  'proko': 'art',
  'art for kids hub': 'art',
  'jazza': 'art',

  // Home DIY
  'this old house': 'diy',
  'home renovision diy': 'diy',

  // Music
  'vevo': 'music',
  'genius': 'music',
  'theneedledrop': 'music',
  'rick beato': 'music',

  // Faith
  'bible project': 'faith',
  'the bible project': 'faith',
};

// Category keyword patterns
interface CategoryKeywords {
  channelId: string;
  keywords: string[];
  excludeKeywords?: string[];
}

const CATEGORY_KEYWORDS: CategoryKeywords[] = [
  { channelId: 'cooking', keywords: ['cook', 'recipe', 'kitchen', 'chef', 'food', 'baking', 'culinary'], excludeKeywords: ['mukbang'] },
  { channelId: 'tech', keywords: ['tech', 'technology', 'gadget', 'phone', 'laptop', 'computer', 'software'], excludeKeywords: ['gaming', 'game'] },
  { channelId: 'science', keywords: ['science', 'physics', 'chemistry', 'biology', 'space', 'astronomy', 'experiment'] },
  { channelId: 'maker', keywords: ['diy', 'build', 'make', 'engineering', 'project', 'workshop', 'craft'] },
  { channelId: 'gaming', keywords: ['gaming', 'gamer', 'gameplay', 'lets play', 'stream', 'esports'] },
  { channelId: 'fitness', keywords: ['fitness', 'workout', 'gym', 'exercise', 'yoga', 'training'] },
  { channelId: 'travel', keywords: ['travel', 'adventure', 'explore', 'destination', 'tourism'] },
  { channelId: 'automotive', keywords: ['car', 'auto', 'vehicle', 'motor', 'driving', 'racing'] },
  { channelId: 'history', keywords: ['history', 'historical', 'ancient', 'war', 'civilization'] },
  { channelId: 'comedy', keywords: ['comedy', 'funny', 'humor', 'sketch', 'standup', 'laugh'] },
  { channelId: 'music', keywords: ['music', 'song', 'album', 'artist', 'vevo', 'concert', 'band'] },
  { channelId: 'art', keywords: ['art', 'painting', 'drawing', 'artist', 'creative', 'design'] },
  { channelId: 'nature', keywords: ['nature', 'wildlife', 'animal', 'documentary', 'planet', 'ocean'] },
  { channelId: 'kids', keywords: ['kids', 'children', 'nursery', 'cartoon', 'animation'] },
  { channelId: 'podcast', keywords: ['podcast', 'interview', 'conversation', 'talk show'] },
  { channelId: 'sports', keywords: ['sports', 'football', 'basketball', 'soccer', 'baseball', 'nba', 'nfl'] },
  { channelId: 'faith', keywords: ['faith', 'christian', 'church', 'bible', 'sermon', 'worship'] },
  { channelId: 'diy', keywords: ['home improvement', 'renovation', 'house', 'interior', 'decor'] },
  { channelId: 'teen', keywords: ['challenge', 'stunt', 'extreme', 'viral', 'trending'] },
];

function categorizeSubscription(channelName: string): string | null {
  const normalizedName = channelName.toLowerCase().trim();

  // Check known channels first (high confidence)
  for (const [knownName, channelId] of Object.entries(KNOWN_CHANNELS)) {
    if (normalizedName.includes(knownName) || knownName.includes(normalizedName)) {
      return channelId;
    }
  }

  // Keyword matching
  let bestMatch: string | null = null;
  let maxMatches = 0;

  for (const category of CATEGORY_KEYWORDS) {
    // Check exclude keywords first
    if (category.excludeKeywords?.some(kw => normalizedName.includes(kw))) {
      continue;
    }

    const matches = category.keywords.filter(kw => normalizedName.includes(kw)).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      bestMatch = category.channelId;
    }
  }

  return bestMatch;
}

// ============================================
// Main Handler
// ============================================

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Get the authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get the user's Google access token from their session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      return new Response(
        JSON.stringify({ error: "No active session" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const providerToken = session.provider_token;
    if (!providerToken) {
      return new Response(
        JSON.stringify({
          error: "No YouTube access token. Please sign in again with YouTube permissions.",
          requiresReauth: true
        }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch YouTube subscriptions
    const allSubscriptions: YouTubeSubscription[] = [];
    let nextPageToken: string | undefined;
    let pageCount = 0;
    const maxPages = 10; // Safety limit

    do {
      const url = new URL("https://www.googleapis.com/youtube/v3/subscriptions");
      url.searchParams.set("part", "snippet,contentDetails");
      url.searchParams.set("mine", "true");
      url.searchParams.set("maxResults", "50");
      if (nextPageToken) {
        url.searchParams.set("pageToken", nextPageToken);
      }

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${providerToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("YouTube API error:", response.status, errorData);

        if (response.status === 401 || response.status === 403) {
          return new Response(
            JSON.stringify({
              error: "YouTube access expired. Please sign in again.",
              requiresReauth: true
            }),
            { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        return new Response(
          JSON.stringify({ error: "Failed to fetch YouTube subscriptions" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const data: YouTubeSubscriptionsResponse = await response.json();
      allSubscriptions.push(...data.items);
      nextPageToken = data.nextPageToken;
      pageCount++;

      console.log(`Fetched page ${pageCount}, got ${data.items.length} subscriptions`);
    } while (nextPageToken && pageCount < maxPages);

    // Transform and store subscriptions with categorization
    const subscriptionsData = allSubscriptions.map((sub) => {
      const channelName = sub.snippet.title;
      const matchedChannel = categorizeSubscription(channelName);

      return {
        user_id: user.id,
        youtube_channel_id: sub.snippet.resourceId.channelId,
        channel_name: channelName,
        subscriber_count: sub.contentDetails?.totalItemCount || null,
        is_selected: true,
        matched_epishow_channel: matchedChannel, // Now populated with categorization!
      };
    });

    // Log categorization stats
    const categorized = subscriptionsData.filter(s => s.matched_epishow_channel !== null);
    console.log(`Categorized ${categorized.length}/${subscriptionsData.length} subscriptions`);

    // Clear existing subscriptions for this user and insert new ones
    const { error: deleteError } = await supabase
      .from("imported_subscriptions")
      .delete()
      .eq("user_id", user.id);

    if (deleteError) {
      console.error("Error deleting old subscriptions:", deleteError);
    }

    if (subscriptionsData.length > 0) {
      const { error: insertError } = await supabase
        .from("imported_subscriptions")
        .insert(subscriptionsData);

      if (insertError) {
        console.error("Error inserting subscriptions:", insertError);
        return new Response(
          JSON.stringify({ error: "Failed to save subscriptions" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        count: subscriptionsData.length,
        categorizedCount: categorized.length,
        subscriptions: subscriptionsData.map((s) => ({
          channelId: s.youtube_channel_id,
          channelName: s.channel_name,
          matchedChannel: s.matched_epishow_channel,
        })),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in fetch-youtube-subscriptions:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
