import Link from "next/link";
import { CheckCircle, Users, Bell, MapPin, BarChart3, Shield, Zap, Star, Calendar } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b" style={{ background: "var(--navy)", borderColor: "var(--navy-light)" }}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-white text-sm" style={{ background: "var(--orange)" }}>CR</div>
            <span className="font-bold text-white text-lg">ClubRun</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/member" className="text-sm font-medium hidden sm:block" style={{ color: "rgba(255,255,255,0.8)" }}>Sign In</Link>
            <Link href="/dashboard" className="btn-primary text-sm">Start Free Trial</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={{ background: "var(--navy)" }} className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "radial-gradient(circle at 30% 50%, #f97316 0%, transparent 60%), radial-gradient(circle at 80% 20%, #3b82f6 0%, transparent 50%)"
        }} />
        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6" style={{ background: "rgba(249,115,22,0.2)", border: "1px solid rgba(249,115,22,0.4)", color: "rgba(255,255,255,0.9)" }}>
              🇦🇺 Built for Australian running clubs
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
              Your running club deserves better than a{" "}
              <span style={{ color: "var(--orange)" }}>WhatsApp group</span>
            </h1>
            <p className="text-xl mb-10 max-w-2xl mx-auto leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
              Manage runs, pace groups, RSVPs, and members — all in one place. Free for members. A$19/month for your club.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard" className="btn-primary text-lg" style={{ padding: "1rem 2rem", minHeight: "52px" }}>
                Start Free Trial
              </Link>
              <a href="#how-it-works" className="btn-outline-white text-lg" style={{ padding: "1rem 2rem", minHeight: "52px" }}>
                See How It Works
              </a>
            </div>
          </div>

          {/* Mock Phone */}
          <div className="mt-16 flex justify-center">
            <div className="w-64 rounded-3xl overflow-hidden shadow-2xl" style={{ border: "4px solid var(--navy-light)", background: "var(--navy-dark)" }}>
              <div className="p-4">
                <div className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.5)" }}>Good morning Sarah 👋</div>
                <div className="text-white font-bold text-sm mb-3">Next run is Tuesday 5:30am</div>
                <div className="rounded-xl p-3 mb-3" style={{ background: "var(--navy-light)" }}>
                  <div className="font-bold text-sm mb-1" style={{ color: "var(--orange)" }}>Tuesday Morning Run</div>
                  <div className="text-xs mb-0.5" style={{ color: "rgba(255,255,255,0.7)" }}>📍 Centennial Park Gate 5</div>
                  <div className="text-xs mb-3" style={{ color: "rgba(255,255,255,0.6)" }}>Tom, Sarah, Mike + 11 others</div>
                  <div className="rounded-lg py-2 text-center text-xs font-bold text-white" style={{ background: "#16a34a" }}>✓ I&apos;m Coming</div>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 rounded-lg p-2 text-center" style={{ background: "rgba(249,115,22,0.2)" }}>
                    <div className="font-bold text-lg" style={{ color: "var(--orange)" }}>14</div>
                    <div className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>Going</div>
                  </div>
                  <div className="flex-1 rounded-lg p-2 text-center" style={{ background: "rgba(249,115,22,0.2)" }}>
                    <div className="font-bold text-lg" style={{ color: "var(--orange)" }}>4</div>
                    <div className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>Pace groups</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="border-y py-4" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-sm font-semibold" style={{ color: "var(--navy)" }}>
            <span className="flex items-center gap-2"><CheckCircle size={16} style={{ color: "var(--orange)" }} /> Built for Australian running clubs</span>
            <span className="flex items-center gap-2"><Zap size={16} style={{ color: "var(--orange)" }} /> Free 30-day trial</span>
            <span className="flex items-center gap-2"><Users size={16} style={{ color: "var(--orange)" }} /> Members always free</span>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-4" style={{ color: "var(--navy)" }}>Up and running in 3 steps</h2>
          <p className="text-center mb-14 text-sm" style={{ color: "var(--muted)" }}>No IT degree required</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Create your club", desc: "Sign up, name your club, and invite members — takes about 30 seconds. Share a link and they join free.", icon: Users },
              { step: "02", title: "Post your weekly runs", desc: "Add run details, set up pace groups with leaders, drop a Maps pin for the meeting point.", icon: MapPin },
              { step: "03", title: "Members RSVP and show up", desc: "Members tap once to RSVP, pick their pace group, get a reminder the night before. See you at 5:30am.", icon: Bell },
            ].map(({ step, title, desc, icon: Icon }) => (
              <div key={step} className="card text-center relative pt-8">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black" style={{ background: "var(--orange)" }}>{step}</div>
                <div className="mb-4 flex justify-center">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "rgba(249,115,22,0.1)" }}>
                    <Icon size={28} style={{ color: "var(--orange)" }} />
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-2" style={{ color: "var(--navy)" }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4" style={{ background: "var(--surface)" }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-4" style={{ color: "var(--navy)" }}>Everything your club needs</h2>
          <p className="text-center mb-14 text-sm" style={{ color: "var(--muted)" }}>Designed for runners, by runners</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Calendar, title: "Weekly Run Scheduling", desc: "Post runs with one-tap templates. Date, time, meeting point, route — done in 60 seconds." },
              { icon: Users, title: "Pace Group Management", desc: "Create multiple pace groups per run with leaders. Members self-select — no more herding cats." },
              { icon: CheckCircle, title: "RSVP + Who's Coming", desc: "Real-time RSVP list so organisers know exactly how many to expect in each group." },
              { icon: Bell, title: "24-Hour Reminders", desc: "Automatic reminders sent the evening before. No more no-shows who forgot." },
              { icon: BarChart3, title: "Attendance Tracking", desc: "Track who attends, build streaks, celebrate milestones. Keep your community engaged." },
              { icon: Shield, title: "Emergency Contacts", desc: "Store member emergency contacts securely. Important for those long trail runs." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(26,46,74,0.08)" }}>
                  <Icon size={22} style={{ color: "var(--navy)" }} />
                </div>
                <div>
                  <h3 className="font-bold mb-1" style={{ color: "var(--navy)" }}>{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-4" style={{ color: "var(--navy)" }}>Simple, honest pricing</h2>
          <p className="text-center mb-4 font-semibold" style={{ color: "var(--orange)" }}>Every member uses ClubRun free. Only the organiser pays.</p>
          <p className="text-center mb-14 text-sm" style={{ color: "var(--muted)" }}>No credit card required to start</p>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="card border-2" style={{ borderColor: "var(--border)" }}>
              <div className="badge mb-4 text-xs" style={{ background: "var(--surface)", color: "var(--muted)" }}>Free Forever</div>
              <div className="text-4xl font-black mb-1" style={{ color: "var(--navy)" }}>A$0</div>
              <div className="text-sm mb-6" style={{ color: "var(--muted)" }}>Perfect to try</div>
              <ul className="space-y-3 mb-8">
                {["Up to 15 members", "2 runs per month", "All core features", "Members always free"].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle size={16} className="flex-shrink-0" style={{ color: "var(--orange)" }} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href="/dashboard" className="btn-secondary" style={{ width: "100%", justifyContent: "center" }}>Start Free</Link>
            </div>
            <div className="card border-2 relative" style={{ borderColor: "var(--orange)", background: "var(--navy)" }}>
              <div className="badge mb-4 text-white text-xs" style={{ background: "var(--orange)" }}>
                <Star size={12} style={{ marginRight: "4px" }} /> Most Popular
              </div>
              <div className="text-4xl font-black mb-1 text-white">A$19<span className="text-lg font-normal" style={{ color: "rgba(255,255,255,0.6)" }}>/month</span></div>
              <div className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.6)" }}>For serious clubs</div>
              <ul className="space-y-3 mb-8">
                {["Unlimited members", "Unlimited runs", "Pace group management", "RSVP reminders", "Attendance analytics", "Emergency contacts", "Priority support"].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle size={16} className="flex-shrink-0" style={{ color: "var(--orange)" }} />
                    <span style={{ color: "rgba(255,255,255,0.9)" }}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href="/dashboard" className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>Start 30-Day Trial</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-10 px-4" style={{ background: "var(--navy)", borderColor: "var(--navy-light)" }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-white text-xs" style={{ background: "var(--orange)" }}>CR</div>
            <span className="font-bold text-white">ClubRun</span>
          </div>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>© 2026 Xfiniti Technologies Pty Ltd</p>
          <div className="flex gap-6 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
            <a href="#" className="hover:text-white transition-colors py-3 inline-block">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors py-3 inline-block">Terms</a>
            <a href="#" className="hover:text-white transition-colors py-3 inline-block">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
