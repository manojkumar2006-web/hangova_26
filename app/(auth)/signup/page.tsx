"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Eye, EyeOff, Loader2, Sparkles, ArrowRight,
  User, Mail, Lock, CheckCircle2, RefreshCw, ShieldCheck,
} from "lucide-react";

/* ─── Types ──────────────────────────────────────────── */
interface FormState { name: string; email: string; password: string; confirmPassword: string; }
interface Errors { name?: string; email?: string; password?: string; confirmPassword?: string; api?: string; }

/* ─── Validators ──────────────────────────────────────── */
function validate(form: FormState): Errors {
  const e: Errors = {};
  if (!form.name.trim())                           e.name = "Full name is required";
  else if (form.name.trim().length < 2)            e.name = "Name must be at least 2 characters";
  if (!form.email.trim())                          e.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address";
  if (!form.password)                              e.password = "Password is required";
  else if (form.password.length < 8)              e.password = "Must be at least 8 characters";
  if (!form.confirmPassword)                       e.confirmPassword = "Please confirm your password";
  else if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
  return e;
}

function passwordStrength(pw: string) {
  let score = 0;
  if (pw.length >= 8)  score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw))  score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"];
  const colors = ["", "#ef4444", "#f97316", "#eab308", "#22c55e", "#10b981"];
  return { score, label: map[score] || "", color: colors[score] || "" };
}

/* ─── Reusable Field ───────────────────────────────────── */
function Field({ id, label, type, placeholder, icon: Icon, value, onChange, onBlurFn, error, success, rightSlot }: {
  id: string; label: string; type: string; placeholder: string;
  icon: React.ElementType; value: string;
  onChange: (v: string) => void; onBlurFn?: () => void;
  error?: string; success?: boolean; rightSlot?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  const border = error ? "rgba(239,68,68,0.55)" : focused ? "rgba(124,111,255,0.6)" : success ? "rgba(34,197,94,0.45)" : "rgba(255,255,255,0.08)";
  const bg = error ? "rgba(239,68,68,0.05)" : focused ? "rgba(124,111,255,0.06)" : "rgba(255,255,255,0.04)";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label htmlFor={id} style={{
        fontSize: "11px",
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        color: "#666",
        display: "block",
      }}>{label}</label>
      <div className="relative">
        <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: focused ? "#7c6fff" : error ? "#ef4444" : "#444", zIndex: 10 }} />
        <input id={id} type={type} placeholder={placeholder} value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); onBlurFn?.(); }}
          className="w-full placeholder-[#333] transition-all duration-200"
          style={{
            background: bg,
            border: `1px solid ${border}`,
            boxShadow: focused && !error ? "0 0 0 4px rgba(124,111,255,0.08)" : "none",
            width: "100%",
            paddingLeft: "42px",
            paddingRight: "42px",
            paddingTop: "14px",
            paddingBottom: "14px",
            borderRadius: "12px",
            fontSize: "14px",
            color: "#ffffff",
            outline: "none",
            fontFamily: "inherit",
          }} />
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ zIndex: 10 }}>
          {rightSlot ?? (success && <CheckCircle2 size={15} style={{ color: "#22c55e" }} />)}
        </div>
      </div>
      {error && (
        <p style={{ fontSize: "11px", color: "#f87171", display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
          <span>⚠</span>{error}
        </p>
      )}
    </div>
  );
}

/* ─── OTP Digit Input ─────────────────────────────────── */
function OtpInput({ value, onChange, onComplete }: {
  value: string[]; onChange: (v: string[]) => void; onComplete: (code: string) => void;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (value[i]) {
        const next = [...value]; next[i] = ""; onChange(next);
      } else if (i > 0) {
        refs.current[i - 1]?.focus();
      }
    }
  };

  const handleChange = (i: number, raw: string) => {
    // allow paste of full OTP
    if (raw.length > 1) {
      const digits = raw.replace(/\D/g, "").slice(0, 6).split("");
      const next = Array(6).fill("").map((_, j) => digits[j] ?? "");
      onChange(next);
      if (digits.length === 6) { refs.current[5]?.focus(); onComplete(digits.join("")); }
      else refs.current[Math.min(digits.length, 5)]?.focus();
      return;
    }
    const digit = raw.replace(/\D/g, "");
    if (!digit && raw !== "") return;
    const next = [...value]; next[i] = digit;
    onChange(next);
    if (digit && i < 5) refs.current[i + 1]?.focus();
    if (next.every(d => d !== "") && next.join("").length === 6) onComplete(next.join(""));
  };

  return (
    <div className="flex gap-3 justify-center">
      {value.map((d, i) => (
        <input
          key={i}
          ref={el => { refs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={d}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKey(i, e)}
          onFocus={e => e.target.select()}
          className="w-12 h-14 text-center text-xl font-bold text-white rounded-xl transition-all duration-150 focus:outline-none"
          style={{
            background: d ? "rgba(124,111,255,0.15)" : "rgba(255,255,255,0.04)",
            border: d ? "1.5px solid rgba(124,111,255,0.6)" : "1.5px solid rgba(255,255,255,0.08)",
            boxShadow: d ? "0 0 12px rgba(124,111,255,0.2)" : "none",
            caretColor: "transparent",
          }}
        />
      ))}
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────────── */
type Step = "form" | "otp";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("form");
  const [form, setForm] = useState<FormState>({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPw, setShowPw] = useState(false);
  const [showCPw, setShowCPw] = useState(false);
  const [loading, setLoading] = useState(false);

  // OTP step state
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [otpError, setOtpError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [otpSuccess, setOtpSuccess] = useState(false);

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const set = (key: keyof FormState) => (v: string) => {
    setForm(f => ({ ...f, [key]: v }));
    if (touched[key]) setErrors(e => ({ ...e, [key]: validate({ ...form, [key]: v })[key] }));
  };
  const blur = (key: keyof FormState) => () => {
    setTouched(t => ({ ...t, [key]: true }));
    setErrors(e => ({ ...e, [key]: validate(form)[key] }));
  };

  /* ── Step 1: Submit form → send OTP ── */
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true, confirmPassword: true });
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    setErrors({});
    try {
      // Check if email already exists
      const regCheck = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password, checkOnly: true }),
      });
      // Send OTP regardless (register will check duplicate on actual creation)
      const otpRes = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, name: form.name }),
      });
      const otpData = await otpRes.json();
      if (!otpRes.ok) { setErrors({ api: otpData.error || "Failed to send OTP" }); return; }
      setStep("otp");
      setResendCooldown(60);
    } catch {
      setErrors({ api: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  /* ── Step 2: Verify OTP → create account → sign in ── */
  const handleOtpVerify = useCallback(async (code?: string) => {
    const otpCode = code ?? otp.join("");
    if (otpCode.length < 6) { setOtpError("Please enter the complete 6-digit code"); return; }

    setOtpLoading(true);
    setOtpError("");
    try {
      // Verify OTP
      const verRes = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, otp: otpCode }),
      });
      const verData = await verRes.json();
      if (!verRes.ok) { setOtpError(verData.error || "Verification failed"); return; }

      setOtpSuccess(true);
      // OTP verified — now create the account
      const regRes = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      const regData = await regRes.json();
      if (!regRes.ok) { setOtpError(regData.error || "Account creation failed"); setOtpSuccess(false); return; }

      // Sign in
      const { signIn } = await import("next-auth/react");
      const result = await signIn("credentials", { email: form.email, password: form.password, redirect: false });
      if (result?.error) { router.push("/login"); return; }
      router.push("/join");
    } catch {
      setOtpError("Network error. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  }, [otp, form, router]);

  /* ── Resend OTP ── */
  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setOtp(Array(6).fill(""));
    setOtpError("");
    setResendCooldown(60);
    try {
      await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, name: form.name }),
      });
    } catch { /* silent */ }
  };

  const strength = passwordStrength(form.password);
  const isValid = Object.keys(validate(form)).length === 0;

  /* ══════════════════════════════════════════════════
     OTP SCREEN
  ══════════════════════════════════════════════════ */
  if (step === "otp") {
    return (
      <div className="w-full">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <div className="absolute inset-0 rounded-2xl blur-xl opacity-70"
              style={{ background: otpSuccess ? "linear-gradient(135deg,#22c55e,#10b981)" : "linear-gradient(135deg,#7c6fff,#a78bfa)" }} />
            <div className="relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500"
              style={{ background: otpSuccess ? "linear-gradient(135deg,#22c55e,#10b981)" : "linear-gradient(135deg,#7c6fff,#6357e0)" }}>
              {otpSuccess
                ? <CheckCircle2 size={30} className="text-white" />
                : <ShieldCheck size={28} className="text-white" />}
            </div>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white mb-1">
            {otpSuccess ? "Verified! 🎉" : "Check your email"}
          </h1>
          <p className="text-sm text-center max-w-xs" style={{ color: "#666" }}>
            {otpSuccess
              ? "Creating your account…"
              : <>We sent a 6-digit code to <br /><span style={{ color: "#a89dff" }} className="font-semibold">{form.email}</span></>}
          </p>
        </div>

        {!otpSuccess && (
          <>
            {/* OTP Input */}
            <div className="mb-6">
              <OtpInput value={otp} onChange={setOtp} onComplete={(code) => handleOtpVerify(code)} />
            </div>

            {/* Error */}
            {otpError && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm mb-4"
                style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.18)", color: "#f87171" }}>
                <span>⚠</span> {otpError}
              </div>
            )}

            {/* Verify button */}
            <button
              onClick={() => handleOtpVerify()}
              disabled={otpLoading || otp.join("").length < 6}
              className="relative w-full py-3.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 overflow-hidden group transition-all duration-200"
              style={{
                background: otp.join("").length === 6
                  ? "linear-gradient(135deg,#7c6fff,#6357e0)"
                  : "linear-gradient(135deg,#3d3660,#2e2b52)",
                opacity: otpLoading ? 0.7 : 1,
              }}>
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent)" }} />
              {otpLoading
                ? <Loader2 size={16} className="animate-spin relative z-10" />
                : <ShieldCheck size={16} className="relative z-10" />}
              <span className="relative z-10">{otpLoading ? "Verifying…" : "Verify & Create Account"}</span>
            </button>

            {/* Resend */}
            <div className="flex items-center justify-center gap-2 mt-5">
              <p className="text-sm" style={{ color: "#555" }}>Didn&apos;t receive it?</p>
              <button
                onClick={handleResend}
                disabled={resendCooldown > 0}
                className="flex items-center gap-1.5 text-sm font-semibold transition-colors"
                style={{ color: resendCooldown > 0 ? "#444" : "#a89dff" }}>
                <RefreshCw size={13} />
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
              </button>
            </div>

            {/* Back */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
              <span className="text-xs" style={{ color: "#3a3a4a" }}>or</span>
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
            </div>
            <button onClick={() => { setStep("form"); setOtp(Array(6).fill("")); setOtpError(""); }}
              className="w-full text-center text-sm transition-colors" style={{ color: "#555" }}>
              ← Use a different email
            </button>
          </>
        )}

        {/* Loading spinner while creating account */}
        {otpSuccess && (
          <div className="flex justify-center mt-4">
            <Loader2 size={28} className="animate-spin" style={{ color: "#7c6fff" }} />
          </div>
        )}
      </div>
    );
  }

  /* ══════════════════════════════════════════════════
     SIGNUP FORM
  ══════════════════════════════════════════════════ */
  return (
    <div className="w-full">
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

      <form onSubmit={handleFormSubmit} noValidate className="space-y-4">
        <div onBlur={blur("name")}>
          <Field id="signup-name" label="Full Name" type="text" placeholder="Alex Chen" icon={User}
            value={form.name} onChange={set("name")}
            error={touched.name ? errors.name : undefined}
            success={touched.name && !errors.name && form.name.length > 0} />
        </div>

        <div onBlur={blur("email")}>
          <Field id="signup-email" label="Email" type="email" placeholder="you@example.com" icon={Mail}
            value={form.email} onChange={set("email")}
            error={touched.email ? errors.email : undefined}
            success={touched.email && !errors.email && form.email.length > 0} />
        </div>

        <div onBlur={blur("password")}>
          <Field id="signup-password" label="Password" type={showPw ? "text" : "password"}
            placeholder="Min 8 characters" icon={Lock}
            value={form.password} onChange={set("password")}
            error={touched.password ? errors.password : undefined}
            success={touched.password && !errors.password && form.password.length > 0}
            rightSlot={
              <button type="button" onClick={() => setShowPw(!showPw)} className="transition-colors" style={{ color: "#444" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#a89dff")}
                onMouseLeave={e => (e.currentTarget.style.color = "#444")}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            } />
          {form.password.length > 0 && (
            <div className="mt-2 space-y-1">
              <div className="flex gap-1">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
                    style={{ background: i <= strength.score ? strength.color : "rgba(255,255,255,0.06)" }} />
                ))}
              </div>
              <p className="text-[11px] font-medium" style={{ color: strength.color }}>{strength.label}</p>
            </div>
          )}
        </div>

        <div onBlur={blur("confirmPassword")}>
          <Field id="signup-confirm" label="Confirm Password" type={showCPw ? "text" : "password"}
            placeholder="Repeat your password" icon={Lock}
            value={form.confirmPassword} onChange={set("confirmPassword")}
            error={touched.confirmPassword ? errors.confirmPassword : undefined}
            success={touched.confirmPassword && !errors.confirmPassword && form.confirmPassword.length > 0}
            rightSlot={
              <button type="button" onClick={() => setShowCPw(!showCPw)} className="transition-colors" style={{ color: "#444" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#a89dff")}
                onMouseLeave={e => (e.currentTarget.style.color = "#444")}>
                {showCPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            } />
        </div>

        {errors.api && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
            style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.18)", color: "#f87171" }}>
            <span>⚠</span> {errors.api}
          </div>
        )}

        <button id="signup-submit" type="submit" disabled={loading}
          className="relative w-full py-3.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 overflow-hidden group mt-1 transition-all duration-200"
          style={{
            background: isValid ? "linear-gradient(135deg,#7c6fff,#6357e0)" : "linear-gradient(135deg,#3d3660,#2e2b52)",
            opacity: loading ? 0.7 : 1,
          }}>
          <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent)" }} />
          {loading ? <Loader2 size={16} className="animate-spin relative z-10" /> : <ArrowRight size={16} className="relative z-10" />}
          <span className="relative z-10">{loading ? "Sending OTP…" : "Create account"}</span>
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
