"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Sparkles, ArrowRight, User, AtSign, Mail, Lock } from "lucide-react";

const fields = [
  { id: "signup-name",     key: "name",     label: "Full Name",   type: "text",     placeholder: "Alex Chen",          icon: User,   autocomplete: "name" },
  { id: "signup-username", key: "username", label: "Username",    type: "text",     placeholder: "alexchen",           icon: AtSign, autocomplete: "username" },
  { id: "signup-email",    key: "email",    label: "Email",       type: "email",    placeholder: "you@example.com",    icon: Mail,   autocomplete: "email" },
];

function InputField({
  id, label, type, placeholder, icon: Icon, autocomplete, value, onChange,
}: {
  id: string; label: string; type: string; placeholder: string;
  icon: React.ElementType; autocomplete: string; value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#555" }}>{label}</label>
      <div className="relative">
        <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#444" }} />
        <input
          id={id} type={type} required placeholder={placeholder}
          autoComplete={autocomplete} value={value}
          onChange={e => onChange(type === "text" && id.includes("username")
            ? e.target.value.toLowerCase().replace(/\s/g, "")
            : e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-[#3a3a4a] focus:outline-none transition-all duration-200"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
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
    </div>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
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
    } catch { setError("Network error. Try again."); }
    finally { setLoading(false); }
  };

  return (
    <div className="w-full">
      {/* Logo */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative mb-4">
          <div className="absolute inset-0 rounded-2xl blur-lg opacity-60"
            style={{ background: "linear-gradient(135deg,#7c6fff,#a78bfa)" }} />
          <div className="relative w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#7c6fff,#6357e0)" }}>
            <Sparkles size={26} className="text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-black tracking-tight text-white mb-1">Create account</h1>
        <p className="text-sm" style={{ color: "#666" }}>Join your crew on HANGOVA</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Two-column row: Name + Username */}
        <div className="grid grid-cols-2 gap-3">
          {fields.slice(0, 2).map(({ key: fKey, ...f }) => (
            <InputField key={fKey} {...f}
              value={(form as Record<string, string>)[fKey]}
              onChange={v => setForm({ ...form, [fKey]: v })}
            />
          ))}
        </div>

        {/* Email */}
        <InputField {...fields[2]}
          value={form.email}
          onChange={v => setForm({ ...form, email: v })}
        />

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#555" }}>Password</label>
          <div className="relative">
            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#444" }} />
            <input
              id="signup-password"
              type={showPw ? "text" : "password"}
              required minLength={8}
              placeholder="Min 8 characters"
              autoComplete="new-password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full pl-10 pr-12 py-3 rounded-xl text-sm text-white placeholder-[#3a3a4a] focus:outline-none transition-all duration-200"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
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
            <button type="button" onClick={() => setShowPw(!showPw)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
              style={{ color: "#444" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#a89dff")}
              onMouseLeave={e => (e.currentTarget.style.color = "#444")}>
              {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          {/* Strength hint */}
          {form.password.length > 0 && (
            <div className="flex gap-1 mt-1.5">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-0.5 flex-1 rounded-full transition-all duration-300" style={{
                  background: form.password.length >= i * 2
                    ? i <= 1 ? "#ef4444" : i <= 2 ? "#f97316" : i <= 3 ? "#eab308" : "#22c55e"
                    : "rgba(255,255,255,0.08)"
                }} />
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
            style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.18)", color: "#f87171" }}>
            <span>⚠</span> {error}
          </div>
        )}

        <button
          id="signup-submit"
          type="submit"
          disabled={loading}
          className="relative w-full py-3.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 overflow-hidden group mt-1"
          style={{ background: "linear-gradient(135deg,#7c6fff 0%,#6357e0 100%)" }}
        >
          <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: "linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.1) 50%,transparent 100%)" }} />
          <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ boxShadow: "0 0 30px rgba(124,111,255,0.5)" }} />
          {loading ? <Loader2 size={16} className="animate-spin relative z-10" /> : <ArrowRight size={16} className="relative z-10" />}
          <span className="relative z-10">{loading ? "Creating account…" : "Create account"}</span>
        </button>
      </form>

      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
        <span className="text-xs" style={{ color: "#3a3a4a" }}>or</span>
        <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
      </div>

      <p className="text-center text-sm" style={{ color: "#555" }}>
        Already have an account?{" "}
        <Link href="/login" className="font-semibold" style={{ color: "#a89dff" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#c4b8ff")}
          onMouseLeave={e => (e.currentTarget.style.color = "#a89dff")}>
          Sign in →
        </Link>
      </p>
    </div>
  );
}
