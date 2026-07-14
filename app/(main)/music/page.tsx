import Image from "next/image";
import { Play, Heart, MoreHorizontal, Clock, Shuffle, Repeat, SkipBack, SkipForward } from "lucide-react";
import { MOCK_SONGS, MOCK_PLAYLISTS } from "@/lib/mockData";

export const metadata = { title: "Music" };

export default function MusicPage() {
  return (
    <div className="pb-32 md:pb-24">
      <div className="px-4 md:px-6 py-6 space-y-8">
        <h1 className="text-2xl font-bold text-white">Music</h1>
        
        {/* Playlists Row */}
        <section>
          <h2 className="text-sm font-bold text-white mb-4">Crew Playlists</h2>
          <div className="scroll-row">
            {MOCK_PLAYLISTS.map(playlist => (
              <div key={playlist.id} className="group w-32 shrink-0 p-3 rounded-xl bg-[#111] border border-[#1f1f1f] hover:bg-[#161616] transition-colors cursor-pointer">
                <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-3">
                   <Image src={playlist.thumbnailUrl} alt={playlist.name} fill className="object-cover" />
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                     <div className="w-10 h-10 rounded-full bg-[#7c6fff] flex items-center justify-center shadow-lg">
                       <Play size={20} className="text-white ml-1" />
                     </div>
                   </div>
                </div>
                <h3 className="text-sm font-semibold text-white truncate">{playlist.name}</h3>
                <p className="text-xs text-[#888] mt-1">{playlist.count} songs</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tracks List */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white">Recently Added</h2>
            <button className="text-xs text-[#7c6fff] font-semibold hover:text-[#a89dff]">Play All</button>
          </div>
          
          <div className="w-full">
            {/* Table Header */}
            <div className="grid grid-cols-[40px_1fr_auto_auto] gap-4 px-4 py-2 text-xs font-semibold text-[#888] border-b border-[#1f1f1f] mb-2">
              <div className="text-center">#</div>
              <div>Title</div>
              <div className="w-12 text-center"><Clock size={14} className="mx-auto" /></div>
              <div className="w-8"></div>
            </div>

            {/* Tracks */}
            {MOCK_SONGS.map((song, index) => (
              <div key={song.id} className="group grid grid-cols-[40px_1fr_auto_auto] gap-4 items-center px-4 py-2.5 rounded-xl hover:bg-[#111] transition-colors cursor-pointer">
                <div className="text-[#888] text-center text-sm group-hover:hidden">{index + 1}</div>
                <div className="hidden group-hover:flex justify-center text-white"><Play size={14} /></div>
                
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="relative w-10 h-10 rounded overflow-hidden shrink-0">
                     <Image src={song.thumbnailUrl} alt={song.title} fill className="object-cover" />
                  </div>
                  <div className="truncate">
                    <p className="text-sm font-semibold text-white truncate group-hover:text-[#7c6fff] transition-colors">{song.title}</p>
                    <p className="text-xs text-[#888] truncate">{song.artist}</p>
                  </div>
                </div>
                
                <div className="text-xs text-[#888] w-12 text-center">{song.duration}</div>
                <div className="w-8 flex justify-center text-[#555] group-hover:text-white transition-colors">
                  <MoreHorizontal size={18} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Floating Now Playing Bar */}
      <div className="fixed bottom-14 md:bottom-0 left-0 md:left-56 right-0 h-20 bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-[#1f1f1f] flex items-center justify-between px-4 md:px-6 z-40">
        <div className="flex items-center gap-3 w-1/3 min-w-0">
          <div className="relative w-12 h-12 rounded-md overflow-hidden shrink-0">
            <Image src={MOCK_SONGS[0].thumbnailUrl} alt="Now Playing" fill className="object-cover" />
          </div>
          <div className="truncate">
            <p className="text-sm font-semibold text-white truncate">{MOCK_SONGS[0].title}</p>
            <p className="text-xs text-[#888] truncate">{MOCK_SONGS[0].artist}</p>
          </div>
          <Heart size={16} className="text-[#555] hover:text-white ml-2 cursor-pointer shrink-0" />
        </div>

        <div className="flex flex-col items-center justify-center w-1/3">
          <div className="flex items-center gap-4 md:gap-6 mb-1">
            <Shuffle size={16} className="text-[#555] hover:text-white cursor-pointer hidden md:block" />
            <SkipBack size={20} className="text-[#a0a0a0] hover:text-white cursor-pointer fill-current" />
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
              <Play size={16} className="text-black ml-1 fill-current" />
            </div>
            <SkipForward size={20} className="text-[#a0a0a0] hover:text-white cursor-pointer fill-current" />
            <Repeat size={16} className="text-[#555] hover:text-white cursor-pointer hidden md:block" />
          </div>
          <div className="hidden md:flex items-center gap-2 w-full max-w-md">
            <span className="text-[10px] text-[#888]">0:00</span>
            <div className="h-1 flex-1 bg-[#222] rounded-full overflow-hidden">
               <div className="h-full bg-[#7c6fff] w-1/3 rounded-full relative">
                 <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full opacity-0 hover:opacity-100 cursor-pointer"></div>
               </div>
            </div>
            <span className="text-[10px] text-[#888]">{MOCK_SONGS[0].duration}</span>
          </div>
        </div>
        
        <div className="w-1/3 flex justify-end">
           {/* Volume controls could go here on desktop */}
        </div>
      </div>
    </div>
  );
}
