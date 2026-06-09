"use client";
import { useState } from "react";
import { Search, ChevronDown, ChevronUp, Mail, Phone, UserPlus } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useToast } from "@/components/ToastProvider";
import Link from "next/link";

const members = [
  { id: 1, name: "Sarah Chen",    pacePB: "4:58/km", runsAttended: 31, joined: "Jan 2025", phone: "0412 345 678", email: "sarah@example.com",  emergency: "David Chen — 0411 222 333",   pbs: { "5km":"22:14",   "10km":"47:32",  "Half":"1:48:55"            } },
  { id: 2, name: "Marcus Torres", pacePB: "4:30/km", runsAttended: 44, joined: "Mar 2024", phone: "0423 456 789", email: "marcus@example.com", emergency: "Elena Torres — 0422 111 444", pbs: { "5km":"19:45",   "10km":"42:10",  "Half":"1:32:20"            } },
  { id: 3, name: "Tom Williams",  pacePB: "5:10/km", runsAttended: 18, joined: "Jun 2025", phone: "0434 567 890", email: "tom@example.com",    emergency: "Grace Williams — 0433 555 666", pbs: { "5km":"24:30", "10km":"52:00"                                } },
  { id: 4, name: "Jess Nguyen",   pacePB: "5:00/km", runsAttended: 27, joined: "Feb 2025", phone: "0445 678 901", email: "jess@example.com",   emergency: "Huy Nguyen — 0444 777 888",   pbs: { "5km":"23:05",   "10km":"49:00",  "Half":"1:52:00"            } },
  { id: 5, name: "Amy Watson",    pacePB: "6:10/km", runsAttended: 12, joined: "Sep 2025", phone: "0456 789 012", email: "amy@example.com",    emergency: "Ben Watson — 0455 999 000",   pbs: { "5km":"28:00"                                                  } },
  { id: 6, name: "James Kim",     pacePB: "4:25/km", runsAttended: 52, joined: "Nov 2023", phone: "0467 890 123", email: "james@example.com",  emergency: "Min Kim — 0466 123 456",      pbs: { "5km":"18:55",   "10km":"40:15",  "Half":"1:28:40", "Marathon":"3:08:00" } },
];

const avatarColors = ["#7c3aed","var(--orange)","#0891b2","#16a34a","#dc2626","#0f172a"];

export default function MembersPage() {
  const [query,    setQuery]    = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);
  const { toast } = useToast();

  const filtered = members.filter(m =>
    m.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="page-wrapper" style={{ background: "var(--surface)" }}>
      {/* Header */}
      <header className="px-4 py-4 sticky top-0 z-30 border-b" style={{ background: "var(--navy)", borderColor: "var(--navy-light)", viewTransitionName: "app-header" }}>
        <div className="flex items-center justify-between mb-3">
          <h1 className="font-black text-white text-xl">Members</h1>
          <Link
            href="/invite"
            transitionTypes={["nav-forward"]}
            className="flex items-center gap-1.5 text-xs font-bold px-4 rounded-xl"
            style={{ background: "var(--orange)", color: "white", minHeight: "44px", textDecoration: "none" }}
          >
            <UserPlus size={13} /> Invite
          </Link>
        </div>
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.4)" }} />
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search members…"
            className="w-full rounded-xl pl-9 pr-4 py-2.5 text-sm font-medium"
            style={{ background: "rgba(255,255,255,0.1)", color: "white", border: "1px solid rgba(255,255,255,0.15)", outline: "none" }}
          />
        </div>
      </header>

      <div className="px-4 py-4 max-w-lg mx-auto">
        <p className="text-xs mb-3 px-1" style={{ color: "var(--muted)" }}>
          {filtered.length} of {members.length} members{query ? ` matching "${query}"` : ""}
        </p>

        <div className="space-y-2">
          {filtered.map((member, idx) => {
            const isOpen = expanded === member.id;
            return (
              <div key={member.id} className="card overflow-hidden transition-all">
                <button
                  onClick={() => setExpanded(isOpen ? null : member.id)}
                  className="w-full flex items-center gap-3 text-left"
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                >
                  <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-black text-sm flex-shrink-0" style={{ background: avatarColors[idx % avatarColors.length] }}>
                    {member.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="font-bold text-sm" style={{ color: "var(--navy)" }}>{member.name}</div>
                    <div className="text-xs" style={{ color: "var(--muted)" }}>
                      PB {member.pacePB} · {member.runsAttended} runs · Joined {member.joined}
                    </div>
                  </div>
                  {isOpen
                    ? <ChevronUp   size={16} style={{ color: "var(--muted)", flexShrink: 0 }} />
                    : <ChevronDown size={16} style={{ color: "var(--muted)", flexShrink: 0 }} />
                  }
                </button>

                {isOpen && (
                  <div className="mt-4 pt-4 border-t space-y-3" style={{ borderColor: "var(--border)" }}>
                    {/* PBs */}
                    <div>
                      <div className="text-xs font-bold mb-2" style={{ color: "var(--muted)" }}>PERSONAL BESTS</div>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(member.pbs).map(([dist, time]) => (
                          <div key={dist} className="flex justify-between items-center px-3 py-2 rounded-lg" style={{ background: "var(--surface)" }}>
                            <span className="text-xs" style={{ color: "var(--muted)" }}>{dist}</span>
                            <span className="text-xs font-black" style={{ color: "var(--navy)" }}>{time}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Emergency */}
                    <div className="rounded-xl p-3" style={{ background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.18)" }}>
                      <div className="text-xs font-bold mb-1" style={{ color: "#dc2626" }}>EMERGENCY CONTACT</div>
                      <div className="text-sm font-semibold" style={{ color: "var(--navy)" }}>{member.emergency}</div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <a
                        href={`mailto:${member.email}`}
                        onClick={() => toast(`Opening email to ${member.name}`, "info")}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl text-xs font-bold border-2"
                        style={{ borderColor: "var(--navy)", color: "var(--navy)", minHeight: "44px", textDecoration: "none" }}
                      >
                        <Mail size={13} /> Message
                      </a>
                      <a
                        href={`tel:${member.phone}`}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl text-xs font-bold border-2"
                        style={{ borderColor: "var(--border)", color: "var(--muted)", minHeight: "44px", textDecoration: "none" }}
                      >
                        <Phone size={13} /> {member.phone}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-12" style={{ color: "var(--muted)" }}>
              <Search size={32} className="mx-auto mb-3 opacity-30" />
              <p className="font-semibold">No members match &quot;{query}&quot;</p>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
