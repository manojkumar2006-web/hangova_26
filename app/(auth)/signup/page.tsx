"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Sparkles } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong"); return; }
      const { signIn } = await import("next-auth/react");
      const result = await signIn("credentials", { email: form.email, password: form.password, redirect: false });
      if (result?.error) { router.push("/login"); return; }
      router.push("/join");
    } catch { setError("Network error. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <div className="w-full">
      {/* Wordmark */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #7c6fff, #5b52cc)" }}>
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white">HANGOVA</span>
        </div>
        <p className="text-sm" style={{ color: "#666" }}>Create your account to get started</p>
      </div>

      {/* Card */}
      <div className="rounded-2xl p-6 relative overflow-hidden"
        style={{ background: "#111", border: "1px solid #1f1f1f" }}>

        {/* Top accent line */}
        <div className="absolute top-0 left-6 right-6 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(124,111,255,0.5), transparent)" }} />

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { id: "signup-name", label: "Full name", type: "text", placeholder: "Your name", key: "name" },
            { id: "signup-username", label: "Username", type: "text", placeholder: "yourhandle", key: "username" },
            { id: "signup-email", label: "Email", type: "email", placeholder: "you@example.com", key: "email" },
          ].map((field) => (
            <div key={field.key}>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#666" }}>{field.label}</label>
              <input
                id={field.id}
                type={field.type}
                required
                placeholder={field.placeholder}
                value={(form as any)[field.key]}
                onChange={(e) => setForm({ ...form, [field.key]: field.key === "username" ? e.target.value.toLowerCase().replace(/\s/g, "") : e.target.value })}
                className="w-full rounded-xl px-4 py-3 text-sm transition-all duration-200 focus:outline-none"
                style={{
                  background: "#0d0d0d",
                  border: "1px solid #222",
                  color: "#f0f0f0",
                }}
                onFocus={(e) => e.target.style.borderColor = "rgba(124,111,255,0.6)"}
                onBlur={(e) => e.target.style.borderColor = "#222"}
              />
            </div>
          ))}

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "#666" }}>Password</label>
            <div className="relative">
              <input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                placeholder="Minimum 8 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full rounded-xl px-4 py-3 pr-11 text-sm transition-all duration-200 focus:outline-none"
                style={{ background: "#0d0d0d", border: "1px solid #222", color: "#f0f0f0" }}
                onFocus={(e) => e.target.style.borderColor = "rgba(124,111,255,0.6)"}
                onBlur={(e) => e.target.style.borderColor = "#222"}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: "#555" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#aaa")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-xl px-4 py-3 text-sm flex items-center gap-2"
              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" }}>
              <span className="text-base">⚠</span> {error}
            </div>
          )}

          <button id="signup-submit" type="submit" disabled={loading}
            className="w-full rounded-xl py-3 text-sm font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #7c6fff, #6357e0)" }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.background = "linear-gradient(135deg, #8d82ff, #7168e8)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "linear-gradient(135deg, #7c6fff, #6357e0)")}>
            {loading ? <Loader2 size={15} className="animate-spin" /> : null}
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="text-center text-xs mt-5" style={{ color: "#555" }}>
          Already have an account?{" "}
          <Link href="/login" className="font-medium transition-colors" style={{ color: "#7c6fff" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#a89dff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#7c6fff")}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
