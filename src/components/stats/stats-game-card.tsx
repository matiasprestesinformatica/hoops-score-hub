"use client";

import { useRouter } from "next/navigation";
import type { Game } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormattedDate } from "../formatted-date";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitials } from "@/lib/utils";

interface StatsGameCardProps {
  game: Game;
  teamAScore: number;
  teamBScore: number;
}

export function StatsGameCard({ game, teamAScore, teamBScore }: StatsGameCardProps) {
  const router = useRouter();

  const handleViewStats = () => {
    router.push(`/stats/${game.id}`);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-card border border-border transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="space-y-1.5">
          <CardTitle className="text-2xl text-foreground">{game.teamA.name} vs {game.teamB.name}</CardTitle>
          <CardDescription className="text-muted-foreground">
            Jugado el: <FormattedDate dateString={game.createdAt} />
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex items-center justify-around">
        <div className="flex flex-col items-center gap-2 text-center">
            <Avatar className="w-16 h-16">
                <AvatarImage src={game.teamA.logoUrl ?? undefined} alt={game.teamA.name} />
                <AvatarFallback>{getInitials(game.teamA.name)}</AvatarFallback>
            </Avatar>
            <p className="text-lg font-semibold text-muted-foreground">{game.teamA.name}</p>
            <p className="text-6xl font-bold text-primary">{teamAScore}</p>
        </div>
        <div className="text-4xl font-light text-muted-foreground">vs</div>
         <div className="flex flex-col items-center gap-2 text-center">
            <Avatar className="w-16 h-16">
                <AvatarImage src={game.teamB.logoUrl ?? undefined} alt={game.teamB.name} />
                <AvatarFallback>{getInitials(game.teamB.name)}</AvatarFallback>
            </Avatar>
            <p className="text-lg font-semibold text-muted-foreground">{game.teamB.name}</p>
            <p className="text-6xl font-bold text-foreground">{teamBScore}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleViewStats}>Ver Estadísticas</Button>
      </CardFooter>
    </Card>
  );
}
