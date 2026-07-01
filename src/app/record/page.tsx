"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Play, Pause, Flag, Check } from "lucide-react";
import { TabBar } from "@/components/TabBar";
import { getTracker, type TrackerSnapshot } from "@/lib/tracker";
import * as data from "@/lib/data";
import { formatDuration, formatKm, formatPace } from "@/lib/format";

export default function RecordPage() {
  const router = useRouter();
  const tracker = getTracker();
  const [snap, setSnap] = useState<TrackerSnapshot>(() => tracker.snapshot());
  const [saved, setSaved] = useState(false);

  useEffect(() => tracker.subscribe(setSnap), [tracker]);

  const finishAndSave = async () => {
    const final = tracker.finish();
    if (final.distanceM > 0 && final.elapsedS > 0) {
      await data.saveActivity({ durationS: final.elapsedS, distanceM: final.distanceM });
      setSaved(true);
    }
  };

  const done = () => {
    tracker.reset();
    setSaved(false);
    router.push("/");
  };

  // ── Pre-run ────────────────────────────────────────────────────
  if (snap.phase === "idle") {
    return (
      <div className="page flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-6">
          <div>
            <p className="stat-label">Ready when you are</p>
            <h1 className="text-4xl font-black tracking-tight mt-2">Lace up.</h1>
            <p className="mt-3 max-w-[26ch] mx-auto" style={{ color: "var(--muted)" }}>
              Distance, pace, and splits — tracked live, even with no signal.
            </p>
          </div>
          <button
            type="button"
            onClick={() => tracker.start()}
            className="flex items-center justify-center w-24 h-24 rounded-full transition-transform active:scale-90"
            style={{ background: "var(--volt)", color: "var(--volt-ink)", boxShadow: "0 8px 40px color-mix(in srgb, var(--volt) 45%, transparent)" }}
            aria-label="Start run"
          >
            <Play size={38} strokeWidth={2.5} fill="currentColor" />
          </button>
        </div>
        <TabBar />
      </div>
    );
  }

  // ── Finished summary ───────────────────────────────────────────
  if (snap.phase === "finished") {
    return (
      <div className="page flex flex-col">
        <div className="flex-1 flex flex-col justify-center px-6 gap-8">
          <div className="text-center">
            <span className="streak-pill"><Check size={14} strokeWidth={3} /> {saved ? "Run saved" : "Run complete"}</span>
            <h1 className="text-3xl font-black tracking-tight mt-4">You showed up.</h1>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="card py-5">
              <p className="stat-value text-2xl">{formatKm(snap.distanceM)}</p>
              <p className="stat-label mt-1.5">km</p>
            </div>
            <div className="card py-5">
              <p className="stat-value text-2xl">{formatDuration(snap.elapsedS)}</p>
              <p className="stat-label mt-1.5">time</p>
            </div>
            <div className="card py-5">
              <p className="stat-value text-2xl">{snap.paceS ? formatPace(snap.paceS) : "—"}</p>
              <p className="stat-label mt-1.5">avg /km</p>
            </div>
          </div>
          {snap.splits.length > 0 && (
            <div className="card">
              <p className="stat-label mb-3">Splits</p>
              <div className="flex flex-col gap-2">
                {snap.splits.map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs font-bold w-8" style={{ color: "var(--muted)" }}>km {i + 1}</span>
                    <div className="flex-1 h-2 rounded-full" style={{ background: "var(--surface-2)" }}>
                      <div
                        className="h-2 rounded-full"
                        style={{ background: "var(--volt)", width: `${Math.min(100, (Math.min(...snap.splits) / s) * 100)}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold tabular-nums">{formatDuration(s)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <button type="button" onClick={done} className="btn-volt w-full">Done</button>
        </div>
      </div>
    );
  }

  // ── Live run — glanceable while moving: max type, volt on carbon ─
  const paused = snap.phase === "paused";
  return (
    <div className="page flex flex-col" style={{ paddingBottom: 0 }}>
      <div className="flex-1 flex flex-col justify-center px-6 gap-10">
        <div className="flex items-center justify-center gap-2">
          {!paused && <span className="live-dot" />}
          <span className="stat-label">{paused ? "Paused" : "Live"}</span>
        </div>
        <div className="text-center">
          <p className="stat-value" style={{ fontSize: "clamp(4.5rem, 24vw, 7rem)", color: paused ? "var(--muted)" : "var(--volt)" }}>
            {formatKm(snap.distanceM)}
          </p>
          <p className="stat-label mt-2">kilometres</p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-center">
          <div>
            <p className="stat-value text-4xl">{formatDuration(snap.elapsedS)}</p>
            <p className="stat-label mt-2">time</p>
          </div>
          <div>
            <p className="stat-value text-4xl">{snap.paceS ? formatPace(snap.paceS) : "—:—"}</p>
            <p className="stat-label mt-2">pace /km</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-5 pb-14 pt-6">
        <button
          type="button"
          onClick={() => (paused ? tracker.resume() : tracker.pause())}
          className="flex items-center justify-center w-20 h-20 rounded-full transition-transform active:scale-90"
          style={{ background: "var(--surface-2)", color: "var(--text)", border: "1px solid var(--border)" }}
          aria-label={paused ? "Resume run" : "Pause run"}
        >
          {paused ? <Play size={30} fill="currentColor" /> : <Pause size={30} fill="currentColor" />}
        </button>
        <button
          type="button"
          onClick={finishAndSave}
          className="flex items-center justify-center w-20 h-20 rounded-full transition-transform active:scale-90"
          style={{ background: "var(--volt)", color: "var(--volt-ink)" }}
          aria-label="Finish run"
        >
          <Flag size={28} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
