"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";

interface PaceGroup {
  id: number;
  label: string;
  minPace: string;
  maxPace: string;
  leader: string;
}

export default function CreateRunPage() {
  const [title, setTitle] = useState("Tuesday Morning Run");
  const [date, setDate] = useState("2026-06-10");
  const [time, setTime] = useState("05:30");
  const [meetingPoint, setMeetingPoint] = useState("Centennial Park, Gate 5");
  const [mapsLink, setMapsLink] = useState("");
  const [distance, setDistance] = useState("10");
  const [routeLink, setRouteLink] = useState("");
  const [notes, setNotes] = useState("");
  const [paceGroups, setPaceGroups] = useState<PaceGroup[]>([
    { id: 1, label: "Fast Group", minPace: "4:30", maxPace: "4:59", leader: "James K." },
    { id: 2, label: "Steady Group", minPace: "5:00", maxPace: "5:29", leader: "Marcus T." },
    { id: 3, label: "Social Group", minPace: "5:30", maxPace: "6:00", leader: "Lisa R." },
  ]);

  const addPaceGroup = () => {
    setPaceGroups(prev => [...prev, { id: Date.now(), label: "", minPace: "", maxPace: "", leader: "" }]);
  };

  const removePaceGroup = (id: number) => {
    setPaceGroups(prev => prev.filter(g => g.id !== id));
  };

  const updateGroup = (id: number, field: keyof PaceGroup, value: string) => {
    setPaceGroups(prev => prev.map(g => g.id === id ? { ...g, [field]: value } : g));
  };

  return (
    <div className="min-h-screen pb-12" style={{ background: "var(--surface)" }}>
      {/* Header */}
      <header className="px-4 py-4 flex items-center gap-3 sticky top-0 z-30 border-b" style={{ background: "var(--navy)", borderColor: "var(--navy-light)" }}>
        <Link href="/dashboard" className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.1)" }}>
          <ArrowLeft size={18} className="text-white" />
        </Link>
        <h1 className="font-bold text-white flex-1">Create Run</h1>
        <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white" style={{ background: "var(--orange)", minHeight: "40px" }}>
          <Save size={14} /> Save
        </button>
      </header>

      <div className="px-4 py-5 max-w-lg mx-auto space-y-5">
        {/* Basic Details */}
        <div className="card space-y-4">
          <h2 className="font-bold" style={{ color: "var(--navy)" }}>Run Details</h2>

          <div>
            <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--muted)" }}>RUN TITLE</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Tuesday Morning Run"
              className="w-full rounded-xl px-4 py-3 text-sm font-semibold border focus:outline-none focus:ring-2 transition-shadow"
              style={{ borderColor: "var(--border)", background: "var(--background)", color: "var(--navy)" }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--muted)" }}>DATE</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-sm font-semibold border focus:outline-none"
                style={{ borderColor: "var(--border)", background: "var(--background)", color: "var(--navy)" }}
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--muted)" }}>TIME</label>
              <input
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-sm font-semibold border focus:outline-none"
                style={{ borderColor: "var(--border)", background: "var(--background)", color: "var(--navy)" }}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--muted)" }}>MEETING POINT</label>
            <input
              type="text"
              value={meetingPoint}
              onChange={e => setMeetingPoint(e.target.value)}
              placeholder="e.g. Centennial Park, Gate 5"
              className="w-full rounded-xl px-4 py-3 text-sm font-semibold border focus:outline-none"
              style={{ borderColor: "var(--border)", background: "var(--background)", color: "var(--navy)" }}
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--muted)" }}>GOOGLE MAPS LINK (optional)</label>
            <input
              type="url"
              value={mapsLink}
              onChange={e => setMapsLink(e.target.value)}
              placeholder="https://maps.google.com/..."
              className="w-full rounded-xl px-4 py-3 text-sm border focus:outline-none"
              style={{ borderColor: "var(--border)", background: "var(--background)", color: "var(--navy)" }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--muted)" }}>DISTANCE (km)</label>
              <input
                type="number"
                value={distance}
                onChange={e => setDistance(e.target.value)}
                placeholder="10"
                className="w-full rounded-xl px-4 py-3 text-sm font-semibold border focus:outline-none"
                style={{ borderColor: "var(--border)", background: "var(--background)", color: "var(--navy)" }}
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--muted)" }}>ROUTE LINK</label>
              <input
                type="url"
                value={routeLink}
                onChange={e => setRouteLink(e.target.value)}
                placeholder="Strava / Garmin URL"
                className="w-full rounded-xl px-4 py-3 text-sm border focus:outline-none"
                style={{ borderColor: "var(--border)", background: "var(--background)", color: "var(--navy)" }}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--muted)" }}>NOTES (optional)</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Any extra info for runners..."
              rows={3}
              className="w-full rounded-xl px-4 py-3 text-sm border focus:outline-none resize-none"
              style={{ borderColor: "var(--border)", background: "var(--background)", color: "var(--navy)" }}
            />
          </div>
        </div>

        {/* Pace Groups */}
        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold" style={{ color: "var(--navy)" }}>Pace Groups</h2>
            <button onClick={addPaceGroup} className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg" style={{ background: "rgba(249,115,22,0.1)", color: "var(--orange)" }}>
              <Plus size={12} /> Add Group
            </button>
          </div>

          <div className="space-y-4">
            {paceGroups.map((group, i) => (
              <div key={group.id} className="rounded-xl p-3 border" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold" style={{ color: "var(--muted)" }}>GROUP {i + 1}</span>
                  <button onClick={() => removePaceGroup(group.id)} className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "rgba(220,38,38,0.1)", color: "#dc2626" }}>
                    <Trash2 size={12} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="col-span-2">
                    <input
                      type="text"
                      value={group.label}
                      onChange={e => updateGroup(group.id, "label", e.target.value)}
                      placeholder="Group name (e.g. Fast Group)"
                      className="w-full rounded-lg px-3 py-2.5 text-sm border focus:outline-none"
                      style={{ borderColor: "var(--border)", background: "var(--background)", color: "var(--navy)" }}
                    />
                  </div>
                  <input
                    type="text"
                    value={group.minPace}
                    onChange={e => updateGroup(group.id, "minPace", e.target.value)}
                    placeholder="Min pace (4:30)"
                    className="rounded-lg px-3 py-2.5 text-sm border focus:outline-none"
                    style={{ borderColor: "var(--border)", background: "var(--background)", color: "var(--navy)" }}
                  />
                  <input
                    type="text"
                    value={group.maxPace}
                    onChange={e => updateGroup(group.id, "maxPace", e.target.value)}
                    placeholder="Max pace (4:59)"
                    className="rounded-lg px-3 py-2.5 text-sm border focus:outline-none"
                    style={{ borderColor: "var(--border)", background: "var(--background)", color: "var(--navy)" }}
                  />
                  <div className="col-span-2">
                    <input
                      type="text"
                      value={group.leader}
                      onChange={e => updateGroup(group.id, "leader", e.target.value)}
                      placeholder="Leader name"
                      className="w-full rounded-lg px-3 py-2.5 text-sm border focus:outline-none"
                      style={{ borderColor: "var(--border)", background: "var(--background)", color: "var(--navy)" }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save as Template */}
        <label className="card flex items-center gap-3 cursor-pointer">
          <input type="checkbox" className="w-5 h-5 rounded accent-orange-500" />
          <div>
            <div className="font-semibold text-sm" style={{ color: "var(--navy)" }}>Save as weekly template</div>
            <div className="text-xs" style={{ color: "var(--muted)" }}>Pre-fill these details for future runs</div>
          </div>
        </label>

        {/* Save Button */}
        <button className="btn-primary w-full justify-center text-lg" style={{ minHeight: "52px" }}>
          <Save size={18} /> Save Run
        </button>
      </div>
    </div>
  );
}
