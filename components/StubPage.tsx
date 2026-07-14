const stubs = [
  { href: "/movies", label: "Movies", emoji: "🎬", desc: "Watch movies with your crew. Full Hotstar-style catalog coming in Phase 4." },
  { href: "/reels", label: "Reels", emoji: "⚡", desc: "Swipe through vertical clips. Instagram-style feed coming in Phase 5." },
  { href: "/music", label: "Music", emoji: "🎵", desc: "Listen together. Spotify-style player coming in Phase 6." },
  { href: "/messenger", label: "Messenger", emoji: "💬", desc: "Real-time crew chat. Supabase Realtime coming in Phase 9." },
  { href: "/profile", label: "Profile", emoji: "👤", desc: "Your stats, uploads, and playlists coming in Phase 11." },
];

export function StubPage({ label, emoji, desc }: { label: string; emoji: string; desc: string }) {
  return (
    <div className="px-4 md:px-5 py-6 pb-24 md:pb-8">
      <h1 className="text-lg font-bold text-white mb-6">{label}</h1>
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 text-2xl"
          style={{ background: "rgba(124,111,255,0.08)", border: "1px solid rgba(124,111,255,0.12)" }}>
          {emoji}
        </div>
        <h2 className="text-sm font-semibold text-white mb-2">Coming soon</h2>
        <p className="text-sm max-w-xs leading-relaxed" style={{ color: "#555" }}>{desc}</p>
      </div>
    </div>
  );
}
