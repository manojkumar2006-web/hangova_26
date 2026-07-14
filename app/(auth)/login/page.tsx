"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Sparkles, ArrowRight, Mail, Lock, CheckCircle2 } from "lucide-react";

/* ── Per-field validators ── */
function validateEmail(v: string) {
  if (!v.trim()) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Enter a valid email address";
  return "";
}
function validatePassword(v: string) {
  if (!v) return "Password is required";
  if (v.length < 8) return "Password must be at least 8 characters";
  return "";
}

/* ── Reusable input field ── */
function Field({
  id, label, type, placeholder, icon: Icon, value, onChange, onBlurValidate, error, success, rightSlot,
}: {
  id: string; label: string; type: string; placeholder: string;
  icon: React.ElementType; value: string;
  onChange: (v: string) => void; onBlurValidate: () => void;
  error?: string; success?: boolean; rightSlot?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  const borderColor = error
    ? "rgba(239,68,68,0.6)"
    : focused ? "rgba(124,111,255,0.6)"
    : success ? "rgba(34,197,94,0.5)"
    : "rgba(255,255,255,0.08)";
  const bg = error
    ? "rgba(239,68,68,0.05)"
    : focused ? "rgba(124,111,255,0.06)"
    : "rgba(255,255,255,0.04)";

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#666" }}>
        {label}
      </label>
      <div className="relative">
        <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: focused ? "#7c6fff" : error ? "#ef4444" : "#444" }} />
        <input
          id={id} type={type} placeholder={placeholder} value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); onBlurValidate(); }}
          className="w-full pl-10 pr-10 py-3.5 rounded-xl text-sm text-white placeholder-[#333] focus:outline-none transition-all duration-200"
          style={{
            background: bg,
            border: `1px solid ${borderColor}`,
            boxShadow: focused && !error ? "0 0 0 4px rgba(124,111,255,0.08)" : "none",
          }}
        />
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
          {rightSlot ?? (success && <CheckCircle2 size={16} style={{ color: "#22c55e" }} />)}
        </div>
      </div>
      {error && (
        <p className="text-[11px] flex items-center gap-1" style={{ color: "#f87171" }}>
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [apiError, setApiError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const isValid = !validateEmail(email) && !validatePassword(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate all on submit
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    setEmailError(eErr);
    setPasswordError(pErr);
    if (eErr || pErr) return;

    setApiError("");
    setLoading(true);
    try {
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) {
        setApiError("Invalid email or password. Please try again.");
        return;
      }
      router.push(callbackUrl);
      router.refresh();
    } catch {
      setApiError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
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

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Email */}
        <Field
          id="login-email" label="Email" type="email"
          placeholder="you@example.com" icon={Mail}
          value={email} onChange={v => { setEmail(v); if (emailError) setEmailError(validateEmail(v)); }}
          onBlurValidate={() => setEmailError(validateEmail(email))}
          error={emailError || undefined}
          success={!emailError && email.length > 0}
        />

        {/* Password */}
        <Field
          id="login-password" label="Password" type={showPw ? "text" : "password"}
          placeholder="Your password" icon={Lock}
          value={password} onChange={v => { setPassword(v); if (passwordError) setPasswordError(validatePassword(v)); }}
          onBlurValidate={() => setPasswordError(validatePassword(password))}
          error={passwordError || undefined}
          success={!passwordError && password.length > 0}
          rightSlot={
            <button type="button" onClick={() => setShowPw(!showPw)}
              className="transition-colors" style={{ color: "#444" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#a89dff")}
              onMouseLeave={e => (e.currentTarget.style.color = "#444")}>
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
        />

        {/* API error */}
        {apiError && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
            style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.18)", color: "#f87171" }}>
            <span>⚠</span> {apiError}
          </div>
        )}

        {/* Submit */}
        <button
          id="login-submit"
          type="submit"
          disabled={loading}
          className="relative w-full py-3.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 overflow-hidden group mt-2 transition-all duration-200"
          style={{
            background: isValid
              ? "linear-gradient(135deg,#7c6fff 0%,#6357e0 100%)"
              : "linear-gradient(135deg,#3d3660 0%,#2e2b52 100%)",
            opacity: loading ? 0.7 : 1,
          }}
        >
          <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent)" }} />
          {loading ? <Loader2 size={16} className="animate-spin relative z-10" /> : <ArrowRight size={16} className="relative z-10" />}
          <span className="relative z-10">{loading ? "Signing in…" : "Sign in"}</span>
        </button>
      </form>

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
