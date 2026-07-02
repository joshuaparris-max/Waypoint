"use client"
import React, { useMemo, useState } from "react";

const cyan = "text-[#00C2FF]";
const STORAGE_KEY = "av_companion:llm-last-alert";

type SanitizeResult = { sanitized: string; mapping: Record<string,string> };

function sanitizeAlert(raw: string): SanitizeResult {
  let out = raw;
  const mapping: Record<string,string> = {};
  let emailIndex = 1;
  let ipIndex = 1;
  let domainIndex = 1;
  let deviceIndex = 1;

  // emails
  out = out.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, (m) => {
    if (!mapping[m]) mapping[m] = `[User_Email_${emailIndex++}]`;
    return mapping[m];
  });

  // IP addresses
  out = out.replace(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g, (m) => {
    if (!mapping[m]) mapping[m] = `[IP_Address_${ipIndex++}]`;
    return mapping[m];
  });

  // domains / tenant-like tokens (simple heuristic)
  out = out.replace(/\b([A-Za-z0-9-]+\.(?:com|org|net|au|co|local|tech|io))\b/gi, (m) => {
    if (!mapping[m]) mapping[m] = `[Domain_${domainIndex++}]`;
    return mapping[m];
  });

  // Device/hostnames (words with hyphens or capitals + digits) — heuristic
  out = out.replace(/\b([A-Za-z0-9_-]{3,})\b/g, (m) => {
    // avoid replacing tokens we already mapped or short common words
    if (m.length <= 3) return m;
    if (mapping[m]) return mapping[m];
    // simple heuristics to detect likely device names
    if (/[A-Za-z].*\d|\d.*[A-Za-z]|[-_]/.test(m) && /[A-Za-z]/.test(m)) {
      mapping[m] = `[Device_${deviceIndex++}]`;
      return mapping[m];
    }
    return m;
  });

  return { sanitized: out, mapping };
}

export default function LLMHelperMonitoring() {
  const [mode, setMode] = useState<"general"|"monitoring">("monitoring");
  const [raw, setRaw] = useState("");
  const [sanitized, setSanitized] = useState("");
  const [mapping, setMapping] = useState<Record<string,string>>({});
  const [response, setResponse] = useState<string | null>(null);

  const handleSanitize = () => {
    const r = sanitizeAlert(raw);
    setSanitized(r.sanitized);
    setMapping(r.mapping);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ sanitized: r.sanitized })); } catch(e){}
  };

  const systemPrompt = useMemo(() => `You are a Level 2 Security Triage Assistant for an MSP. You have received a sanitized system alert. Your job is to analyze the type and severity of the event, and provide the first three verifiable steps the technician should take using Avance systems (HaloPSA, SentinelOne, M365 Admin, Keeper, IRONSCALES). Do not ask for the PII; rely only on the tokenized description. Suggest immediate containment or verification steps.`, []);

  const sendToLLM = async () => {
    if (!sanitized) return alert("Sanitize first.");
    setResponse("Working...");
    // Placeholder: in real deployment, call LLM API with GROQ_API_KEY and secure backend. Here we only simulate.
    const payload = {
      system: systemPrompt,
      user: sanitized,
    };
    console.log("LLM payload (sanitized):", payload);
    // Simulated response
    setTimeout(() => setResponse("[Simulated AI Response] Alert Type: MFA Disablement - High\nSystem to Check First: M365 Admin\nImmediate Steps: 1) Check Audit Logs for [User_Email_1] ..."), 700);
  };

  return (
    <div className="p-4 rounded-lg bg-[#071526] text-slate-100">
      <div className="flex items-center justify-between mb-3">
        <h3 className={`text-md font-semibold ${cyan}`}>LLM Helper — Monitoring Alert Mode</h3>
        <div className="text-sm">Mode:
          <select className="ml-2 bg-slate-900 text-slate-100 p-1 rounded" value={mode} onChange={(e)=>setMode(e.target.value as any)}>
            <option value="general">General Issue</option>
            <option value="monitoring">Monitoring Alert (Paste Raw Text)</option>
          </select>
        </div>
      </div>

      {mode === "monitoring" && (
        <>
          <label className="text-sm mb-1 block">Paste raw alert text (PII will be stripped locally):</label>
          <textarea className="w-full min-h-[120px] p-2 rounded bg-slate-900 text-sm" value={raw} onChange={(e)=>setRaw(e.target.value)} />
          <div className="flex gap-2 mt-2">
            <button onClick={handleSanitize} className="px-3 py-1 rounded bg-[#022636] text-[#00C2FF]">Sanitize</button>
            <button onClick={sendToLLM} className="px-3 py-1 rounded bg-[#00384D] text-white">Send (sanitized)</button>
          </div>

          <div className="mt-3">
            <h4 className="text-sm font-medium">Sanitized preview (will be sent):</h4>
            <pre className="whitespace-pre-wrap p-2 rounded bg-slate-800 text-sm mt-1">{sanitized || "-- sanitized output --"}</pre>
          </div>

          <div className="mt-3">
            <h4 className="text-sm font-medium">PII mapping (local only)</h4>
            <pre className="whitespace-pre-wrap p-2 rounded bg-slate-800 text-sm mt-1">{Object.keys(mapping).length? JSON.stringify(mapping,null,2):"(no PII detected)"}</pre>
          </div>

          <div className="mt-3">
            <h4 className="text-sm font-medium">AI Response</h4>
            <pre className="whitespace-pre-wrap p-2 rounded bg-slate-800 text-sm mt-1">{response || "(no response)"}</pre>
          </div>
        </>
      )}
    </div>
  );
}
