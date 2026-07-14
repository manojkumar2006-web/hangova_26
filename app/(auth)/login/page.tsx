"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Sparkles } from "lucide-react";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await signIn("credentials", { email: form.email, password: form.password, redirect: false });
      if (result?.error) { setError("Invalid email or password"); return; }
      router.push(callbackUrl);
      router.refresh();
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
        <p className="text-sm" style={{ color: "#666" }}>Welcome back to the crew</p>
      </div>

      <div className="rounded-2xl p-6 relative overflow-hidden"
        style={{ background: "#111", border: "1px solid #1f1f1f" }}>
        <div className="absolute top-0 left-6 right-6 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(124,111,255,0.5), transparent)" }} />

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { id: "login-email", label: "Email", type: "email", placeholder: "you@example.com", key: "email" },
          ].map((field) => (
            <div key={field.key}>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#666" }}>{field.label}</label>
              <input id={field.id} type={field.type} required placeholder={field.placeholder}
                value={(form as any)[field.key]}
                onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                className="w-full rounded-xl px-4 py-3 text-sm transition-all duration-200 focus:outline-none"
                style={{ background: "#0d0d0d", border: "1px solid #222", color: "#f0f0f0" }}
                onFocus={(e) => e.target.style.borderColor = "rgba(124,111,255,0.6)"}
                onBlur={(e) => e.target.style.borderColor = "#222"} />
            </div>
          ))}

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium" style={{ color: "#666" }}>Password</label>
            </div>
            <div className="relative">
              <input id="login-password" type={showPassword ? "text" : "password"} required
                placeholder="Your password" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none transition-all duration-200"
                style={{ background: "#0d0d0d", border: "1px solid #222", color: "#f0f0f0" }}
                onFocus={(e) => e.target.style.borderColor = "rgba(124,111,255,0.6)"}
                onBlur={(e) => e.target.style.borderColor = "#222"} />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2"
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
              <span>⚠</span> {error}
            </div>
          )}

          <button id="login-submit" type="submit" disabled={loading}
            className="w-full rounded-xl py-3 text-sm font-semibold text-white flex items-center justify-center gap-2 mt-2 transition-all duration-200 disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #7c6fff, #6357e0)" }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.background = "linear-gradient(135deg, #8d82ff, #7168e8)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "linear-gradient(135deg, #7c6fff, #6357e0)")}>
            {loading ? <Loader2 size={15} className="animate-spin" /> : null}
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="text-center text-xs mt-5" style={{ color: "#555" }}>
          No account yet?{" "}
          <Link href="/signup" className="font-medium" style={{ color: "#7c6fff" }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>;
}
