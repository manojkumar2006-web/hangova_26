"use client";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { CheckCircle2, Users, ArrowRight } from "lucide-react";
import { Suspense } from "react";

function WelcomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const groupName = searchParams.get("group") || "The Crew";
  const memberCount = searchParams.get("members") || "1";

  return (
    <div className="w-full text-center">
      {/* Animated checkmark */}
      <div className="relative mx-auto mb-6 w-20 h-20">
        <div className="absolute inset-0 rounded-full animate-ping"
          style={{ background: "rgba(34,197,94,0.1)", animationDuration: "2s" }} />
        <div className="relative w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)" }}>
          <CheckCircle2 size={36} style={{ color: "#4ade80" }} />
        </div>
      </div>

      <h1 className="text-2xl font-bold text-white mb-2">
        You&apos;re in! 🎉
      </h1>
      <p className="text-sm mb-1" style={{ color: "#888" }}>Welcome to</p>
      <p className="text-xl font-bold mb-6" style={{ color: "#7c6fff" }}>{groupName}</p>

      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-sm"
        style={{ background: "rgba(124,111,255,0.08)", border: "1px solid rgba(124,111,255,0.15)", color: "#888" }}>
        <Users size={14} style={{ color: "#7c6fff" }} />
        <span><strong className="text-white">{memberCount}</strong> member{Number(memberCount) !== 1 ? "s" : ""} in this crew</span>
      </div>

      <button id="go-to-home-feed" onClick={() => router.push("/")}
        className="w-full rounded-xl py-3 text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200"
        style={{ background: "linear-gradient(135deg, #7c6fff, #6357e0)" }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "linear-gradient(135deg, #8d82ff, #7168e8)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "linear-gradient(135deg, #7c6fff, #6357e0)")}>
        Go to home feed <ArrowRight size={15} />
      </button>
    </div>
  );
}

export default function WelcomePage() {
  return (
    <div className="w-full">
      <div className="rounded-2xl p-8 relative overflow-hidden"
        style={{ background: "#111", border: "1px solid #1f1f1f" }}>
        <div className="absolute top-0 left-6 right-6 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(34,197,94,0.4), transparent)" }} />
        <Suspense><WelcomeContent /></Suspense>
      </div>
    </div>
  );
}
