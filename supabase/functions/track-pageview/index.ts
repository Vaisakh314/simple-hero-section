import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { visitor_id, page_path, page_title, referrer } = await req.json();

    if (!visitor_id || !page_path) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get visitor IP from headers
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("cf-connecting-ip") ||
      req.headers.get("x-real-ip") ||
      "";

    // Geolocation lookup
    let country = "";
    let city = "";
    if (ip && ip !== "127.0.0.1" && ip !== "::1") {
      try {
        const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=country,city`);
        if (geoRes.ok) {
          const geo = await geoRes.json();
          country = geo.country || "";
          city = geo.city || "";
        }
      } catch {
        // Silently fail geo lookup
      }
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Check if this visitor has any previous views
    const { count } = await supabase
      .from("page_views")
      .select("id", { count: "exact", head: true })
      .eq("visitor_id", visitor_id);

    const is_new_visitor = (count ?? 0) === 0;

    const { error } = await supabase.from("page_views").insert({
      visitor_id,
      page_path,
      page_title: page_title || "",
      referrer: referrer || "",
      country,
      city,
      user_agent: req.headers.get("user-agent") || "",
      is_new_visitor,
    });

    if (error) throw error;

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
