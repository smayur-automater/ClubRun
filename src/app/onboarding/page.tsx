"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Footprints } from "lucide-react";
import type { Vibe } from "@/lib/types";

const PACES = [
  { label: "Chatty pace", detail: "You can hold a conversation", value: 420 },
  { label: "Steady", detail: "Comfortable but working", value: 360 },
  { label: "Pushing it", detail: "Racing yourself most runs", value: 300 },
  { label: "Fast", detail: "Sub-5:00 kilometres", value: 280 },
] as const;

const VIBES: { label: string; detail: string; value: Vibe }[] = [
  { label: "Social", detail: "Coffee after is the point", value: "social" },
  { label: "Training", detail: "Sessions with structure", value: "training" },
  { label: "Trail", detail: "Dirt over pavement", value: "trail" },
  { label: "Early bird", detail: "Done before sunrise", value: "early" },
];

const GOALS = [15, 25, 40, 60] as const;

/**
 * Three steps, one decision each — RSVP'd-to-first-run within 3 minutes
 * of install is the activation target (docs/USER_FLOWS.md flow 1).
 */
export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [pace, setPace] = useState<number | null>(null);
  const [vibe, setVibe] = useState<Vibe | null>(null);
  const [goal, setGoal] = useState<number | null>(null);

  const canContinue = [pace !== null, vibe !== null, goal !== null][step];

  const next = () => {
    if (step < 2) {
      setStep(step + 1);
      return;
    }
    localStorage.setItem("cr.onboarded", "1");
    localStorage.setItem("cr.prefs", JSON.stringify({ pace, vibe, goal }));
    router.replace("/explore");
  };

  return (
    <div className="min-h-dvh flex flex-col px-5 pt-8 pb-8">
      <header className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 font-black tracking-tight text-lg">
          <span
            className="flex items-center justify-center w-8 h-8 rounded-full"
            style={{ background: "var(--volt)", color: "var(--volt-ink)" }}
          >
            <Footprints size={17} strokeWidth={2.4} />
          </span>
          ClubRuns
        </span>
        <div className="flex gap-1.5" aria-label={`Step ${step + 1} of 3`}>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: i === step ? 24 : 8,
                background: i <= step ? "var(--volt)" : "var(--surface-2)",
              }}
            />
          ))}
        </div>
      </header>

      <main className="flex-1 flex flex-col justify-center gap-6">
        {step === 0 && (
          <>
            <div>
              <h1 className="text-3xl font-black tracking-tight leading-tight">How do you run?</h1>
              <p className="mt-2" style={{ color: "var(--muted)" }}>
                No numbers needed — we&apos;ll match you with groups at your pace.
              </p>
            </div>
            <div className="flex flex-col gap-2.5">
              {PACES.map((p) => (
                <OptionRow key={p.value} label={p.label} detail={p.detail} selected={pace === p.value} onSelect={() => setPace(p.value)} />
              ))}
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div>
              <h1 className="text-3xl font-black tracking-tight leading-tight">What&apos;s your vibe?</h1>
              <p className="mt-2" style={{ color: "var(--muted)" }}>
                Clubs have personalities. Pick the one that sounds like yours.
              </p>
            </div>
            <div className="flex flex-col gap-2.5">
              {VIBES.map((v) => (
                <OptionRow key={v.value} label={v.label} detail={v.detail} selected={vibe === v.value} onSelect={() => setVibe(v.value)} />
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div>
              <h1 className="text-3xl font-black tracking-tight leading-tight">Weekly kilometres?</h1>
              <p className="mt-2" style={{ color: "var(--muted)" }}>
                Your goal ring lives on Home. You can change it anytime.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {GOALS.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGoal(g)}
                  className="card flex flex-col items-center py-6 transition-colors"
                  style={goal === g ? { borderColor: "var(--volt)", background: "color-mix(in srgb, var(--volt) 8%, var(--surface))" } : undefined}
                >
                  <span className="stat-value text-3xl">{g}</span>
                  <span className="stat-label mt-1.5">km / week</span>
                </button>
              ))}
            </div>
          </>
        )}
      </main>

      <button type="button" className="btn-volt w-full" disabled={!canContinue} onClick={next}>
        {step === 2 ? "Find my crew" : "Continue"} <ArrowRight size={17} strokeWidth={2.5} />
      </button>
    </div>
  );
}

function OptionRow({ label, detail, selected, onSelect }: { label: string; detail: string; selected: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className="card flex items-center justify-between text-left transition-colors"
      style={selected ? { borderColor: "var(--volt)", background: "color-mix(in srgb, var(--volt) 8%, var(--surface))" } : undefined}
    >
      <span>
        <span className="block font-extrabold tracking-tight">{label}</span>
        <span className="block text-sm mt-0.5" style={{ color: "var(--muted)" }}>{detail}</span>
      </span>
      <span
        className="w-5 h-5 rounded-full border-2 shrink-0 transition-colors"
        style={selected ? { borderColor: "var(--volt)", background: "var(--volt)" } : { borderColor: "var(--border)" }}
      />
    </button>
  );
}
