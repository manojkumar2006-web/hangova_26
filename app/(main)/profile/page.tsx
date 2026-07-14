"use client";
import Image from "next/image";
import { Settings, Edit2, Grid, Bookmark, Clock, Award } from "lucide-react";
import ContentRow from "@/components/home/ContentRow";
import { MOCK_MOVIES, MOCK_REELS } from "@/lib/mockData";


export default function ProfilePage() {
  return (
    <div className="pb-24 md:pb-8 max-w-5xl mx-auto">
      {/* Profile Header */}
      <div className="relative w-full h-48 md:h-64 bg-[#111]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#7c6fff]/20 to-[#6357e0]/10 border-b border-[#1f1f1f]" />
        
        {/* Actions overlay */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/60 transition-colors">
            <Edit2 size={18} />
          </button>
          <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/60 transition-colors">
            <Settings size={18} />
          </button>
        </div>
      </div>

      <div className="px-6 md:px-10 relative">
        {/* Avatar */}
        <div className="absolute -top-16 md:-top-20">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-[#7c6fff] to-[#5b52cc] flex items-center justify-center font-bold text-white text-5xl md:text-6xl border-4 border-[#080808] shadow-xl">
            A
          </div>
        </div>

        {/* User Info */}
        <div className="pt-20 md:pt-24 mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Alex Chen</h1>
              <p className="text-[#888] font-medium">@alexchen</p>
              
              <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#141414] border border-[#222] text-[#a0a0a0]">
                <Award size={14} className="text-[#fbbf24]" />
                Admin
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <span className="text-xl font-bold text-white">42</span>
                <span className="text-xs text-[#888] uppercase tracking-wider">Uploads</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xl font-bold text-white">128</span>
                <span className="text-xs text-[#888] uppercase tracking-wider">Likes</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xl font-bold text-white">14</span>
                <span className="text-xs text-[#888] uppercase tracking-wider">Playlists</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-[#1f1f1f] mb-8">
          <button className="flex items-center gap-2 pb-4 border-b-2 border-[#7c6fff] text-white font-semibold">
            <Grid size={16} className="text-[#7c6fff]" /> Uploads
          </button>
          <button className="flex items-center gap-2 pb-4 border-b-2 border-transparent text-[#666] hover:text-white font-medium transition-colors">
            <Bookmark size={16} /> Saved
          </button>
          <button className="flex items-center gap-2 pb-4 border-b-2 border-transparent text-[#666] hover:text-white font-medium transition-colors">
            <Clock size={16} /> History
          </button>
        </div>

        {/* Content */}
        <div className="space-y-8">
          <ContentRow title="My Movies" items={MOCK_MOVIES.slice(0, 3)} variant="movie" seeAllHref="#" />
          <ContentRow title="My Reels" items={MOCK_REELS.slice(0, 4)} variant="reel" seeAllHref="#" />
        </div>
      </div>
    </div>
  );
}
