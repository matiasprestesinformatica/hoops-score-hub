"use client";

import type { Game, Team } from "@prisma/client";
import { FixtureCard } from "./fixture-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "../ui/card";

type GameWithTeams = Game & { homeTeam: Team; awayTeam: Team };

interface FixtureListProps {
  games: GameWithTeams[] | null;
}

export function FixtureList({ games }: FixtureListProps) {
  // Add a guard clause to handle null or empty games array
  if (!games || games.length === 0) {
    return (
        <Card>
            <CardContent className="pt-6">
                <p className="text-muted-foreground text-center">No hay partidos programados.</p>
            </CardContent>
        </Card>
    );
  }

  const upcomingGamesByDate = games
    .filter(game => game.status === 'Programado' && game.date)
    .sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime())
    .reduce((acc, game) => {
      const dateStr = new Date(game.date!).toDateString();
      if (!acc[dateStr]) {
        acc[dateStr] = [];
      }
      acc[dateStr].push(game);
      return acc;
    }, {} as Record<string, GameWithTeams[]>);

  const upcomingMatchdays = Object.values(upcomingGamesByDate);
  const nextMatchday = upcomingMatchdays[0] || [];
  const followingMatchday = upcomingMatchdays[1] || [];

  if (nextMatchday.length === 0) {
     return (
        <Card>
            <CardContent className="pt-6">
                <p className="text-muted-foreground text-center">No hay más partidos programados.</p>
            </CardContent>
        </Card>
    );
  }

  return (
    <Tabs defaultValue="next">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="next">Próxima Fecha</TabsTrigger>
        {followingMatchday.length > 0 && (
          <TabsTrigger value="following">Siguiente Fecha</TabsTrigger>
        )}
      </TabsList>
      <TabsContent value="next">
        <div className="space-y-4 mt-4">
          {nextMatchday.map(game => (
            <FixtureCard key={game.id} game={game} />
          ))}
        </div>
      </TabsContent>
      {followingMatchday.length > 0 && (
        <TabsContent value="following">
            <div className="space-y-4 mt-4">
                {followingMatchday.map(game => (
                    <FixtureCard key={game.id} game={game} />
                ))}
            </div>
        </TabsContent>
      )}
    </Tabs>
  );
}