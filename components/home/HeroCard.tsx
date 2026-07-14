"use client";
import Link from "next/link";
import Image from "next/image";
import { Play, RotateCcw, Info } from "lucide-react";

interface Props {
  content: { id: string; title: string; description?: string | null; thumbnailUrl?: string | null; type: string; genre?: string | null };
  progress: number;
  isResume: boolean;
}

const typeHref: Record<string, string> = { movie: "/movies", reel: "/reels", song: "/music" };

export default function HeroCard({ content, progress, isResume }: Props) {
  const href = `${typeHref[content.type] ?? "/movies"}/${content.id}`;

  return (
    <div className="relative rounded-2xl overflow-hidden aspect-[16/9] md:aspect-[21/9] lg:aspect-[25/9] max-h-[380px] w-full"
      style={{ background: "#111", border: "1px solid #1f1f1f" }}>
      {/* Thumbnail */}
      {content.thumbnailUrl
        ? <Image src={content.thumbnailUrl} alt={content.title} fill className="object-cover" priority />
        : <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(124,111,255,0.15), #111)" }} />
      }

      {/* Gradient overlay — bottom heavy */}
      <div className="absolute inset-0"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)" }} />

      {/* Badge */}
      {isResume && (
        <div className="absolute top-4 left-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.1)", color: "#a89dff" }}>
          <RotateCcw size={10} /> Continue watching
        </div>
      )}

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        {content.genre && (
          <p className="text-[11px] font-semibold uppercase tracking-widest mb-1.5"
            style={{ color: "#7c6fff" }}>{content.genre}</p>
        )}
        <h2 className="text-xl md:text-2xl font-bold text-white mb-3 leading-tight">{content.title}</h2>

        {/* Progress bar */}
        {isResume && progress > 0 && (
          <div className="w-full h-0.5 rounded-full mb-4 overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: "#7c6fff" }} />
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center gap-2.5">
          <Link href={href} id="hero-resume-btn"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-150"
            style={{ background: "linear-gradient(135deg, #7c6fff, #6357e0)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "linear-gradient(135deg, #8d82ff, #7168e8)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "linear-gradient(135deg, #7c6fff, #6357e0)")}>
            {isResume ? <RotateCcw size={14} /> : <Play size={14} />}
            {isResume ? "Resume" : "Watch now"}
          </Link>
          <Link href={href}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", color: "#ccc" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}>
            <Info size={14} /> Info
          </Link>
        </div>
      </div>
    </div>
  );
}
