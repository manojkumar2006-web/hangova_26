"use client";

import Link from "next/link";
import { Search, MessageCircle, Sparkles } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  user: { name: string; groupName?: string | null };
}

export default function TopBar({ user }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header className="flex items-center justify-between px-4 md:px-5 h-14 shrink-0 sticky top-0 z-40"
      style={{
        background: "rgba(8,8,8,0.9)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid #161616",
      }}>

      {/* Mobile logo */}
      <Link href="/" className="flex items-center gap-2 md:hidden">
        <div className="w-6 h-6 rounded-lg flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #7c6fff, #5b52cc)" }}>
          <Sparkles size={11} className="text-white" />
        </div>
        <span className="text-base font-black tracking-tight text-white">HANGOVA</span>
      </Link>

      {/* Desktop: greeting */}
      <div className="hidden md:block">
        <p className="text-sm font-medium" style={{ color: "#555" }}>
          Good to see you,{" "}
          <span className="text-white">{user.name.split(" ")[0]}</span>
        </p>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Desktop search */}
        <form onSubmit={handleSearch} className="hidden md:block">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: focused ? "#7c6fff" : "#444" }} />
            <input
              id="topbar-search"
              type="search"
              placeholder="Search content…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className="pl-8 pr-4 py-2 rounded-xl text-sm focus:outline-none transition-all duration-200 w-48"
              style={{
                background: focused ? "#141414" : "#0e0e0e",
                border: `1px solid ${focused ? "rgba(124,111,255,0.4)" : "#1f1f1f"}`,
                color: "#f0f0f0",
              }}
            />
          </div>
        </form>

        {/* Mobile search icon */}
        <Link href="/search"
          className="md:hidden w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-150"
          style={{ background: "#111", border: "1px solid #1f1f1f", color: "#555" }}
          aria-label="Search">
          <Search size={16} />
        </Link>

        {/* Messenger */}
        <Link href="/messenger"
          className="w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-150 relative"
          style={{ background: "#111", border: "1px solid #1f1f1f", color: "#555" }}
          aria-label="Messenger"
          onMouseEnter={(e) => (e.currentTarget.style.color = "#a89dff", e.currentTarget.style.borderColor = "rgba(124,111,255,0.3)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#555", e.currentTarget.style.borderColor = "#1f1f1f")}>
          <MessageCircle size={16} />
        </Link>
      </div>
    </header>
  );
}
