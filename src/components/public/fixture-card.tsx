"use client";

import type { Game, Team } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitials } from "@/lib/utils";
import { FormattedDate } from "../partidos/formatted-date";

type GameWithTeams = Game & { homeTeam: Team; awayTeam: Team };

interface FixtureCardProps {
  game: GameWithTeams;
  subtitle?: string;
}

const TeamRow = ({ team, score }: { team: Team, score: number | null }) => (
    <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8 border">
            <AvatarImage src={team.logoUrl ?? undefined} />
            <AvatarFallback>{getInitials(team.name)}</AvatarFallback>
        </Avatar>
        <span className="font-semibold text-card-foreground flex-1 truncate">{team.name}</span>
        <span className="font-bold text-lg font-mono">{score}</span>
    </div>
);

export function FixtureCard({ game, subtitle }: FixtureCardProps) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground p-4 space-y-3">
        {subtitle && <p className="text-xs font-semibold text-primary uppercase tracking-wider">{subtitle}</p>}
        <TeamRow team={game.homeTeam} score={game.homeScore} />
        <TeamRow team={game.awayTeam} score={game.awayScore} />
        <div className="text-center text-xs text-muted-foreground pt-2 border-t">
            <FormattedDate dateString={game.date?.toISOString() || game.createdAt.toISOString()} formatString="eeee dd/MM/yyyy - HH:mm" />
        </div>
    </div>
  );
}
