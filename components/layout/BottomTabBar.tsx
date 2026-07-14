"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Film, Music, Play, User } from "lucide-react";

const tabs = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/movies", icon: Film, label: "Movies" },
  { href: "/reels", icon: Play, label: "Reels" },
  { href: "/music", icon: Music, label: "Music" },
  { href: "/profile", icon: User, label: "Profile" },
];

export default function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: "rgba(8,8,8,0.92)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid #161616",
      }}>
      <div className="flex items-center justify-around px-1 py-2 pb-safe">
        {tabs.map(({ href, icon: Icon, label }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link key={href} href={href}
              className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-150 relative"
              style={{ minWidth: 56 }}>
              {active && (
                <span className="absolute top-1 inset-x-2 h-0.5 rounded-full"
                  style={{ background: "#7c6fff" }} />
              )}
              <Icon size={21} strokeWidth={active ? 2.5 : 1.5}
                style={{ color: active ? "#a89dff" : "#444" }} />
              <span className="text-[10px] font-medium"
                style={{ color: active ? "#a89dff" : "#444" }}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
