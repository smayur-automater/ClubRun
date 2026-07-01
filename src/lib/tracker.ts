/**
 * Run tracker behind a stable interface (docs/ARCHITECTURE.md).
 *
 * The Record screen only talks to `Tracker`, so replacing the simulated
 * implementation with real geolocation + sensor fusion is a drop-in swap.
 * State lives in a module singleton: a run in progress survives navigating
 * away and back, and never depends on network (offline-first requirement).
 */

export type TrackerPhase = "idle" | "running" | "paused" | "finished";

export interface TrackerSnapshot {
  phase: TrackerPhase;
  elapsedS: number;
  distanceM: number;
  /** Current pace, seconds per km; null until moving */
  paceS: number | null;
  /** Completed km split durations in seconds */
  splits: number[];
}

export interface Tracker {
  snapshot(): TrackerSnapshot;
  subscribe(listener: (s: TrackerSnapshot) => void): () => void;
  start(): void;
  pause(): void;
  resume(): void;
  /** Ends the run and returns the final snapshot. */
  finish(): TrackerSnapshot;
  reset(): void;
}

/** Simulated movement: ~5:20/km with gentle drift, ticking once per second. */
class SimulatedTracker implements Tracker {
  private phase: TrackerPhase = "idle";
  private elapsedS = 0;
  private distanceM = 0;
  private splits: number[] = [];
  private lastSplitAtS = 0;
  private drift = 0;
  private timer: ReturnType<typeof setInterval> | null = null;
  private listeners = new Set<(s: TrackerSnapshot) => void>();

  snapshot(): TrackerSnapshot {
    const paceS = this.distanceM > 30 ? Math.round(this.elapsedS / (this.distanceM / 1000)) : null;
    return {
      phase: this.phase,
      elapsedS: this.elapsedS,
      distanceM: this.distanceM,
      paceS,
      splits: [...this.splits],
    };
  }

  subscribe(listener: (s: TrackerSnapshot) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  start(): void {
    if (this.phase !== "idle") return;
    this.phase = "running";
    this.tickEvery();
  }

  pause(): void {
    if (this.phase !== "running") return;
    this.phase = "paused";
    this.stopTimer();
    this.emit();
  }

  resume(): void {
    if (this.phase !== "paused") return;
    this.phase = "running";
    this.tickEvery();
  }

  finish(): TrackerSnapshot {
    this.stopTimer();
    this.phase = "finished";
    this.emit();
    return this.snapshot();
  }

  reset(): void {
    this.stopTimer();
    this.phase = "idle";
    this.elapsedS = 0;
    this.distanceM = 0;
    this.splits = [];
    this.lastSplitAtS = 0;
    this.drift = 0;
    this.emit();
  }

  private tickEvery(): void {
    this.stopTimer();
    this.timer = setInterval(() => this.tick(), 1000);
    this.emit();
  }

  private tick(): void {
    this.elapsedS += 1;
    // ~3.125 m/s baseline (5:20/km) with a slow random walk ±8%
    this.drift = Math.max(-0.25, Math.min(0.25, this.drift + (Math.random() - 0.5) * 0.04));
    this.distanceM += 3.125 * (1 + this.drift);
    const kmDone = Math.floor(this.distanceM / 1000);
    if (kmDone > this.splits.length) {
      this.splits.push(this.elapsedS - this.lastSplitAtS);
      this.lastSplitAtS = this.elapsedS;
    }
    this.emit();
  }

  private stopTimer(): void {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  private emit(): void {
    const snap = this.snapshot();
    this.listeners.forEach((l) => l(snap));
  }
}

let instance: Tracker | null = null;

export function getTracker(): Tracker {
  if (!instance) instance = new SimulatedTracker();
  return instance;
}
