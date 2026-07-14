"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2, Users2 } from "lucide-react";

export default function JoinPage() {
  const router = useRouter();
  const { update } = useSession();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/groups/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim().toUpperCase() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Invalid group code"); return; }
      await update({ groupId: data.group.id, groupName: data.group.name });
      router.push(`/welcome?group=${encodeURIComponent(data.group.name)}&members=${data.group._count?.members ?? 1}`);
    } catch { setError("Network error. Please try again."); }
    finally { setLoading(false); }
  };

  const chars = Array.from({ length: 8 }, (_, i) => code[i] ?? "");

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
          style={{ background: "rgba(124,111,255,0.12)", border: "1px solid rgba(124,111,255,0.2)" }}>
          <Users2 size={26} style={{ color: "#7c6fff" }} />
        </div>
        <h1 className="text-xl font-bold text-white mb-1">Join your crew</h1>
        <p className="text-sm" style={{ color: "#666" }}>Enter the group code a friend shared with you</p>
      </div>

      <div className="rounded-2xl p-6 relative overflow-hidden"
        style={{ background: "#111", border: "1px solid #1f1f1f" }}>
        <div className="absolute top-0 left-6 right-6 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(124,111,255,0.5), transparent)" }} />

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Big code input — segmented visual */}
          <div>
            <label className="block text-xs font-medium mb-3 text-center" style={{ color: "#666" }}>
              GROUP CODE
            </label>
            <div className="relative">
              <input
                id="group-code-input"
                type="text"
                required
                maxLength={8}
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
                className="absolute inset-0 opacity-0 w-full h-full cursor-text z-10"
                autoComplete="off"
              />
              {/* Visual segmented display */}
              <div className="flex gap-2 justify-center">
                {chars.map((char, i) => (
                  <div key={i}
                    className="w-10 h-12 rounded-xl flex items-center justify-center text-lg font-bold font-mono transition-all duration-150"
                    style={{
                      background: char ? "rgba(124,111,255,0.1)" : "#0d0d0d",
                      border: `1.5px solid ${char ? "rgba(124,111,255,0.4)" : "#222"}`,
                      color: char ? "#a89dff" : "#333",
                      letterSpacing: 0,
                    }}>
                    {char || "·"}
                  </div>
                ))}
              </div>
            </div>
            {/* Fallback plain input for accessibility */}
            <input
              aria-hidden
              type="text"
              maxLength={8}
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
              className="w-full mt-3 rounded-xl px-4 py-2.5 text-center text-sm font-mono tracking-widest focus:outline-none transition-all"
              style={{ background: "#0d0d0d", border: "1px solid #222", color: "#7c6fff" }}
              placeholder="OR TYPE CODE HERE"
            />
          </div>

          {error && (
            <div className="rounded-xl px-4 py-3 text-sm flex items-center gap-2"
              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" }}>
              <span>⚠</span> {error}
            </div>
          )}

          <button id="join-group-submit" type="submit" disabled={loading || code.length < 4}
            className="w-full rounded-xl py-3 text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-40"
            style={{ background: "linear-gradient(135deg, #7c6fff, #6357e0)" }}
            onMouseEnter={(e) => !loading && code.length >= 4 && (e.currentTarget.style.background = "linear-gradient(135deg, #8d82ff, #7168e8)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "linear-gradient(135deg, #7c6fff, #6357e0)")}>
            {loading ? <Loader2 size={15} className="animate-spin" /> : null}
            {loading ? "Joining…" : "Join crew"}
          </button>
        </form>

        <p className="text-center text-xs mt-5" style={{ color: "#444" }}>
          Creating a new group? <span style={{ color: "#7c6fff" }}>Ask an admin.</span>
        </p>
      </div>
    </div>
  );
}
