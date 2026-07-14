import { Search, Edit, MoreVertical, Phone, Video, Smile, Paperclip, Send } from "lucide-react";
import { MOCK_CONVOS, MOCK_MESSAGES } from "@/lib/mockData";


export default function MessengerPage() {
  const activeConvo = MOCK_CONVOS[0];

  return (
    <div className="flex h-[calc(100dvh-56px)] md:h-[calc(100dvh-56px)] overflow-hidden">
      
      {/* Left Sidebar - Chat List */}
      <div className="w-full md:w-80 flex-shrink-0 flex flex-col border-r border-[#161616] bg-[#0a0a0a]">
        <div className="p-4 border-b border-[#161616] flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Messages</h2>
          <button className="w-8 h-8 rounded-full bg-[#111] hover:bg-[#1f1f1f] flex items-center justify-center transition-colors">
            <Edit size={16} className="text-[#a0a0a0]" />
          </button>
        </div>
        
        <div className="p-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
            <input 
              type="text" 
              placeholder="Search messages..." 
              className="w-full bg-[#111] border border-[#1f1f1f] rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-[#7c6fff]/50 transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2">
          {MOCK_CONVOS.map(convo => (
            <div key={convo.id} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${convo.id === activeConvo.id ? 'bg-[#141414] border border-[#222]' : 'hover:bg-[#111] border border-transparent'}`}>
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7c6fff] to-[#5b52cc] flex items-center justify-center font-bold text-white shadow-sm">
                  {convo.isGroup ? '🔥' : convo.name[0]}
                </div>
                {convo.unread > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#7c6fff] border-2 border-[#0a0a0a] flex items-center justify-center text-[10px] font-bold text-white">
                    {convo.unread}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <p className="text-sm font-semibold text-white truncate">{convo.name}</p>
                  <span className={`text-[10px] ${convo.unread > 0 ? 'text-[#7c6fff] font-bold' : 'text-[#555]'}`}>{convo.time}</span>
                </div>
                <p className={`text-xs truncate ${convo.unread > 0 ? 'text-[#ddd] font-medium' : 'text-[#888]'}`}>{convo.last}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Area - Active Chat (Hidden on mobile by default) */}
      <div className="hidden md:flex flex-col flex-1 bg-[#080808]">
        {/* Chat Header */}
        <div className="h-16 px-6 border-b border-[#161616] flex items-center justify-between shrink-0 bg-[#0a0a0a]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7c6fff] to-[#5b52cc] flex items-center justify-center font-bold text-white shadow-sm">
              {activeConvo.isGroup ? '🔥' : activeConvo.name[0]}
            </div>
            <div>
              <h3 className="text-base font-semibold text-white leading-tight">{activeConvo.name}</h3>
              <p className="text-xs text-[#7c6fff]">3 online</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[#a0a0a0]">
            <button className="w-10 h-10 rounded-full hover:bg-[#111] flex items-center justify-center transition-colors"><Phone size={18} /></button>
            <button className="w-10 h-10 rounded-full hover:bg-[#111] flex items-center justify-center transition-colors"><Video size={18} /></button>
            <button className="w-10 h-10 rounded-full hover:bg-[#111] flex items-center justify-center transition-colors"><MoreVertical size={18} /></button>
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="text-center">
            <span className="text-xs font-medium text-[#555] bg-[#111] px-3 py-1 rounded-full border border-[#1f1f1f]">Today</span>
          </div>
          
          {MOCK_MESSAGES.map(msg => (
            <div key={msg.id} className={`flex gap-3 ${msg.isMe ? 'flex-row-reverse' : ''}`}>
              {!msg.isMe && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7c6fff] to-[#5b52cc] flex items-center justify-center font-bold text-white text-xs shrink-0 mt-auto">
                  {msg.avatar}
                </div>
              )}
              <div className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'} max-w-[70%]`}>
                {!msg.isMe && <span className="text-[10px] text-[#888] ml-1 mb-1">{msg.user}</span>}
                <div className={`px-4 py-2.5 rounded-2xl text-sm ${msg.isMe ? 'bg-[#7c6fff] text-white rounded-br-sm' : 'bg-[#181818] border border-[#222] text-[#eee] rounded-bl-sm'}`}>
                  {msg.text}
                </div>
                <span className="text-[10px] text-[#555] mt-1 mx-1">{msg.time}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 bg-[#0a0a0a] border-t border-[#161616]">
          <div className="flex items-center gap-2 bg-[#111] border border-[#222] rounded-full px-2 py-1.5 focus-within:border-[#7c6fff]/50 focus-within:bg-[#141414] transition-colors">
            <button className="w-9 h-9 rounded-full flex items-center justify-center text-[#888] hover:text-white transition-colors">
              <Smile size={20} />
            </button>
            <button className="w-9 h-9 rounded-full flex items-center justify-center text-[#888] hover:text-white transition-colors">
              <Paperclip size={20} />
            </button>
            <input 
              type="text" 
              placeholder="Message The Boys 🔥..." 
              className="flex-1 bg-transparent text-sm text-white placeholder-[#666] focus:outline-none px-2 py-2"
            />
            <button className="w-9 h-9 rounded-full bg-[#7c6fff] flex items-center justify-center text-white hover:bg-[#8d82ff] transition-colors shadow-sm">
              <Send size={16} className="ml-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
