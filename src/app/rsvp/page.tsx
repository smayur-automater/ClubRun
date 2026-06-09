"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Check, ChevronRight } from "lucide-react";
import { ViewTransition } from "react";
import { getNextRunDate, formatRelativeDate, formatTime } from "@/lib/dates";

const nextRun = getNextRunDate();
const runLabel = formatRelativeDate(nextRun);
const runTime  = formatTime(nextRun);

const paceGroups = [
  { id: 1, label: "Fast Group",        pace: "4:30 – 4:59/km", leader: "James K.", count: 4,  max: 8,  color: "#7c3aed" },
  { id: 2, label: "Steady Group",      pace: "5:00 – 5:29/km", leader: "Marcus T.", count: 6, max: 10, color: "var(--orange)" },
  { id: 3, label: "Comfortable Group", pace: "5:30 – 5:59/km", leader: "Lisa R.",   count: 4, max: 10, color: "#0891b2" },
  { id: 4, label: "Social Group",      pace: "6:00+/km",        leader: "Amy W.",    count: 3, max: 12, color: "#16a34a" },
];

export default function RSVPPage() {
  const [selected, setSelected] = useState<number | null>(2);
  const [confirmed, setConfirmed] = useState(false);
  const [pulsing, setPulsing] = useState<number | null>(null);

  const selectGroup = (id: number) => {
    setSelected(id);
    setPulsing(id);
    setTimeout(() => setPulsing(null), 600);
  };

  if (confirmed) {
    const group = paceGroups.find(g => g.id === selected);
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center" style={{ background: "var(--navy)" }}>
        <ViewTransition name="confirm-check">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6" style={{ background: "rgba(22,163,74,0.2)", border: "2px solid #16a34a" }}>
            <Check size={40} style={{ color: "#16a34a" }} />
          </div>
        </ViewTransition>
        <h1 className="text-3xl font-black text-white mb-3">You&apos;re in! 🏃</h1>
        <p className="text-lg mb-2" style={{ color: "rgba(255,255,255,0.8)" }}>See you {runLabel} at {runTime}</p>
        {group && (
          <p className="text-sm mb-2" style={{ color: "rgba(255,255,255,0.55)" }}>
            {group.label} · {group.pace}
          </p>
        )}
        <p className="text-xs mb-10" style={{ color: "rgba(255,255,255,0.35)" }}>We&apos;ll send you a reminder tonight at 7pm</p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Link href="/member" transitionTypes={["nav-back"]} className="btn-primary text-base justify-center" style={{ minHeight: "52px" }}>
            Back to Home
          </Link>
          <button
            onClick={() => setConfirmed(false)}
            className="text-sm font-semibold py-3"
            style={{ color: "rgba(255,255,255,0.5)", background: "none", border: "none", cursor: "pointer" }}
          >
            Change my pace group
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-8" style={{ background: "var(--surface)" }}>
      {/* Header */}
      <header className="px-4 py-3 flex items-center gap-3 sticky top-0 z-30 border-b" style={{ background: "var(--navy)", borderColor: "var(--navy-light)" }}>
        <Link href="/member" transitionTypes={["nav-back"]} className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,255,255,0.1)" }}>
          <ArrowLeft size={18} className="text-white" />
        </Link>
        <div>
          <div className="font-bold text-white">Tuesday Morning Run</div>
          <div className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>{runLabel} · {runTime}</div>
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
          <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>Tap to select — you can change until tonight</p>

          <div className="space-y-3">
            {paceGroups.map(group => {
              const isSelected = selected === group.id;
              const spotsLeft  = group.max - group.count;
              return (
                <button
                  key={group.id}
                  onClick={() => selectGroup(group.id)}
                  className={`w-full text-left rounded-2xl p-4 border-2 transition-all ${pulsing === group.id ? "pulse" : ""}`}
                  style={{
                    background: "var(--background)",
                    borderColor: isSelected ? group.color : "var(--border)",
                    boxShadow: isSelected ? `0 0 0 1px ${group.color}` : "none",
                    transform: isSelected ? "scale(1.01)" : "scale(1)",
                    transition: "border-color 0.2s, box-shadow 0.2s, transform 0.15s",
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: group.color }} />
                        <span className="font-black text-base" style={{ color: "var(--navy)" }}>{group.label}</span>
                      </div>
                      <div className="text-sm font-bold ml-5" style={{ color: group.color }}>{group.pace}</div>
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
                        {Array.from({ length: Math.min(group.count, 4) }).map((_,i) => (
                          <div key={i} className="w-5 h-5 rounded-full" style={{ background: group.color, opacity: 0.7 - i*0.12, border: "1.5px solid var(--background)" }} />
                        ))}
                      </div>
                      <span className="text-xs font-bold" style={{ color: "var(--navy)" }}>{group.count}</span>
                      <span className="text-xs" style={{ color: spotsLeft < 3 ? "#dc2626" : "var(--muted)" }}>
                        · {spotsLeft} spots left
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Confirm */}
        <button
          onClick={() => selected && setConfirmed(true)}
          disabled={!selected}
          className="btn-primary w-full justify-center text-base"
          style={{ minHeight: "52px", opacity: selected ? 1 : 0.45 }}
        >
          Confirm — I&apos;m Coming! <ChevronRight size={16} />
        </button>

        <p className="text-center text-xs" style={{ color: "var(--muted)" }}>
          You can change your RSVP any time before midnight tonight
        </p>
      </div>
    </div>
  );
}
