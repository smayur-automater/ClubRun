"use client";
import { useState } from "react";
import { Search, ChevronDown, ChevronUp, Mail, Phone } from "lucide-react";
import BottomNav from "@/components/BottomNav";

const members = [
  { id: 1, name: "Sarah Chen", pacePB: "4:58/km", runsAttended: 31, joined: "Jan 2025", phone: "0412 345 678", email: "sarah@example.com", emergency: "David Chen — 0411 222 333", pbs: { "5km": "22:14", "10km": "47:32", "Half": "1:48:55" } },
  { id: 2, name: "Marcus Torres", pacePB: "4:30/km", runsAttended: 44, joined: "Mar 2024", phone: "0423 456 789", email: "marcus@example.com", emergency: "Elena Torres — 0422 111 444", pbs: { "5km": "19:45", "10km": "42:10", "Half": "1:32:20" } },
  { id: 3, name: "Tom Williams", pacePB: "5:10/km", runsAttended: 18, joined: "Jun 2025", phone: "0434 567 890", email: "tom@example.com", emergency: "Grace Williams — 0433 555 666", pbs: { "5km": "24:30", "10km": "52:00" } },
  { id: 4, name: "Jess Nguyen", pacePB: "5:00/km", runsAttended: 27, joined: "Feb 2025", phone: "0445 678 901", email: "jess@example.com", emergency: "Huy Nguyen — 0444 777 888", pbs: { "5km": "23:05", "10km": "49:00", "Half": "1:52:00" } },
  { id: 5, name: "Amy Watson", pacePB: "6:10/km", runsAttended: 12, joined: "Sep 2025", phone: "0456 789 012", email: "amy@example.com", emergency: "Ben Watson — 0455 999 000", pbs: { "5km": "28:00" } },
  { id: 6, name: "James Kim", pacePB: "4:25/km", runsAttended: 52, joined: "Nov 2023", phone: "0467 890 123", email: "james@example.com", emergency: "Min Kim — 0466 123 456", pbs: { "5km": "18:55", "10km": "40:15", "Half": "1:28:40", "Marathon": "3:08:00" } },
];

export default function MembersPage() {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered = members.filter(m =>
    m.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="page-wrapper" style={{ background: "var(--surface)" }}>
      <header className="px-4 py-4 sticky top-0 z-30 border-b" style={{ background: "var(--navy)", borderColor: "var(--navy-light)" }}>
        <h1 className="font-black text-white text-xl mb-3">Members</h1>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.4)" }} />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search members..."
            className="w-full rounded-xl pl-9 pr-4 py-2.5 text-sm font-medium"
            style={{ background: "rgba(255,255,255,0.1)", color: "white", border: "1px solid rgba(255,255,255,0.15)" }}
          />
        </div>
      </header>

      <div className="px-4 py-4 max-w-lg mx-auto">
        <p className="text-xs mb-4 px-1" style={{ color: "var(--muted)" }}>{filtered.length} members</p>
        <div className="space-y-2">
          {filtered.map(member => {
            const isOpen = expanded === member.id;
            return (
              <div key={member.id} className="card overflow-hidden">
                <button
                  onClick={() => setExpanded(isOpen ? null : member.id)}
                  className="w-full flex items-center gap-3 text-left"
                >
                  <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-black flex-shrink-0" style={{ background: "var(--navy)" }}>
                    {member.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm" style={{ color: "var(--navy)" }}>{member.name}</div>
                    <div className="text-xs" style={{ color: "var(--muted)" }}>
                      PB {member.pacePB} · {member.runsAttended} runs · Joined {member.joined}
                    </div>
                  </div>
                  {isOpen ? <ChevronUp size={16} style={{ color: "var(--muted)", flexShrink: 0 }} /> : <ChevronDown size={16} style={{ color: "var(--muted)", flexShrink: 0 }} />}
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

                    {/* Emergency Contact */}
                    <div className="rounded-xl p-3" style={{ background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.2)" }}>
                      <div className="text-xs font-bold mb-1" style={{ color: "#dc2626" }}>EMERGENCY CONTACT</div>
                      <div className="text-sm font-semibold" style={{ color: "var(--navy)" }}>{member.emergency}</div>
                    </div>

                    {/* Contact Actions */}
                    <div className="flex gap-2">
                      <a
                        href={`mailto:${member.email}`}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold border-2"
                        style={{ borderColor: "var(--navy)", color: "var(--navy)" }}
                      >
                        <Mail size={13} /> Send Message
                      </a>
                      <a
                        href={`tel:${member.phone}`}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold border-2"
                        style={{ borderColor: "var(--border)", color: "var(--muted)" }}
                      >
                        <Phone size={13} /> {member.phone}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
