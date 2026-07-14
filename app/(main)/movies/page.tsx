"use client";
import HeroCard from "@/components/home/HeroCard";
import ContentRow from "@/components/home/ContentRow";
import { MOCK_MOVIES } from "@/lib/mockData";


export default function MoviesPage() {
  const featured = MOCK_MOVIES[1]; // Dune
  const continueWatching = MOCK_MOVIES.filter(m => m.progress > 0);
  const trending = MOCK_MOVIES.filter(m => m.progress === 0);

  return (
    <div className="pb-24 md:pb-8">
      <div className="px-4 md:px-5 py-5 space-y-8">
        <section>
          <h1 className="text-2xl font-bold text-white mb-4">Movies</h1>
          <HeroCard content={featured} progress={0} isResume={false} />
        </section>

        {continueWatching.length > 0 && (
          <ContentRow title="Continue Watching" items={continueWatching} variant="movie" seeAllHref="/movies" />
        )}
        <ContentRow title="Trending in Your Crew" items={trending} variant="movie" seeAllHref="/movies" />
        <ContentRow title="Recently Added" items={MOCK_MOVIES} variant="movie" seeAllHref="/movies" />
      </div>
    </div>
  );
}
