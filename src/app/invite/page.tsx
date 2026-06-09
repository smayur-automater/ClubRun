import Link from "next/link";
import { Bell, Users, CheckCircle } from "lucide-react";

export default function InvitePage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--navy)" }}>
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        {/* Club Logo */}
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center font-black text-white text-2xl mb-6 shadow-lg" style={{ background: "var(--orange)" }}>
          SS
        </div>

        <div className="text-sm font-semibold mb-2" style={{ color: "rgba(255,255,255,0.6)" }}>You&apos;ve been invited to join</div>
        <h1 className="text-4xl font-black text-white mb-3">Sydney Striders</h1>
        <p className="text-base mb-10 max-w-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
          ClubRun helps running clubs manage weekly runs, pace groups, and RSVPs — so you can focus on running.
        </p>

        {/* 3 Benefits */}
        <div className="w-full max-w-sm space-y-3 mb-10">
          {[
            { icon: Users, text: "See who's running before you commit" },
            { icon: CheckCircle, text: "Pick your pace group with one tap" },
            { icon: Bell, text: "Get reminders the night before" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-4 rounded-2xl px-5 py-4 text-left" style={{ background: "rgba(255,255,255,0.08)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(249,115,22,0.25)" }}>
                <Icon size={20} style={{ color: "var(--orange)" }} />
              </div>
              <span className="font-semibold text-white text-sm">{text}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link
          href="/member"
          className="btn-primary w-full max-w-sm justify-center text-lg"
          style={{ minHeight: "56px", fontSize: "1.0625rem" }}
        >
          Join Sydney Striders Free
        </Link>

        <p className="text-xs mt-4" style={{ color: "rgba(255,255,255,0.4)" }}>
          Free for members · No credit card · Takes 30 seconds
        </p>
      </div>

      {/* Footer */}
      <div className="py-6 text-center border-t" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="w-5 h-5 rounded flex items-center justify-center font-black text-white text-xs" style={{ background: "var(--orange)" }}>CR</div>
          <span className="text-sm font-bold text-white">ClubRun</span>
        </div>
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>© 2026 Xfiniti Technologies Pty Ltd</p>
      </div>
    </div>
  );
}
