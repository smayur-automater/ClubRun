"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Footprints, Loader2 } from "lucide-react";
import * as auth from "@/lib/auth";

type Mode = "signin" | "signup";

/**
 * Auth is a brand moment: the RouteMap grid texture behind a single focused
 * card. Mock-backed today; the seam in lib/auth.ts is Supabase-shaped so
 * real credentials/OAuth/email land without touching this screen.
 */
export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    setNotice(null);
    const result =
      mode === "signin"
        ? await auth.signInWithPassword({ email, password })
        : await auth.signUp({ name, email, password });
    setBusy(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    // New runners onboard; returning runners land home
    router.replace(mode === "signup" ? "/onboarding" : "/");
  };

  const oauth = async (provider: "apple" | "google") => {
    if (busy) return;
    setBusy(true);
    setError(null);
    await auth.signInWithProvider(provider);
    setBusy(false);
    router.replace("/");
  };

  const forgot = async () => {
    if (busy) return;
    setError(null);
    const { error: err } = await auth.requestPasswordReset(email);
    if (err) setError(err);
    else setNotice("If that address has an account, a reset link is on its way.");
  };

  return (
    <div className="min-h-dvh flex flex-col justify-center px-5 py-10 relative overflow-hidden">
      {/* Faint cartographic grid — the brand's surface, not decoration */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          opacity: 0.25,
          maskImage: "radial-gradient(ellipse 90% 60% at 50% 0%, black, transparent 75%)",
        }}
      />

      <div className="relative w-full max-w-sm mx-auto">
        <div className="flex flex-col items-center text-center mb-8">
          <span
            className="flex items-center justify-center w-12 h-12 rounded-full"
            style={{ background: "var(--pace)", color: "var(--pace-ink)" }}
          >
            <Footprints size={24} strokeWidth={2.4} />
          </span>
          <h1 className="text-2xl font-black tracking-tight mt-4">
            {mode === "signin" ? "Welcome back." : "Never run alone."}
          </h1>
          <p className="text-sm mt-1.5" style={{ color: "var(--muted)" }}>
            {mode === "signin" ? "Your crew kept your spot." : "Find your crew. Keep the streak."}
          </p>
        </div>

        <div className="card flex flex-col gap-3">
          <form onSubmit={submit} className="flex flex-col gap-3">
            {mode === "signup" && (
              <label className="flex flex-col gap-1.5">
                <span className="stat-label">Name</span>
                <input
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Rivera"
                />
              </label>
            )}
            <label className="flex flex-col gap-1.5">
              <span className="stat-label">Email</span>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="stat-label">Password</span>
              <input
                type="password"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="8+ characters"
              />
            </label>

            {error && (
              <p role="alert" className="text-sm font-semibold" style={{ color: "var(--signal-2)" }}>{error}</p>
            )}
            {notice && (
              <p role="status" className="text-sm font-semibold" style={{ color: "var(--pace)" }}>{notice}</p>
            )}

            <button type="submit" className="btn-primary w-full mt-1" disabled={busy}>
              {busy ? <Loader2 size={18} className="animate-spin" /> : mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>

          {mode === "signin" && (
            <button type="button" onClick={forgot} className="btn-tertiary self-center" disabled={busy}>
              Forgot password?
            </button>
          )}

          <div className="flex items-center gap-3 my-1" aria-hidden>
            <span className="flex-1 h-px" style={{ background: "var(--border)" }} />
            <span className="text-xs font-bold" style={{ color: "var(--muted)" }}>or</span>
            <span className="flex-1 h-px" style={{ background: "var(--border)" }} />
          </div>

          <button type="button" onClick={() => oauth("apple")} className="btn-secondary w-full" disabled={busy}>
             Continue with Apple
          </button>
          <button type="button" onClick={() => oauth("google")} className="btn-secondary w-full" disabled={busy}>
            Continue with Google
          </button>
        </div>

        <p className="text-center text-sm mt-6" style={{ color: "var(--muted)" }}>
          {mode === "signin" ? "New here?" : "Already have an account?"}{" "}
          <button
            type="button"
            className="font-bold"
            style={{ color: "var(--course)", minHeight: 44 }}
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setError(null);
              setNotice(null);
            }}
          >
            {mode === "signin" ? "Create an account" : "Sign in"}
          </button>
        </p>

        <p className="text-center text-xs mt-4" style={{ color: "var(--muted)" }}>
          By continuing you agree to our Terms and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
