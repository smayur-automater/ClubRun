interface Props {
  /** 0..1 */
  progress: number;
  size?: number;
  stroke?: number;
  children?: React.ReactNode;
}

/**
 * Weekly goal ring. The mount animation is pure CSS: the `ring-in` keyframe
 * starts from a full offset (--ring-c) and settles on the inline target
 * (600ms, see globals.css) — no client state needed.
 */
export function GoalRing({ progress, size = 148, stroke = 10, children }: Props) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(1, progress));
  const offset = c * (1 - clamped);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle className="ring-track" cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} fill="none" />
        <circle
          className={`ring-fill${clamped >= 1 ? " complete" : ""}`}
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ "--ring-c": c } as React.CSSProperties}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
    </div>
  );
}
