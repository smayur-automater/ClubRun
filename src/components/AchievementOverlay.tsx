"use client";
import { Medal, Trophy, Flame } from "lucide-react";
import type { Achievement } from "@/lib/types";

const ICONS = { badge: Medal, pr: Trophy, streak: Flame } as const;

/**
 * Achievement celebration (docs/DESIGN_SYSTEM.md §4). Always a Night Stage.
 * The icon sits inside a 2px signal *ring* (a spotlight, not an alert), which
 * draws in with the same stroke sweep as the ring/route reveals. Fires only
 * for badges, PRs, and streak milestones — never a routine run finish.
 */
export function AchievementOverlay({ achievement, onDismiss }: { achievement: Achievement; onDismiss: () => void }) {
  const Icon = ICONS[achievement.kind];
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={achievement.title}
      className="stage fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 px-8"
      style={{ background: "#0a0b0e" }}
    >
      <div className="overlay-enter flex flex-col items-center gap-8 w-full max-w-xs">
        <div className="relative flex items-center justify-center" style={{ width: 108, height: 108 }}>
          <svg width={108} height={108} className="absolute inset-0 -rotate-90" aria-hidden>
            <circle
              className="overlay-ring"
              cx={54}
              cy={54}
              r={52}
              pathLength={1000}
              strokeDasharray={1000}
              style={{ "--route-len": 1000 } as React.CSSProperties}
            />
          </svg>
          <Icon size={56} strokeWidth={1.6} style={{ color: "var(--signal)" }} />
        </div>
        <div className="text-center">
          <p className="stat-label">Unlocked</p>
          <h2 className="stat-value text-2xl mt-2" style={{ letterSpacing: "-0.02em" }}>{achievement.title}</h2>
          <p className="text-sm mt-2" style={{ color: "var(--muted)" }}>{achievement.line}</p>
        </div>
        <button type="button" className="btn-primary w-full" onClick={onDismiss}>
          Nice.
        </button>
      </div>
    </div>
  );
}
