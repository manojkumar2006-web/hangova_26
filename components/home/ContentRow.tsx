"use client";
import Link from "next/link";
import Image from "next/image";
import { Play, Music, ChevronRight } from "lucide-react";

interface Item {
  id: string; title: string; thumbnailUrl?: string | null; type: string; genre?: string | null; description?: string | null;
}

interface Props { title: string; items: Item[]; variant: "movie" | "reel" | "music"; seeAllHref: string; }

function MovieCard({ item }: { item: Item }) {
  return (
    <Link href={`/movies/${item.id}`}
      className="group relative overflow-hidden rounded-xl shrink-0 transition-transform duration-200 hover:scale-[1.03] hover:-translate-y-0.5"
      style={{ width: 168, background: "#111", border: "1px solid #1f1f1f" }}>
      <div className="relative" style={{ aspectRatio: "16/9" }}>
        {item.thumbnailUrl
          ? <Image src={item.thumbnailUrl} alt={item.title} fill className="object-cover" />
          : <div className="absolute inset-0 flex items-center justify-center" style={{ background: "#0d0d0d" }}>
              <Play size={22} style={{ color: "#333" }} />
            </div>}
        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "rgba(124,111,255,0.9)" }}>
            <Play size={14} className="text-white ml-0.5" />
          </div>
        </div>
      </div>
      <div className="px-3 py-2.5">
        <p className="text-xs font-semibold text-white truncate">{item.title}</p>
        {item.genre && <p className="text-[11px] mt-0.5 truncate" style={{ color: "#555" }}>{item.genre}</p>}
      </div>
    </Link>
  );
}

function ReelCard({ item }: { item: Item }) {
  return (
    <Link href={`/reels?id=${item.id}`}
      className="group relative overflow-hidden rounded-xl shrink-0 transition-transform duration-200 hover:scale-[1.03]"
      style={{ width: 96, aspectRatio: "9/16", background: "#111", border: "1px solid #1f1f1f" }}>
      {item.thumbnailUrl
        ? <Image src={item.thumbnailUrl} alt={item.title} fill className="object-cover" />
        : <div className="absolute inset-0 flex items-center justify-center" style={{ background: "#0d0d0d" }}>
            <Play size={18} style={{ color: "#333" }} />
          </div>}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
        style={{ background: "rgba(0,0,0,0.45)" }}>
        <Play size={20} className="text-white" />
      </div>
      {/* Caption */}
      <div className="absolute bottom-0 left-0 right-0 p-2"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)" }}>
        <p className="text-[10px] text-white font-medium truncate">{item.title}</p>
      </div>
    </Link>
  );
}

function MusicCard({ item }: { item: Item }) {
  return (
    <Link href={`/music?id=${item.id}`}
      className="group flex items-center gap-3 p-3 rounded-xl transition-all duration-150"
      style={{ background: "#111", border: "1px solid #1f1f1f", width: 250 }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#161616", e.currentTarget.style.borderColor = "#2a2a2a")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "#111", e.currentTarget.style.borderColor = "#1f1f1f")}>
      <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0"
        style={{ background: "#0d0d0d", border: "1px solid #222" }}>
        {item.thumbnailUrl
          ? <Image src={item.thumbnailUrl} alt={item.title} fill className="object-cover" />
          : <div className="absolute inset-0 flex items-center justify-center">
              <Music size={14} style={{ color: "#333" }} />
            </div>}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-white truncate">{item.title}</p>
        <p className="text-[11px] mt-0.5 truncate" style={{ color: "#555" }}>
          {item.genre || "Song"}
        </p>
      </div>
      <div className="w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-150"
        style={{ background: "rgba(124,111,255,0.15)" }}>
        <Play size={12} style={{ color: "#a89dff" }} className="ml-0.5" />
      </div>
    </Link>
  );
}

export default function ContentRow({ title, items, variant, seeAllHref }: Props) {
  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-white">{title}</h2>
        <Link href={seeAllHref}
          className="flex items-center gap-0.5 text-[11px] font-medium transition-colors"
          style={{ color: "#555" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#a89dff")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}>
          See all <ChevronRight size={13} />
        </Link>
      </div>

      {/* Mobile: horizontal scroll / Desktop: grid */}
      <div className={`scroll-row md:grid md:gap-3
        ${variant === "movie" ? "md:grid-cols-4" : ""}
        ${variant === "reel" ? "md:grid-cols-6" : ""}
        ${variant === "music" ? "md:grid-cols-2" : ""}`}>
        {items.map((item) =>
          variant === "movie" ? <MovieCard key={item.id} item={item} /> :
          variant === "reel" ? <ReelCard key={item.id} item={item} /> :
          <MusicCard key={item.id} item={item} />
        )}
      </div>
    </section>
  );
}
