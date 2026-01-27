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

    // Transform and store subscriptions
    const subscriptionsData = allSubscriptions.map((sub) => ({
      user_id: user.id,
      youtube_channel_id: sub.snippet.resourceId.channelId,
      channel_name: sub.snippet.title,
      subscriber_count: sub.contentDetails?.totalItemCount || null,
      is_selected: true,
      matched_epishow_channel: null, // Will be matched later
    }));

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
        subscriptions: subscriptionsData.map((s) => ({
          channelId: s.youtube_channel_id,
          channelName: s.channel_name,
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
