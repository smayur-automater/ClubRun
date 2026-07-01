"use client";
import { useEffect, useState } from "react";
import { UsersRound } from "lucide-react";
import { TabBar } from "@/components/TabBar";
import { ClubCard } from "@/components/ClubCard";
import { EmptyState } from "@/components/EmptyState";
import * as data from "@/lib/data";
import type { Club } from "@/lib/types";

export default function ClubsPage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    void data.getJoinedClubs().then((c) => {
      setClubs(c);
      setLoaded(true);
    });
  }, []);

  return (
    <div className="page">
      <header className="px-4 pt-6 pb-4">
        <h1 className="text-2xl font-black tracking-tight">Your clubs</h1>
        <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
          {loaded ? `${clubs.length} crew${clubs.length === 1 ? "" : "s"} counting on you` : " "}
        </p>
      </header>

      <section className="px-4 flex flex-col gap-3">
        {!loaded ? (
          <>
            <div className="skeleton h-36 w-full" />
            <div className="skeleton h-36 w-full" />
          </>
        ) : clubs.length === 0 ? (
          <EmptyState
            icon={UsersRound}
            title="No crew yet"
            body="Runners with a club show up 3× more often. Find one at your pace."
            ctaLabel="Explore clubs"
            ctaHref="/explore"
          />
        ) : (
          clubs.map((club) => <ClubCard key={club.id} club={club} />)
        )}
      </section>

      <TabBar />
    </div>
  );
}
