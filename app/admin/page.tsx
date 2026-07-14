import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  description: "HANGOVA admin panel",
};

export default function AdminPage() {
  return (
    <div className="px-4 md:px-6 py-6 pb-20 md:pb-6">
      <h1 className="text-2xl font-bold text-white mb-2">Admin Panel</h1>
      <p className="text-[#a0a0a0] text-sm mb-8">Full admin panel coming in Phase 12</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: "👥", label: "Groups", desc: "Manage crews and invite codes", href: "/admin/groups" },
          { icon: "🎬", label: "Content", desc: "Upload and manage content", href: "/admin/content" },
          { icon: "⏰", label: "Scheduled Drops", desc: "Schedule premieres and drops", href: "/admin/drops" },
        ].map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-5 hover:border-[#3a3a3a] hover:bg-[#1e1e1e] transition-all duration-150 block"
          >
            <div className="text-3xl mb-3">{item.icon}</div>
            <h3 className="text-white font-semibold mb-1">{item.label}</h3>
            <p className="text-[#a0a0a0] text-sm">{item.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
