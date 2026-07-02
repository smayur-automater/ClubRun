/**
 * Auth seam — shaped like Supabase Auth so the M3 swap is mechanical:
 * replace the localStorage mock inside these functions with
 * `supabase.auth.signInWithPassword(...)` etc. and no screen changes.
 * Validation lives here (the boundary), not in components.
 */

export interface Session {
  email: string;
  name: string;
}

export interface AuthResult {
  session: Session | null;
  error: string | null;
}

const SESSION_KEY = "cr.session";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Mock network latency so loading states are real, not decorative. */
function delay(ms = 600): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export function getSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export async function signInWithPassword(input: { email: string; password: string }): Promise<AuthResult> {
  const email = input.email.trim().toLowerCase();
  if (!EMAIL_RE.test(email)) return { session: null, error: "Enter a valid email address." };
  if (input.password.length < 8) return { session: null, error: "Password must be at least 8 characters." };
  await delay();
  const session: Session = { email, name: email.split("@")[0] };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { session, error: null };
}

export async function signUp(input: { name: string; email: string; password: string }): Promise<AuthResult> {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  if (name.length < 2) return { session: null, error: "Tell us your name — your crew will see it." };
  if (!EMAIL_RE.test(email)) return { session: null, error: "Enter a valid email address." };
  if (input.password.length < 8) return { session: null, error: "Password must be at least 8 characters." };
  await delay();
  const session: Session = { email, name };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { session, error: null };
}

/** OAuth placeholder — becomes `supabase.auth.signInWithOAuth({ provider })` at M3. */
export async function signInWithProvider(provider: "apple" | "google"): Promise<AuthResult> {
  await delay(400);
  const session: Session = { email: `runner@${provider}.example`, name: "Alex Rivera" };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { session, error: null };
}

/** Password reset placeholder — becomes `supabase.auth.resetPasswordForEmail` + email service at M3. */
export async function requestPasswordReset(email: string): Promise<{ error: string | null }> {
  if (!EMAIL_RE.test(email.trim().toLowerCase())) return { error: "Enter a valid email address first." };
  await delay(400);
  return { error: null };
}

export function signOut(): void {
  localStorage.removeItem(SESSION_KEY);
}
