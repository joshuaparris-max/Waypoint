"use client";

import { useEffect, useState } from "react";

type PendingItem = {
  id: string;
  ticketId: string;
  actionRequiredText: string;
  followUpDue: string; // ISO timestamp
};

const STORAGE_KEY = "av_companion:pending-followups";

function loadItems(): PendingItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as PendingItem[];
  } catch {
    return [];
  }
}

function saveItems(items: PendingItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

export default function PendingActionTracker() {
  const [items, setItems] = useState<PendingItem[]>(() => loadItems());
  const [showModal, setShowModal] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const [actionText, setActionText] = useState("");
  const [due, setDue] = useState<string>(
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
  );

  useEffect(() => saveItems(items), [items]);

  function addItem() {
    if (!ticketId.trim() || !actionText.trim()) return;
    const item: PendingItem = {
      id: String(Date.now()),
      ticketId: ticketId.trim(),
      actionRequiredText: actionText.trim(),
      followUpDue: new Date(due).toISOString(),
    };
    setItems((cur) => [item, ...cur]);
    setTicketId("");
    setActionText("");
    setShowModal(false);
  }

  function markComplete(id: string) {
    setItems((cur) => cur.filter((it) => it.id !== id));
  }

  const overdue = items.filter((it) => new Date(it.followUpDue) <= new Date());

  return (
    <div className="rounded-lg border border-[#dbe3e0] bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-[#2a7d8e]">Follow-Up (Pending Actions)</h4>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="rounded-md bg-[#1a2e4a] px-3 py-1 text-xs font-semibold text-white"
        >
          Add Follow-Up
        </button>
      </div>

      <div className="mt-3 text-sm text-[#5d6f82]">
        {overdue.length === 0 ? (
          <p className="text-xs">No overdue follow-ups. Upcoming follow-ups appear here.</p>
        ) : (
          <ul className="space-y-2">
            {overdue.map((it) => (
              <li key={it.id} className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-xs text-[#8a9aaa]">{it.ticketId}</p>
                  <p className="mt-1 text-sm">{it.actionRequiredText}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <p className="text-xs text-[#9d3732]">Due</p>
                  <button
                    type="button"
                    onClick={() => markComplete(it.id)}
                    className="rounded-md bg-[#2a7d8e] px-2 py-1 text-xs font-semibold text-white"
                  >
                    Mark Complete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {showModal ? (
        <div className="mt-3 rounded-md border border-[#e4ebe8] bg-[#fbfcfb] p-3">
          <label className="text-xs text-[#607286]">Ticket ID</label>
          <input
            value={ticketId}
            onChange={(e) => setTicketId(e.target.value)}
            className="mt-1 w-full rounded-md border border-[#dbe3e0] px-3 py-2 text-sm"
          />

          <label className="mt-3 text-xs text-[#607286]">Action required</label>
          <textarea
            value={actionText}
            onChange={(e) => setActionText(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-md border border-[#dbe3e0] px-3 py-2 text-sm"
          />

          <label className="mt-3 text-xs text-[#607286]">Follow-up due</label>
          <input
            type="datetime-local"
            value={due}
            onChange={(e) => setDue(e.target.value)}
            className="mt-1 w-full rounded-md border border-[#dbe3e0] px-3 py-2 text-sm"
          />

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={addItem}
              className="rounded-md bg-[#1a2e4a] px-3 py-2 text-xs font-semibold text-white"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="rounded-md border border-[#dbe3e0] px-3 py-2 text-xs font-semibold text-[#607286]"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
