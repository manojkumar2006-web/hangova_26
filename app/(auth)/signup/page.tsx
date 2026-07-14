"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Sparkles, ArrowRight, User, Mail, Lock, CheckCircle2 } from "lucide-react";

/* ── Types ── */
interface FormState { name: string; email: string; password: string; confirmPassword: string; }
interface Errors { name?: string; email?: string; password?: string; confirmPassword?: string; api?: string; }

/* ── Validators ── */
function validate(form: FormState): Errors {
  const errors: Errors = {};
  if (!form.name.trim()) { errors.name = "Full name is required"; }
  else if (form.name.trim().length < 2) { errors.name = "Name must be at least 2 characters"; }

  if (!form.email.trim()) { errors.email = "Email is required"; }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { errors.email = "Enter a valid email address"; }

  if (!form.password) { errors.password = "Password is required"; }
  else if (form.password.length < 8) { errors.password = "Must be at least 8 characters"; }

  if (!form.confirmPassword) { errors.confirmPassword = "Please confirm your password"; }
  else if (form.password !== form.confirmPassword) { errors.confirmPassword = "Passwords do not match"; }

  return errors;
}

function passwordStrength(pw: string): { score: number; label: string; color: string } {
  if (!pw) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { score, label: "Weak", color: "#ef4444" };
  if (score <= 2) return { score, label: "Fair", color: "#f97316" };
  if (score <= 3) return { score, label: "Good", color: "#eab308" };
  return { score, label: "Strong", color: "#22c55e" };
}

/* ── Input component ── */
function Field({
  id, label, type, placeholder, icon: Icon, value, onChange, error, success, rightSlot,
}: {
  id: string; label: string; type: string; placeholder: string;
  icon: React.ElementType; value: string;
  onChange: (v: string) => void; error?: string; success?: boolean;
  rightSlot?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  const borderColor = error
    ? "rgba(239,68,68,0.6)"
    : focused
    ? "rgba(124,111,255,0.6)"
    : success
    ? "rgba(34,197,94,0.5)"
    : "rgba(255,255,255,0.08)";
  const bg = error
    ? "rgba(239,68,68,0.05)"
    : focused
    ? "rgba(124,111,255,0.06)"
    : "rgba(255,255,255,0.04)";
  const glow = focused && !error ? "0 0 0 4px rgba(124,111,255,0.08)" : "none";

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
          onBlur={() => setFocused(false)}
          className="w-full pl-10 pr-10 py-3 rounded-xl text-sm text-white placeholder-[#333] focus:outline-none transition-all duration-200"
          style={{ background: bg, border: `1px solid ${borderColor}`, boxShadow: glow }}
        />
        {/* Right slot (eye icon / check) */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {rightSlot ?? (success && !error && (
            <CheckCircle2 size={16} style={{ color: "#22c55e" }} />
          ))}
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

/* ── Page ── */
export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (key: keyof FormState) => (v: string) => {
    setForm(f => ({ ...f, [key]: v }));
    if (touched[key]) {
      const next = { ...form, [key]: v };
      setErrors(e => ({ ...e, [key]: validate(next)[key] }));
    }
  };

  const blur = (key: keyof FormState) => () => {
    setTouched(t => ({ ...t, [key]: true }));
    setErrors(e => ({ ...e, [key]: validate(form)[key] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Touch all fields and validate
    setTouched({ name: true, email: true, password: true, confirmPassword: true });
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    setErrors({});
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) { setErrors({ api: data.error || "Something went wrong" }); return; }

      const { signIn } = await import("next-auth/react");
      const result = await signIn("credentials", { email: form.email, password: form.password, redirect: false });
      if (result?.error) { router.push("/login"); return; }
      router.push("/join");
    } catch {
      setErrors({ api: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const strength = passwordStrength(form.password);
  const isValid = Object.keys(validate(form)).length === 0;

  return (
    <div className="w-full">
      {/* Logo */}
      <div className="flex flex-col items-center mb-7">
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

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Full Name */}
        <div onBlur={blur("name")}>
          <Field
            id="signup-name" label="Full Name" type="text"
            placeholder="Alex Chen" icon={User}
            value={form.name} onChange={set("name")}
            error={touched.name ? errors.name : undefined}
            success={touched.name && !errors.name && form.name.length > 0}
          />
        </div>

        {/* Email */}
        <div onBlur={blur("email")}>
          <Field
            id="signup-email" label="Email" type="email"
            placeholder="you@example.com" icon={Mail}
            value={form.email} onChange={set("email")}
            error={touched.email ? errors.email : undefined}
            success={touched.email && !errors.email && form.email.length > 0}
          />
        </div>

        {/* Password */}
        <div onBlur={blur("password")}>
          <Field
            id="signup-password" label="Password" type={showPw ? "text" : "password"}
            placeholder="Min 8 characters" icon={Lock}
            value={form.password} onChange={set("password")}
            error={touched.password ? errors.password : undefined}
            success={touched.password && !errors.password && form.password.length > 0}
            rightSlot={
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="transition-colors" style={{ color: "#444" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#a89dff")}
                onMouseLeave={e => (e.currentTarget.style.color = "#444")}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />
          {/* Strength bar */}
          {form.password.length > 0 && (
            <div className="mt-2 space-y-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300" style={{
                    background: i <= strength.score ? strength.color : "rgba(255,255,255,0.06)"
                  }} />
                ))}
              </div>
              <p className="text-[11px] font-medium" style={{ color: strength.color }}>{strength.label}</p>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div onBlur={blur("confirmPassword")}>
          <Field
            id="signup-confirm" label="Confirm Password" type={showConfirm ? "text" : "password"}
            placeholder="Repeat your password" icon={Lock}
            value={form.confirmPassword} onChange={set("confirmPassword")}
            error={touched.confirmPassword ? errors.confirmPassword : undefined}
            success={touched.confirmPassword && !errors.confirmPassword && form.confirmPassword.length > 0}
            rightSlot={
              <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                className="transition-colors" style={{ color: "#444" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#a89dff")}
                onMouseLeave={e => (e.currentTarget.style.color = "#444")}>
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />
        </div>

        {/* API error */}
        {errors.api && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
            style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.18)", color: "#f87171" }}>
            <span>⚠</span> {errors.api}
          </div>
        )}

        {/* Submit */}
        <button
          id="signup-submit"
          type="submit"
          disabled={loading}
          className="relative w-full py-3.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 overflow-hidden group mt-1 transition-all duration-200"
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
        <Link href="/login" className="font-semibold transition-colors" style={{ color: "#a89dff" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#c4b8ff")}
          onMouseLeave={e => (e.currentTarget.style.color = "#a89dff")}>
          Sign in →
        </Link>
      </p>
    </div>
  );
}
