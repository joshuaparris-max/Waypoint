"use client"
import React, { useEffect, useState } from "react";

const STORAGE_KEY = "av_companion:onsite-checklist";

type Step = { id: string; label: string; note?: string };

const darkBg = "bg-[#0A1628] text-slate-100";
const cyan = "text-[#00C2FF]";

const defaultData = {
  completed: {} as Record<string, boolean>,
  reflections: "",
};

const PHASES: { title: string; steps: Step[] }[] = [
  {
    title: "Before Leaving Office (Pre-Check)",
    steps: [
      { id: "box_present", label: "Confirm all hardware components present (box, screen, 2x power cables, screen cable)" },
      { id: "myer_induction", label: "If Myer store: complete 10-minute Myer Induction" },
      { id: "review_playbooks", label: "Review relevant issue playbooks (Printer, Networking, Hardware)" },
      { id: "check_tools", label: "Check physical tools and cable inventory" },
    ],
  },
  {
    title: "Onsite Execution",
    steps: [
      { id: "log_arrival", label: "Log arrival status in HaloPSA" },
      { id: "call_vendor", label: "Call vendor support for POS passwords/PINs (03 9095 7979)" },
      { id: "imaging_install", label: "Complete device imaging, hardware install, and cable runs" },
      { id: "exception_scope", label: "Record any 'Exception' work outside replacement scope for invoicing" },
      { id: "obtain_signoff", label: "Obtain user sign-off/confirmation" },
    ],
  },
  {
    title: "After Visit (Closure)",
    steps: [
      { id: "note_template", label: "Use Note Template Generator to create structured notes for HaloPSA" },
      { id: "3cx_away", label: "Set 3CX to Away (did you set 3CX to Away?)" },
      { id: "update_ticket", label: "Update ticket status: Resolved or Awaiting Follow-up" },
    ],
  },
];

export default function OnsiteChecklist() {
  const [data, setData] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : defaultData;
    } catch (e) {
      return defaultData;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const toggle = (id: string) => {
    setData((d: any) => ({ ...d, completed: { ...(d.completed || {}), [id]: !d.completed?.[id] } }));
  };

  const setReflection = (v: string) => setData((d: any) => ({ ...d, reflections: v }));

  const reset = () => {
    if (!confirm("Reset checklist progress?")) return;
    setData(defaultData as any);
  };

  const openNoteGenerator = () => {
    alert("Open Note Template Generator (placeholder)");
  };

  const open3CX = () => {
    alert("3CX Reminder: set status to Away (placeholder)");
  };

  return (
    <div className={`p-4 rounded-lg ${darkBg} shadow`}>
      <div className="flex items-center justify-between mb-3">
        <h2 className={`text-lg font-semibold ${cyan}`}>Onsite Checklist</h2>
        <div className="flex gap-2">
          <button onClick={reset} className="text-sm px-2 py-1 bg-slate-700 rounded">Reset</button>
        </div>
      </div>

      <div className="space-y-4">
        {PHASES.map((phase) => (
          <section key={phase.title} className="border border-slate-700 rounded p-3">
            <h3 className="text-sm font-semibold mb-2">{phase.title}</h3>
            <ul className="space-y-2">
              {phase.steps.map((s) => (
                <li key={s.id} className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={!!data.completed?.[s.id]}
                    onChange={() => toggle(s.id)}
                    className="mt-1 h-4 w-4 accent-cyan-400"
                    aria-label={s.label}
                  />
                  <div className="text-sm leading-tight">{s.label}</div>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <section className="border border-slate-700 rounded p-3">
          <h3 className="text-sm font-semibold mb-2">Reflections / Notes (local only)</h3>
          <textarea
            className="w-full min-h-[80px] p-2 rounded bg-slate-900 text-sm"
            value={data.reflections || ""}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="Write brief, local-only visit notes and follow-ups"
            aria-label="Onsite reflections"
          />
          <div className="flex gap-2 mt-2">
            <button onClick={openNoteGenerator} className="px-3 py-1 rounded bg-[#022636] text-[#00C2FF] text-sm">Note Template</button>
            <button onClick={open3CX} className="px-3 py-1 rounded bg-[#022636] text-[#00C2FF] text-sm">3CX Reminder</button>
          </div>
        </section>
      </div>
    </div>
  );
}
