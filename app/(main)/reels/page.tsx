"use client";
import { useState } from "react";
import Image from "next/image";
import { Heart, MessageCircle, Share2, MoreVertical, Music } from "lucide-react";
import { MOCK_REELS } from "@/lib/mockData";

export default function ReelsPage() {
  return (
    <div className="reels-wrap bg-black">
      {MOCK_REELS.map((reel) => (
        <div key={reel.id} className="reel-slide flex justify-center items-center bg-black relative">
          
          {/* Mobile full-bleed, Desktop constrained aspect ratio */}
          <div className="w-full h-full md:w-[400px] md:h-[80%] md:rounded-2xl overflow-hidden relative" style={{ background: "#111" }}>
            <Image src={reel.thumbnailUrl} alt={reel.title} fill className="object-cover" />
            
            {/* Dark gradient for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

            {/* Right side interactions */}
            <div className="absolute right-4 bottom-24 flex flex-col items-center gap-6 z-10">
              <div className="flex flex-col items-center gap-1">
                <button className="w-12 h-12 rounded-full flex items-center justify-center bg-black/40 backdrop-blur-md text-white hover:text-red-500 transition-colors">
                  <Heart size={24} />
                </button>
                <span className="text-white text-xs font-semibold drop-shadow-md">{reel.likes}</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <button className="w-12 h-12 rounded-full flex items-center justify-center bg-black/40 backdrop-blur-md text-white hover:text-blue-400 transition-colors">
                  <MessageCircle size={24} />
                </button>
                <span className="text-white text-xs font-semibold drop-shadow-md">{reel.comments}</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <button className="w-12 h-12 rounded-full flex items-center justify-center bg-black/40 backdrop-blur-md text-white hover:text-green-400 transition-colors">
                  <Share2 size={24} />
                </button>
                <span className="text-white text-xs font-semibold drop-shadow-md">Share</span>
              </div>
              <button className="w-10 h-10 rounded-full flex items-center justify-center text-white drop-shadow-md">
                <MoreVertical size={24} />
              </button>
            </div>

            {/* Bottom info */}
            <div className="absolute left-4 bottom-4 right-20 z-10">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7c6fff] to-[#5b52cc] flex items-center justify-center font-bold text-white shadow-lg border border-white/20">
                  {reel.avatar}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm drop-shadow-md">@{reel.user}</p>
                </div>
                <button className="ml-2 px-3 py-1 rounded-full border border-white/40 text-white text-xs font-semibold backdrop-blur-sm">Follow</button>
              </div>
              <p className="text-white text-sm drop-shadow-md line-clamp-2">{reel.title}</p>
              
              {/* Music ticker */}
              <div className="flex items-center gap-2 mt-3 p-2 bg-black/30 backdrop-blur-md rounded-full w-fit max-w-full">
                <Music size={14} className="text-white shrink-0 animate-spin-slow" />
                <p className="text-xs text-white truncate w-32 md:w-48">Original Audio - @{reel.user}</p>
              </div>
            </div>

          </div>
        </div>
      ))}
    </div>
  );
}
