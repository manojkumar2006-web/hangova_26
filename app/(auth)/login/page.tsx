"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Sparkles, ArrowRight } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email: form.email, password: form.password, redirect: false,
      });
      if (result?.error) { setError("Invalid email or password"); return; }
      router.push(callbackUrl);
      router.refresh();
    } catch { setError("Network error. Try again."); }
    finally { setLoading(false); }
  };

  return (
    <div className="w-full">
      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative mb-4">
          <div className="absolute inset-0 rounded-2xl blur-lg opacity-60"
            style={{ background: "linear-gradient(135deg,#7c6fff,#a78bfa)" }} />
          <div className="relative w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#7c6fff,#6357e0)" }}>
            <Sparkles size={26} className="text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-black tracking-tight text-white mb-1">Welcome back</h1>
        <p className="text-sm" style={{ color: "#666" }}>Sign in to your HANGOVA account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#555" }}>Email</label>
          <input
            id="login-email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-3.5 rounded-xl text-sm text-white placeholder-[#3a3a4a] focus:outline-none transition-all duration-200"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
            onFocus={e => {
              e.target.style.border = "1px solid rgba(124,111,255,0.6)";
              e.target.style.background = "rgba(124,111,255,0.06)";
              e.target.style.boxShadow = "0 0 0 4px rgba(124,111,255,0.08)";
            }}
            onBlur={e => {
              e.target.style.border = "1px solid rgba(255,255,255,0.08)";
              e.target.style.background = "rgba(255,255,255,0.04)";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#555" }}>Password</label>
          <div className="relative">
            <input
              id="login-password"
              type={showPw ? "text" : "password"}
              required
              autoComplete="current-password"
              placeholder="Your password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-3.5 pr-12 rounded-xl text-sm text-white placeholder-[#3a3a4a] focus:outline-none transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
              onFocus={e => {
                e.target.style.border = "1px solid rgba(124,111,255,0.6)";
                e.target.style.background = "rgba(124,111,255,0.06)";
                e.target.style.boxShadow = "0 0 0 4px rgba(124,111,255,0.08)";
              }}
              onBlur={e => {
                e.target.style.border = "1px solid rgba(255,255,255,0.08)";
                e.target.style.background = "rgba(255,255,255,0.04)";
                e.target.style.boxShadow = "none";
              }}
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
              style={{ color: "#444" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#a89dff")}
              onMouseLeave={e => (e.currentTarget.style.color = "#444")}
            >
              {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
            style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.18)", color: "#f87171" }}>
            <span className="text-base">⚠</span> {error}
          </div>
        )}

        {/* Submit */}
        <button
          id="login-submit"
          type="submit"
          disabled={loading}
          className="relative w-full py-3.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 overflow-hidden group mt-2"
          style={{ background: "linear-gradient(135deg,#7c6fff 0%,#6357e0 100%)" }}
        >
          {/* Shine sweep */}
          <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)" }} />
          {/* Glow */}
          <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ boxShadow: "0 0 30px rgba(124,111,255,0.5)" }} />
          {loading ? <Loader2 size={16} className="animate-spin relative z-10" /> : <ArrowRight size={16} className="relative z-10" />}
          <span className="relative z-10">{loading ? "Signing in…" : "Sign in"}</span>
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
        <span className="text-xs" style={{ color: "#3a3a4a" }}>or</span>
        <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
      </div>

      <p className="text-center text-sm" style={{ color: "#555" }}>
        No account yet?{" "}
        <Link href="/signup" className="font-semibold transition-colors" style={{ color: "#a89dff" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#c4b8ff")}
          onMouseLeave={e => (e.currentTarget.style.color = "#a89dff")}>
          Create one free →
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>;
}
