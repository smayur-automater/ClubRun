"use client";
import { useEffect, useMemo, useState } from "react";
import { Search, SearchX } from "lucide-react";
import { TabBar } from "@/components/TabBar";
import { ClubCard } from "@/components/ClubCard";
import { EmptyState } from "@/components/EmptyState";
import * as data from "@/lib/data";
import type { Club, Vibe } from "@/lib/types";
import { VIBE_LABELS } from "@/lib/types";

const VIBE_FILTERS = Object.entries(VIBE_LABELS) as [Vibe, string][];

export default function ExplorePage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [query, setQuery] = useState("");
  const [vibe, setVibe] = useState<Vibe | null>(null);

  useEffect(() => {
    void data.getClubs().then((c) => {
      setClubs(c);
      setLoaded(true);
      // Onboarding pre-filter: land on clubs that match the picked vibe
      try {
        const prefs = JSON.parse(localStorage.getItem("cr.prefs") ?? "null");
        if (prefs?.vibe) setVibe(prefs.vibe as Vibe);
      } catch { /* corrupted prefs are ignorable */ }
    });
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return clubs.filter(
      (c) =>
        (!vibe || c.vibe === vibe) &&
        (!q || c.name.toLowerCase().includes(q) || c.area.toLowerCase().includes(q) || c.tagline.toLowerCase().includes(q)),
    );
  }, [clubs, query, vibe]);

  return (
    <div className="page">
      <header className="px-4 pt-6 pb-4">
        <h1 className="text-2xl font-black tracking-tight">Find your crew</h1>
        <div className="relative mt-4">
          <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--muted)" }} />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search clubs or areas"
            aria-label="Search clubs"
            style={{ paddingLeft: "2.75rem" }}
          />
        </div>
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1 -mx-4 px-4">
          <button type="button" className={`chip${vibe === null ? " active" : ""}`} onClick={() => setVibe(null)}>
            All
          </button>
          {VIBE_FILTERS.map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={`chip${vibe === value ? " active" : ""}`}
              onClick={() => setVibe(vibe === value ? null : value)}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      <section className="px-4 flex flex-col gap-3">
        {!loaded ? (
          <>
            <div className="skeleton h-36 w-full" />
            <div className="skeleton h-36 w-full" />
            <div className="skeleton h-36 w-full" />
          </>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="No clubs match"
            body="Try a different area or clear the vibe filter — new clubs join every week."
          />
        ) : (
          filtered.map((club) => <ClubCard key={club.id} club={club} />)
        )}
      </section>

      <TabBar />
    </div>
  );
}
