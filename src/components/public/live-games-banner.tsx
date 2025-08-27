import { getLiveGames } from "@/lib/actions/game";
import { PublicScoreboard } from "../public-scoreboard";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
import { calculateScore } from "@/lib/utils";

export async function LiveGamesBanner() {
  const liveGames = await getLiveGames();

  if (!liveGames || liveGames.length === 0) {
    return null;
  }

  return (
    <div className="bg-card border-b py-2">
      <div className="container mx-auto">
        <Carousel
          opts={{
            align: "start",
            loop: liveGames.length > 4, // Loop only if there are enough items to scroll
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2">
            {liveGames.map((game) => {
              const homeScore = calculateScore(game.teamA.players);
              const awayScore = calculateScore(game.teamB.players);
              return (
                <CarouselItem key={game.id} className="pl-2 basis-auto">
                  <PublicScoreboard game={game} homeScore={homeScore} awayScore={awayScore} />
                </CarouselItem>
              )
            })}
          </CarouselContent>
          <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8" />
          <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8" />
        </Carousel>
      </div>
    </div>
  );
}
