"use client";
import { useState } from "react";

const pills = [
  { label: "For you", emoji: "✦" },
  { label: "Movies", emoji: "🎬" },
  { label: "Reels", emoji: "⚡" },
  { label: "Music", emoji: "🎵" },
];

export default function CategoryPills() {
  const [active, setActive] = useState("For you");
  return (
    <div className="flex gap-2 overflow-x-auto pb-0.5" style={{ scrollbarWidth: "none" }}>
      {pills.map(({ label, emoji }) => (
        <button key={label} id={`category-pill-${label.toLowerCase().replace(" ", "-")}`}
          onClick={() => setActive(label)}
          className="shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
          style={active === label
            ? { background: "rgba(124,111,255,0.15)", border: "1px solid rgba(124,111,255,0.35)", color: "#a89dff" }
            : { background: "#111", border: "1px solid #1f1f1f", color: "#555" }}>
          <span>{emoji}</span> {label}
        </button>
      ))}
    </div>
  );
}
