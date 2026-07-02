"use client"
import React, { useState } from "react";

const STORAGE_KEY = "av_companion:security-triage";

const cyan = "text-[#00C2FF]";

type TriageRecord = { id: string; type: string; severity: string; note: string; timestamp: number };

function simpleSanitize(input: string) {
  // aggressive on-device sanitize to avoid storing PII
  return input
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[REDACTED_EMAIL]")
    .replace(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g, "[REDACTED_IP]")
    .replace(/https?:\/\/\S+/gi, "[REDACTED_URL]")
    .replace(/\b([A-Za-z0-9-]+\.(?:com|org|net|au|io|co))\b/gi, "[REDACTED_DOMAIN]");
}

export default function SecurityAlertTriage() {
  const [type, setType] = useState("anomalous");
  const [ticket, setTicket] = useState("");
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState<TriageRecord[] | null>(null);

  function save() {
    const sanitized = simpleSanitize(notes);
    const rec: TriageRecord = { id: String(Date.now()), type, severity: type === 'anomalous' ? 'High' : type === 'consent' ? 'Medium' : 'Medium/Low', note: sanitized, timestamp: Date.now() };
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      arr.unshift(rec);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
      setSaved(arr);
      setNotes("");
      setTicket("");
    } catch (e) { console.error(e); }
  }

  function loadSaved(){
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setSaved(raw? JSON.parse(raw): []);
    } catch(e){ setSaved([]); }
  }

  return (
    <div className="p-4 rounded bg-[#071526] text-slate-100">
      <div className="flex items-center justify-between mb-3">
        <h3 className={`text-md font-semibold ${cyan}`}>Security Alert Triage</h3>
        <button onClick={loadSaved} className="text-sm px-2 py-1 bg-slate-700 rounded">Load</button>
      </div>

      <div className="space-y-2">
        <label className="text-sm">Triage Path</label>
        <select className="w-full p-2 rounded bg-slate-900" value={type} onChange={(e)=>setType(e.target.value)}>
          <option value="anomalous">High - Anomalous Foreign Access</option>
          <option value="consent">Medium - User Consent to Application</option>
          <option value="admin_change">Medium/Low - Administrator Security Change</option>
        </select>

        <label className="text-sm">Ticket ID or Reference (no client PII)</label>
        <input className="w-full p-2 rounded bg-slate-900" value={ticket} onChange={(e)=>setTicket(e.target.value)} placeholder="Ticket ID or local ref" />

        <label className="text-sm">Notes (do not paste emails, IPs, or client names)</label>
        <textarea className="w-full p-2 min-h-[100px] rounded bg-slate-900" value={notes} onChange={(e)=>setNotes(e.target.value)} placeholder="Describe the alert and checks performed (PII will be stripped)" />

        <div className="flex gap-2">
          <button onClick={save} className="px-3 py-1 rounded bg-[#022636] text-[#00C2FF]">Save Triage (local)</button>
          <button onClick={()=>{ setNotes(''); setTicket(''); }} className="px-3 py-1 rounded bg-slate-700">Clear</button>
        </div>

        <div>
          <h4 className="text-sm font-medium">Quick Guidance</h4>
          {type === 'anomalous' && (
            <ul className="list-disc pl-5 text-sm">
              <li>Confirm user travel intent; if unknown, escalate to Security Team.</li>
              <li>Check M365 Admin audit logs for sign-in and IP context.</li>
              <li>Isolate affected device in SentinelOne if suspicious activity confirmed.</li>
            </ul>
          )}
          {type === 'consent' && (
            <ul className="list-disc pl-5 text-sm">
              <li>Verify whether the app is approved in your app allowlist.</li>
              <li>If unknown, pause access and confirm with customer admin via approved channels.</li>
              <li>Log findings in HaloPSA and note if user consented intentionally.</li>
            </ul>
          )}
          {type === 'admin_change' && (
            <ul className="list-disc pl-5 text-sm">
              <li>Check change history and confirm the admin action was documented.</li>
              <li>If change appears undocumented, raise to senior admin for verification.</li>
              <li>Update ticket with procedural check and recommended follow-up.</li>
            </ul>
          )}
        </div>

        <div className="mt-3">
          <h4 className="text-sm font-medium">Saved (local only)</h4>
          <div className="max-h-40 overflow-auto">
            {saved && saved.length ? saved.map(s => (
              <div key={s.id} className="border-t border-slate-700 py-2 text-sm">
                <div className="font-semibold">{s.type} — {s.severity}</div>
                <div className="text-xs text-slate-300">{new Date(s.timestamp).toLocaleString()}</div>
                <div className="mt-1 whitespace-pre-wrap">{s.note}</div>
              </div>
            )) : <div className="text-sm text-slate-400">No saved triage records</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
