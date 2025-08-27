import type { Game, Team } from "@prisma/client";
import { Separator } from "@/components/ui/separator";

type PlayoffGame = Game & { homeTeam: Team; awayTeam: Team };

interface PlayoffBracketProps {
  games: PlayoffGame[];
}

const Matchup = ({ game }: { game: PlayoffGame }) => (
    <div className="space-y-2">
        <div className="flex justify-between items-center bg-muted/50 p-2 rounded-t-md">
            <span className="font-semibold text-sm">{game.homeTeam.name}</span>
            <span className="font-bold text-sm">--</span>
        </div>
        <div className="flex justify-between items-center bg-muted/50 p-2 rounded-b-md">
            <span className="font-semibold text-sm">{game.awayTeam.name}</span>
            <span className="font-bold text-sm">--</span>
        </div>
    </div>
);


export function PlayoffBracket({ games }: PlayoffBracketProps) {
  if (games.length === 0) {
    return <p className="text-sm text-muted-foreground">No se han generado partidos de playoffs.</p>;
  }

  // Assuming semi-finals
  const semiFinal1 = games[0];
  const semiFinal2 = games[1];

  return (
    <div className="flex items-center justify-center gap-8">
        {/* Semi-finals column */}
        <div className="space-y-8">
            {semiFinal1 && <Matchup game={semiFinal1} />}
            {semiFinal2 && <Matchup game={semiFinal2} />}
        </div>
        
        {/* Final column (placeholder) */}
        <div className="flex flex-col items-center justify-center">
             <Separator orientation="vertical" className="h-24 w-[1px]" />
        </div>
        <div>
            <div className="space-y-2 bg-primary/10 p-4 rounded-md">
                <div className="flex justify-between items-center p-2 rounded-md">
                    <span className="font-semibold text-sm text-muted-foreground">Ganador SF1</span>
                </div>
                 <div className="flex justify-between items-center p-2 rounded-md">
                    <span className="font-semibold text-sm text-muted-foreground">Ganador SF2</span>
                </div>
            </div>
        </div>
    </div>
  );
}
