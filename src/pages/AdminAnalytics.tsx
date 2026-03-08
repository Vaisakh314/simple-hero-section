import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Eye, Globe, UserPlus, UserCheck } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid,
} from "recharts";

type Period = "7d" | "30d" | "90d";

function getDateRange(period: Period) {
  const now = new Date();
  const days = period === "7d" ? 7 : period === "30d" ? 30 : 90;
  const start = new Date(now);
  start.setDate(start.getDate() - days);
  return { start: start.toISOString(), days };
}

const PAGE_LABELS: Record<string, string> = {
  "/": "Home / Hero",
  "/about": "About",
  "/work": "Case Studies",
  "/blog": "Blog",
  "/contact": "Contact",
  "/resume": "Resume",
};

const COLORS = [
  "hsl(172, 60%, 30%)", "hsl(220, 25%, 40%)", "hsl(40, 70%, 50%)",
  "hsl(0, 60%, 50%)", "hsl(280, 50%, 50%)", "hsl(120, 40%, 40%)",
  "hsl(200, 60%, 45%)", "hsl(330, 50%, 45%)",
];

const AdminAnalytics = () => {
  const [period, setPeriod] = useState<Period>("30d");
  const { start, days } = getDateRange(period);

  const { data: views, isLoading } = useQuery({
    queryKey: ["admin-analytics", period],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_views")
        .select("*")
        .gte("created_at", start)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div className="container py-12 text-muted-foreground">Loading analytics…</div>;
  }

  const allViews = views ?? [];
  const totalPageviews = allViews.length;
  const uniqueVisitors = new Set(allViews.map((v) => v.visitor_id)).size;
  const newVisitors = allViews.filter((v) => v.is_new_visitor).length;
  const newUniqueVisitors = new Set(allViews.filter((v) => v.is_new_visitor).map((v) => v.visitor_id)).size;
  const returningUniqueVisitors = uniqueVisitors - newUniqueVisitors;

  // Pageviews over time
  const dateMap = new Map<string, number>();
  for (const v of allViews) {
    const d = v.created_at.slice(0, 10);
    dateMap.set(d, (dateMap.get(d) ?? 0) + 1);
  }
  const timelineData = Array.from(dateMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, views: count }));

  // By page
  const pageMap = new Map<string, { views: number; visitors: Set<string> }>();
  for (const v of allViews) {
    // Normalize: /work/slug → individual case study, /blog/slug → individual post
    let path = v.page_path;
    if (!pageMap.has(path)) pageMap.set(path, { views: 0, visitors: new Set() });
    const entry = pageMap.get(path)!;
    entry.views++;
    entry.visitors.add(v.visitor_id);
  }
  const pageData = Array.from(pageMap.entries())
    .map(([path, data]) => ({
      path,
      label: PAGE_LABELS[path] || path,
      views: data.views,
      visitors: data.visitors.size,
    }))
    .sort((a, b) => b.views - a.views);

  // New vs Returning pie
  const newRetPie = [
    { name: "New Visitors", value: newUniqueVisitors },
    { name: "Returning Visitors", value: returningUniqueVisitors },
  ];

  // Location data
  const countryMap = new Map<string, number>();
  for (const v of allViews) {
    const c = v.country || "Unknown";
    countryMap.set(c, (countryMap.get(c) ?? 0) + 1);
  }
  const locationData = Array.from(countryMap.entries())
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  // City data
  const cityMap = new Map<string, number>();
  for (const v of allViews) {
    if (v.city) cityMap.set(v.city, (cityMap.get(v.city) ?? 0) + 1);
  }
  const cityData = Array.from(cityMap.entries())
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  // New vs Returning by section
  const sectionPaths = ["/", "/about", "/work", "/blog", "/contact", "/resume"];
  const newRetBySection = sectionPaths.map((path) => {
    const sectionViews = allViews.filter((v) => v.page_path === path || v.page_path.startsWith(path + "/"));
    const newV = new Set(sectionViews.filter((v) => v.is_new_visitor).map((v) => v.visitor_id)).size;
    const allV = new Set(sectionViews.map((v) => v.visitor_id)).size;
    return {
      section: PAGE_LABELS[path] || path,
      new: newV,
      returning: allV - newV,
    };
  });

  return (
    <div className="container py-12">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm">
            <Link to="/admin"><ArrowLeft className="mr-2 h-4 w-4" /> Admin</Link>
          </Button>
          <h1 className="font-heading text-2xl text-foreground">Analytics</h1>
        </div>
        <div className="flex gap-1">
          {(["7d", "30d", "90d"] as Period[]).map((p) => (
            <Button
              key={p}
              variant={period === p ? "default" : "outline"}
              size="sm"
              onClick={() => setPeriod(p)}
            >
              {p === "7d" ? "7 days" : p === "30d" ? "30 days" : "90 days"}
            </Button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard icon={<Eye className="h-5 w-5" />} label="Total Pageviews" value={totalPageviews} />
        <StatCard icon={<Users className="h-5 w-5" />} label="Unique Visitors" value={uniqueVisitors} />
        <StatCard icon={<UserPlus className="h-5 w-5" />} label="New Visitors" value={newUniqueVisitors} />
        <StatCard icon={<UserCheck className="h-5 w-5" />} label="Returning Visitors" value={returningUniqueVisitors} />
      </div>

      {/* Pageviews over time */}
      <div className="mb-8 rounded-lg border border-border bg-card p-6">
        <h2 className="mb-4 font-heading text-lg text-foreground">Pageviews Over Time</h2>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={timelineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
            <Line type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* By page */}
      <div className="mb-8 rounded-lg border border-border bg-card p-6">
        <h2 className="mb-4 font-heading text-lg text-foreground">Pageviews by Page</h2>
        <ResponsiveContainer width="100%" height={Math.max(200, pageData.length * 36)}>
          <BarChart data={pageData} layout="vertical" margin={{ left: 120 }}>
            <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis dataKey="label" type="category" tick={{ fontSize: 11 }} width={110} stroke="hsl(var(--muted-foreground))" />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
            <Bar dataKey="views" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mb-8 grid gap-8 md:grid-cols-2">
        {/* New vs Returning */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 font-heading text-lg text-foreground">New vs Returning Visitors</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={newRetPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`}>
                {newRetPie.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* New vs Returning by section */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 font-heading text-lg text-foreground">New vs Returning by Section</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={newRetBySection}>
              <XAxis dataKey="section" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
              <Bar dataKey="new" fill={COLORS[0]} name="New" stackId="a" radius={[0, 0, 0, 0]} />
              <Bar dataKey="returning" fill={COLORS[1]} name="Returning" stackId="a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Locations */}
      <div className="mb-8 grid gap-8 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 flex items-center gap-2 font-heading text-lg text-foreground">
            <Globe className="h-5 w-5 text-primary" /> Visitors by Country
          </h2>
          <div className="space-y-2">
            {locationData.length === 0 ? (
              <p className="text-sm text-muted-foreground">No location data yet</p>
            ) : (
              locationData.map((loc) => (
                <div key={loc.country} className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{loc.country}</span>
                  <span className="font-medium text-muted-foreground">{loc.count}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 font-heading text-lg text-foreground">Top Cities</h2>
          <div className="space-y-2">
            {cityData.length === 0 ? (
              <p className="text-sm text-muted-foreground">No city data yet</p>
            ) : (
              cityData.map((loc) => (
                <div key={loc.city} className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{loc.city}</span>
                  <span className="font-medium text-muted-foreground">{loc.count}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Detailed page table */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-4 font-heading text-lg text-foreground">All Pages Detail</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-2 pr-4">Page</th>
                <th className="pb-2 pr-4 text-right">Pageviews</th>
                <th className="pb-2 text-right">Unique Visitors</th>
              </tr>
            </thead>
            <tbody>
              {pageData.map((p) => (
                <tr key={p.path} className="border-b border-border/50">
                  <td className="py-2 pr-4 text-foreground">{p.label}</td>
                  <td className="py-2 pr-4 text-right text-muted-foreground">{p.views}</td>
                  <td className="py-2 text-right text-muted-foreground">{p.visitors}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) => (
  <div className="rounded-lg border border-border bg-card p-4">
    <div className="flex items-center gap-2 text-primary">{icon}</div>
    <div className="mt-2 text-2xl font-bold text-foreground">{value.toLocaleString()}</div>
    <div className="text-xs text-muted-foreground">{label}</div>
  </div>
);

export default AdminAnalytics;
