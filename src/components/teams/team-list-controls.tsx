"use client";

import { useState, useMemo } from 'react';
import type { TeamWithStats } from '@/lib/actions/stats';
import { Button } from '@/components/ui/button';
import { TeamCard } from './team-card';
import { ArrowDown, ArrowUp } from 'lucide-react';

type SortKey = 'name' | 'wins' | 'losses';
type SortDirection = 'asc' | 'desc';

interface TeamListControlsProps {
  teams: TeamWithStats[];
}

export function TeamListControls({ teams }: TeamListControlsProps) {
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const sortedTeams = useMemo(() => {
    const sorted = [...teams].sort((a, b) => {
      if (a[sortKey] < b[sortKey]) return -1;
      if (a[sortKey] > b[sortKey]) return 1;
      return 0;
    });

    if (sortDirection === 'desc') {
      return sorted.reverse();
    }
    return sorted;
  }, [teams, sortKey, sortDirection]);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };
  
  const SortButton = ({ sortValue, label }: { sortValue: SortKey, label: string }) => {
    const isActive = sortKey === sortValue;
    return (
        <Button
            variant={isActive ? 'default' : 'outline'}
            onClick={() => handleSort(sortValue)}
        >
            {label}
            {isActive && (
                sortDirection === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />
            )}
        </Button>
    )
  }

  return (
    <div className="space-y-6">
        <div className="flex justify-center items-center gap-4 p-4 rounded-lg bg-card border">
            <span className="text-sm font-medium text-muted-foreground">Ordenar por:</span>
            <SortButton sortValue="name" label="Nombre" />
            <SortButton sortValue="wins" label="Victorias" />
            <SortButton sortValue="losses" label="Derrotas" />
        </div>

        {sortedTeams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedTeams.map((team) => (
                <TeamCard key={team.id} team={team} />
            ))}
            </div>
        ) : (
            <div className="text-center py-16 border-2 border-dashed border-border rounded-lg bg-card">
            <p className="text-muted-foreground">
                No se han encontrado equipos. Añade algunos desde el panel de administración.
            </p>
            </div>
        )}
    </div>
  );
}
