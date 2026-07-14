"use client";
import { useState } from "react";
import { Bell, Loader2, Radio } from "lucide-react";

interface Props { title: string; dropAt: Date; dropId: string; }

function formatCountdown(dropAt: Date) {
  const diff = new Date(dropAt).getTime() - Date.now();
  if (diff <= 0) return "Live now";
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (h > 24) return `in ${Math.floor(h / 24)}d`;
  if (h > 0) return `in ${h}h ${m}m`;
  return `in ${m}m`;
}

export default function ScheduledDropBanner({ title, dropAt, dropId }: Props) {
  const [reminded, setReminded] = useState(false);
  const [loading, setLoading] = useState(false);

  const remind = async () => {
    setLoading(true);
    await fetch("/api/reminders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ scheduledDropId: dropId }) });
    setReminded(true);
    setLoading(false);
  };

  return (
    <div className="mx-4 md:mx-5 mt-4 flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl"
      style={{ background: "rgba(124,111,255,0.06)", border: "1px solid rgba(124,111,255,0.15)" }}>
      <div className="flex items-center gap-3 min-w-0">
        <Radio size={14} style={{ color: "#7c6fff", flexShrink: 0 }} className="animate-pulse" />
        <p className="text-xs truncate" style={{ color: "#999" }}>
          <span className="font-semibold text-white">{title}</span>
          {" "}<span style={{ color: "#7c6fff" }}>{formatCountdown(dropAt)}</span>
        </p>
      </div>
      <button id="remind-me-btn" onClick={remind} disabled={reminded || loading}
        className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all"
        style={{
          background: reminded ? "rgba(74,222,128,0.08)" : "rgba(124,111,255,0.1)",
          border: `1px solid ${reminded ? "rgba(74,222,128,0.2)" : "rgba(124,111,255,0.2)"}`,
          color: reminded ? "#4ade80" : "#a89dff",
        }}>
        {loading ? <Loader2 size={11} className="animate-spin" /> : <Bell size={11} />}
        {reminded ? "Set!" : "Remind me"}
      </button>
    </div>
  );
}
