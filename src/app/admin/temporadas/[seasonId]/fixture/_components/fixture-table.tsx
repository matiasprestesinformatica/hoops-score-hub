'use client';

import { useState, useTransition } from 'react';
import type { Game, Team } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { Edit } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { FormattedDate } from '@/components/partidos/formatted-date';
import { updateGameDate, updateGameStatusInFixture } from '@/lib/actions/seasons';
import { toast } from '@/hooks/use-toast';
import type { GameStatus } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

type FixtureWithTeams = Game & { homeTeam: Team; awayTeam: Team };

interface FixtureTableProps {
  fixtures: FixtureWithTeams[];
  selectedGameIds: string[];
  onSelectionChange: (gameId: string, isSelected: boolean) => void;
  onSelectAll: (isSelected: boolean) => void;
  isAllSelected: boolean;
}

const FixtureRow = ({ game, isSelected, onSelectionChange }: { game: FixtureWithTeams; isSelected: boolean; onSelectionChange: (id: string, selected: boolean) => void; }) => {
    const [isPending, startTransition] = useTransition();
    const [date, setDate] = useState<Date | undefined>(game.date ? new Date(game.date) : undefined);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [status, setStatus] = useState<GameStatus>(game.status as GameStatus);

    const handleDateChange = (newDate: Date | undefined) => {
        if (!newDate) return;
        setDate(newDate);

        startTransition(async () => {
            const result = await updateGameDate(game.id, newDate);
            if (result?.success) {
                toast({ title: "Fecha actualizada" });
                setIsPopoverOpen(false);
            } else {
                toast({ title: "Error", description: result.error, variant: 'destructive' });
            }
        });
    }

    const handleStatusChange = (newStatus: GameStatus) => {
        startTransition(async () => {
            const result = await updateGameStatusInFixture(game.id, newStatus);
            if (result?.success) {
                toast({ title: "Estado actualizado" });
                setStatus(newStatus);
            } else {
                toast({ title: "Error", description: result.error, variant: 'destructive' });
            }
        });
    }

    return (
        <TableRow
            className={cn("cursor-pointer", isSelected && "bg-accent")}
            onClick={() => {
                if (game.status !== 'FINALIZADO') {
                    onSelectionChange(game.id, !isSelected)
                }
            }}
        >
            <TableCell onClick={(e) => e.stopPropagation()}>
                 <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checkedState) => onSelectionChange(game.id, !!checkedState)}
                    aria-label={`Seleccionar partido ${game.homeTeam.name} vs ${game.awayTeam.name}`}
                    disabled={game.status === 'FINALIZADO'}
                />
            </TableCell>
            <TableCell className="font-medium">{game.homeTeam.name}</TableCell>
            <TableCell className="font-medium">{game.awayTeam.name}</TableCell>
            <TableCell>
                {date ? <FormattedDate dateString={date.toISOString()} /> : 'Sin fecha'}
            </TableCell>
            <TableCell className="text-center w-[180px]" onClick={(e) => e.stopPropagation()}>
                 <Select value={status} onValueChange={(value) => handleStatusChange(value as GameStatus)} disabled={isPending}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Programado">Programado</SelectItem>
                        <SelectItem value="EN_VIVO">En Vivo</SelectItem>
                        <SelectItem value="FINALIZADO">Finalizado</SelectItem>
                    </SelectContent>
                </Select>
            </TableCell>
            <TableCell className="text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={handleDateChange}
                            initialFocus
                            disabled={isPending}
                        />
                    </PopoverContent>
                </Popover>

                <Button asChild variant="outline" size="sm">
                    <Link href={`/game/${game.id}`}>
                        Ir al Partido
                    </Link>
                </Button>
            </TableCell>
        </TableRow>
    )
}


export function FixtureTable({ fixtures, selectedGameIds, onSelectionChange, onSelectAll, isAllSelected }: FixtureTableProps) {
  const allGamesAreSimulatable = fixtures.every(g => g.status !== 'FINALIZADO');
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">
            <Checkbox
                checked={isAllSelected}
                onCheckedChange={(checkedState) => onSelectAll(!!checkedState)}
                aria-label="Seleccionar todos los partidos"
                disabled={!allGamesAreSimulatable}
            />
          </TableHead>
          <TableHead>Equipo Local</TableHead>
          <TableHead>Equipo Visitante</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead className="text-center">Estado</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {fixtures.length > 0 ? (
          fixtures.map((game) => (
            <FixtureRow
              key={game.id}
              game={game}
              isSelected={selectedGameIds.includes(game.id)}
              onSelectionChange={onSelectionChange}
            />
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="h-24 text-center">
              Aún no se ha generado un fixture para esta temporada.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
