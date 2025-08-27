'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FixtureTable } from './_components/fixture-table';
import { FixtureActions } from './_components/fixture-actions';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { Game, Season, Team } from '@prisma/client';

type FixtureWithTeams = Game & { homeTeam: Team; awayTeam: Team };

interface FixturePageClientProps {
  season: Season;
  fixtures: FixtureWithTeams[];
}

export default function FixturePageClient({ season, fixtures }: FixturePageClientProps) {
  const [selectedGameIds, setSelectedGameIds] = useState<string[]>([]);
  const scheduledGames = fixtures.filter(g => g.status === 'Programado');
  const isAllSelected = selectedGameIds.length > 0 && selectedGameIds.length === scheduledGames.length;

  const handleSelectionChange = (gameId: string, isSelected: boolean) => {
    setSelectedGameIds(prev => {
      if (isSelected) {
        return [...prev, gameId];
      } else {
        return prev.filter(id => id !== gameId);
      }
    });
  };

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedGameIds(scheduledGames.map(g => g.id));
    } else {
      setSelectedGameIds([]);
    }
  }

  return (
    <div>
      <Button asChild variant="outline" className="mb-4">
        <Link href={`/admin/temporadas/${season.id}/equipos`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a la Gestión de Equipos
        </Link>
      </Button>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Fixture de la Temporada: {season.name}
        </h1>
        <p className="text-muted-foreground mt-2">
          Lista de todos los partidos generados para esta temporada.
        </p>
      </div>

      <Card>
        <CardContent className="p-4">
          <FixtureActions 
            seasonId={season.id} 
            selectedGameIds={selectedGameIds} 
            onClearSelection={() => setSelectedGameIds([])}
          />
          <FixtureTable 
            fixtures={fixtures} 
            selectedGameIds={selectedGameIds}
            onSelectionChange={handleSelectionChange}
            onSelectAll={handleSelectAll}
            isAllSelected={isAllSelected}
          />
        </CardContent>
      </Card>
    </div>
  );
}
