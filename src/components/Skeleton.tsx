export function Skeleton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={`skeleton ${className ?? ""}`} style={style} aria-hidden />;
}

export function DashboardSkeleton() {
  return (
    <div className="px-4 py-5 space-y-4 max-w-lg mx-auto" aria-label="Loading dashboard…">
      {/* Next run card skeleton */}
      <div className="card space-y-3">
        <Skeleton style={{ height: 14, width: "40%" }} />
        <Skeleton style={{ height: 24, width: "75%" }} />
        <Skeleton style={{ height: 14, width: "55%" }} />
        <div className="flex gap-3 pt-1">
          <Skeleton style={{ flex: 1, height: 64, borderRadius: "0.75rem" }} />
          <Skeleton style={{ flex: 1, height: 64, borderRadius: "0.75rem" }} />
          <Skeleton style={{ flex: 1, height: 64, borderRadius: "0.75rem" }} />
        </div>
        <Skeleton style={{ height: 80, borderRadius: "0.75rem" }} />
        <div className="flex gap-2">
          <Skeleton style={{ flex: 1, height: 44, borderRadius: "0.75rem" }} />
          <Skeleton style={{ flex: 1, height: 44, borderRadius: "0.75rem" }} />
          <Skeleton style={{ flex: 1, height: 44, borderRadius: "0.75rem" }} />
        </div>
      </div>
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[0,1,2].map(i => <Skeleton key={i} style={{ height: 80, borderRadius: "0.75rem" }} />)}
      </div>
      {/* Run list */}
      <Skeleton style={{ height: 18, width: "35%", marginBottom: 8 }} />
      {[0,1,2].map(i => (
        <Skeleton key={i} style={{ height: 68, borderRadius: "1rem", marginBottom: 8 }} />
      ))}
    </div>
  );
}
