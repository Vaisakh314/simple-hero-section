import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const VISITOR_KEY = "pm_visitor_id";

function getVisitorId(): string {
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

const PageTracker = () => {
  const location = useLocation();
  const lastPath = useRef("");

  useEffect(() => {
    const path = location.pathname;
    // Don't track admin pages or duplicate consecutive views
    if (path.startsWith("/admin") || path === lastPath.current) return;
    lastPath.current = path;

    const visitorId = getVisitorId();
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (!supabaseUrl) return;

    const url = `${supabaseUrl}/functions/v1/track-pageview`;

    // Use sendBeacon for reliability, fall back to fetch
    const body = JSON.stringify({
      visitor_id: visitorId,
      page_path: path,
      page_title: document.title,
      referrer: document.referrer,
    });

    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon(url, blob);
    } else {
      fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => {});
    }
  }, [location.pathname]);

  return null;
};

export default PageTracker;
