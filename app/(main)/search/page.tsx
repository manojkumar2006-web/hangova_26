import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search",
  description: "Search HANGOVA content",
};

export default function SearchPage() {
  return (
    <div className="px-4 md:px-6 py-6 pb-20 md:pb-6">
      <h1 className="text-2xl font-bold text-white mb-6">Search</h1>
      <div className="flex items-center justify-center py-20 text-center">
        <div>
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-[#a0a0a0]">Search — coming soon</p>
        </div>
      </div>
    </div>
  );
}
