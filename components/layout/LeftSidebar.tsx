"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Film, Music, Play, MessageCircle, User, Zap, LogOut, Sparkles } from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/movies", icon: Film, label: "Movies" },
  { href: "/reels", icon: Play, label: "Reels" },
  { href: "/music", icon: Music, label: "Music" },
  { href: "/messenger", icon: MessageCircle, label: "Messenger" },
  { href: "/profile", icon: User, label: "Profile" },
];

interface Props {
  user: { name: string; username: string; avatarUrl?: string | null; isAdmin: boolean; groupName?: string | null };
}

export default function LeftSidebar({ user }: Props) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-56 shrink-0"
      style={{ borderRight: "1px solid #161616", background: "#080808" }}>

      {/* Logo */}
      <div className="px-5 pt-5 pb-4" style={{ borderBottom: "1px solid #161616" }}>
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg, #7c6fff, #5b52cc)" }}>
            <Sparkles size={13} className="text-white" />
          </div>
          <span className="text-lg font-black tracking-tight text-white">HANGOVA</span>
        </Link>
        {user.groupName && (
          <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium"
            style={{ background: "rgba(124,111,255,0.08)", color: "#7c6fff", border: "1px solid rgba(124,111,255,0.15)" }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#7c6fff" }} />
            {user.groupName}
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2.5 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link key={href} href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 group"
              style={{
                background: active ? "rgba(124,111,255,0.1)" : "transparent",
                color: active ? "#a89dff" : "#555",
                border: active ? "1px solid rgba(124,111,255,0.12)" : "1px solid transparent",
              }}
              onMouseEnter={(e) => !active && (e.currentTarget.style.color = "#ccc", e.currentTarget.style.background = "#111")}
              onMouseLeave={(e) => !active && (e.currentTarget.style.color = "#555", e.currentTarget.style.background = "transparent")}>
              <Icon size={16} strokeWidth={active ? 2.5 : 1.8} />
              {label}
              {active && <div className="ml-auto w-1 h-1 rounded-full" style={{ background: "#7c6fff" }} />}
            </Link>
          );
        })}

        {user.isAdmin && (
          <>
            <div className="my-2 mx-3 h-px" style={{ background: "#161616" }} />
            <Link href="/admin"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150"
              style={{
                color: pathname.startsWith("/admin") ? "#fbbf24" : "#555",
                background: pathname.startsWith("/admin") ? "rgba(251,191,36,0.08)" : "transparent",
                border: pathname.startsWith("/admin") ? "1px solid rgba(251,191,36,0.12)" : "1px solid transparent",
              }}
              onMouseEnter={(e) => !pathname.startsWith("/admin") && (e.currentTarget.style.color = "#ccc", e.currentTarget.style.background = "#111")}
              onMouseLeave={(e) => !pathname.startsWith("/admin") && (e.currentTarget.style.color = "#555", e.currentTarget.style.background = "transparent")}>
              <Zap size={16} strokeWidth={1.8} />
              Admin
            </Link>
          </>
        )}
      </nav>

      {/* User footer */}
      <div className="px-2.5 py-3" style={{ borderTop: "1px solid #161616" }}>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl group cursor-pointer transition-all duration-150"
          style={{ border: "1px solid transparent" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#111", e.currentTarget.style.borderColor = "#1f1f1f")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent", e.currentTarget.style.borderColor = "transparent")}>
          <div className="w-7 h-7 rounded-lg overflow-hidden shrink-0 flex items-center justify-center text-xs font-bold"
            style={{ background: "linear-gradient(135deg, #7c6fff, #5b52cc)", color: "white" }}>
            {user.avatarUrl
              ? <Image src={user.avatarUrl} alt={user.name} width={28} height={28} className="object-cover" />
              : user.name[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{user.name}</p>
            <p className="text-[11px] truncate" style={{ color: "#555" }}>@{user.username}</p>
          </div>
          <button onClick={() => signOut({ callbackUrl: "/login" })}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg"
            style={{ color: "#555" }}
            title="Sign out"
            onMouseEnter={(e) => (e.currentTarget.style.color = "#f87171")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}>
            <LogOut size={13} />
          </button>
        </div>
      </div>
    </aside>
  );
}
