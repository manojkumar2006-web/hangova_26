"use client";

import { useState } from "react";
import { Copy, Check, Plus, Loader2 } from "lucide-react";

interface Group {
  id: string;
  name: string;
  code: string;
  isPublic: boolean;
  createdAt: string;
  _count: { members: number; content: number };
}

export default function AdminGroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  const loadGroups = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/groups");
      const data = await res.json();
      setGroups(data.groups ?? []);
      setLoaded(true);
    } finally {
      setLoading(false);
    }
  };

  if (!loaded && !loading) loadGroups();

  const createGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newGroupName.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setGroups((prev) => [data.group, ...prev]);
        setNewGroupName("");
      }
    } finally {
      setCreating(false);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="px-4 md:px-6 py-6">
      <h1 className="text-2xl font-bold text-white mb-2">Groups</h1>
      <p className="text-[#a0a0a0] text-sm mb-6">Manage crews and invite codes</p>

      {/* Create group form */}
      <form onSubmit={createGroup} className="flex gap-3 mb-8">
        <input
          id="new-group-name"
          type="text"
          placeholder="New group name..."
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          className="flex-1 bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder-[#606060] focus:outline-none focus:border-[#6c63ff] transition-colors text-sm"
        />
        <button
          id="create-group-btn"
          type="submit"
          disabled={creating || !newGroupName.trim()}
          className="flex items-center gap-2 bg-[#6c63ff] hover:bg-[#857dff] disabled:opacity-50 text-white font-semibold px-5 py-3 rounded-xl transition-colors text-sm"
        >
          {creating ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
          Create
        </button>
      </form>

      {/* Groups list */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={20} className="animate-spin text-[#6c63ff]" />
        </div>
      ) : (
        <div className="space-y-3">
          {groups.map((group) => (
            <div
              key={group.id}
              className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-4 flex items-center justify-between gap-4"
            >
              <div>
                <h3 className="text-white font-semibold">{group.name}</h3>
                <p className="text-[#a0a0a0] text-xs mt-0.5">
                  {group._count.members} member{group._count.members !== 1 ? "s" : ""} ·{" "}
                  {group._count.content} items
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="font-mono text-sm bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-[#6c63ff] tracking-wider">
                  {group.code}
                </div>
                <button
                  onClick={() => copyCode(group.code)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#1e1e1e] border border-[#2a2a2a] text-[#a0a0a0] hover:text-white transition-colors"
                  title="Copy invite code"
                >
                  {copiedCode === group.code ? (
                    <Check size={15} className="text-green-400" />
                  ) : (
                    <Copy size={15} />
                  )}
                </button>
              </div>
            </div>
          ))}

          {groups.length === 0 && !loading && (
            <div className="text-center py-12 text-[#a0a0a0]">
              No groups yet. Create one above.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
