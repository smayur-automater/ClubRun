"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Check } from "lucide-react";

const paceGroups = [
  { id: 1, label: "Fast Group", pace: "4:30 – 4:59/km", leader: "James K.", count: 4, max: 8, color: "#7c3aed" },
  { id: 2, label: "Steady Group", pace: "5:00 – 5:29/km", leader: "Marcus T.", count: 6, max: 10, color: "var(--orange)" },
  { id: 3, label: "Comfortable Group", pace: "5:30 – 5:59/km", leader: "Lisa R.", count: 4, max: 10, color: "#0891b2" },
  { id: 4, label: "Social Group", pace: "6:00+/km", leader: "Amy W.", count: 3, max: 12, color: "#16a34a" },
];

export default function RSVPPage() {
  const [selected, setSelected] = useState<number | null>(2);
  const [confirmed, setConfirmed] = useState(false);

  if (confirmed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center" style={{ background: "var(--navy)" }}>
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6" style={{ background: "rgba(249,115,22,0.2)", border: "2px solid var(--orange)" }}>
          <Check size={36} style={{ color: "var(--orange)" }} />
        </div>
        <h1 className="text-3xl font-black text-white mb-3">You&apos;re in! 🏃</h1>
        <p className="text-lg mb-2" style={{ color: "rgba(255,255,255,0.8)" }}>See you Tuesday at 5:30am</p>
        <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.5)" }}>
          {paceGroups.find(g => g.id === selected)?.label} · {paceGroups.find(g => g.id === selected)?.pace}
        </p>
        <p className="text-xs mb-8" style={{ color: "rgba(255,255,255,0.4)" }}>We&apos;ll remind you tonight at 7pm</p>
        <Link href="/member" className="btn-primary text-lg" style={{ padding: "1rem 2.5rem" }}>Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-8" style={{ background: "var(--surface)" }}>
      {/* Header */}
      <header className="px-4 py-4 flex items-center gap-3 sticky top-0 z-30 border-b" style={{ background: "var(--navy)", borderColor: "var(--navy-light)" }}>
        <Link href="/member" className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.1)" }}>
          <ArrowLeft size={18} className="text-white" />
        </Link>
        <div>
          <div className="font-bold text-white">Tuesday Morning Run</div>
          <div className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>Tue 10 Jun · 5:30am</div>
        </div>
      </header>

      <div className="px-4 py-5 max-w-lg mx-auto space-y-4">
        {/* Run Details */}
        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <MapPin size={14} style={{ color: "var(--orange)" }} />
            <span className="text-sm font-semibold" style={{ color: "var(--navy)" }}>Centennial Park, Gate 5</span>
          </div>
          <div className="flex gap-4 text-sm" style={{ color: "var(--muted)" }}>
            <span>10km route</span>
            <span>·</span>
            <span>17 RSVPs so far</span>
          </div>
        </div>

        {/* Pace Groups */}
        <div>
          <h2 className="font-black text-xl mb-1" style={{ color: "var(--navy)" }}>Pick your pace group</h2>
          <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>Tap to select — you can change until midnight tonight</p>
          <div className="space-y-3">
            {paceGroups.map(group => {
              const isSelected = selected === group.id;
              const spotsLeft = group.max - group.count;
              return (
                <button
                  key={group.id}
                  onClick={() => setSelected(group.id)}
                  className="w-full text-left rounded-2xl p-4 border-2 transition-all"
                  style={{
                    background: isSelected ? "var(--background)" : "var(--background)",
                    borderColor: isSelected ? group.color : "var(--border)",
                    boxShadow: isSelected ? `0 0 0 1px ${group.color}` : "none",
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <div className="w-3 h-3 rounded-full" style={{ background: group.color }} />
                        <span className="font-black text-base" style={{ color: "var(--navy)" }}>{group.label}</span>
                      </div>
                      <div className="text-sm font-semibold ml-5" style={{ color: group.color }}>{group.pace}</div>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: group.color }}>
                        <Check size={14} className="text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-3 ml-5">
                    <div className="text-xs" style={{ color: "var(--muted)" }}>
                      Led by <span className="font-semibold" style={{ color: "var(--navy)" }}>{group.leader}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-1">
                        {Array.from({ length: Math.min(group.count, 4) }).map((_, i) => (
                          <div key={i} className="w-5 h-5 rounded-full border border-white" style={{ background: group.color, opacity: 0.7 - i * 0.1 }} />
                        ))}
                      </div>
                      <span className="text-xs font-semibold" style={{ color: "var(--navy)" }}>{group.count}</span>
                      <span className="text-xs" style={{ color: "var(--muted)" }}>· {spotsLeft} spots left</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Confirm Button */}
        <button
          onClick={() => selected && setConfirmed(true)}
          disabled={!selected}
          className="btn-primary w-full justify-center text-lg"
          style={{ opacity: selected ? 1 : 0.5, minHeight: "52px" }}
        >
          Confirm — I&apos;m Coming!
        </button>
      </div>
    </div>
  );
}
