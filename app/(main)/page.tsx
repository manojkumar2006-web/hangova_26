import ScheduledDropBanner from "@/components/home/ScheduledDropBanner";
import HeroCard from "@/components/home/HeroCard";
import ContentRow from "@/components/home/ContentRow";
import CategoryPills from "@/components/home/CategoryPills";
import { MOCK_MOVIES, MOCK_REELS, MOCK_SONGS } from "@/lib/mockData";

export default function HomePage() {
  const heroContent = MOCK_MOVIES[0];
  const scheduledDrop = { title: "Dune: Part Two Premiere", dropAt: new Date(Date.now() + 3600000 * 4), id: "d1" };

  return (
    <div className="pb-24 md:pb-8">
      <ScheduledDropBanner title={scheduledDrop.title} dropAt={scheduledDrop.dropAt} dropId={scheduledDrop.id} />

      <div className="px-4 md:px-5 py-5 space-y-6">
        <HeroCard content={heroContent} progress={65} isResume={true} />
        <CategoryPills />
        <ContentRow title="Continue Watching" items={MOCK_MOVIES.slice(0, 4)} variant="movie" seeAllHref="/movies" />
        <ContentRow title="Trending Movies" items={MOCK_MOVIES.slice(4)} variant="movie" seeAllHref="/movies" />
        <ContentRow title="Latest Reels" items={MOCK_REELS} variant="reel" seeAllHref="/reels" />
        <ContentRow title="Crew Playlists" items={MOCK_SONGS} variant="music" seeAllHref="/music" />
      </div>
    </div>
  );
}
