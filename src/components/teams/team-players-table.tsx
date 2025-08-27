import Link from 'next/link';
import type { PlayerWithStats } from '@/lib/actions/stats';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';
import { Button } from '../ui/button';
import { Eye } from 'lucide-react';

interface TeamPlayersTableProps {
  players: PlayerWithStats[];
}

export function TeamPlayersTable({ players }: TeamPlayersTableProps) {
  return (
    <Card className="bg-card border-border">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-accent/50 border-b-border">
                <TableHead>Jugador</TableHead>
                <TableHead className="text-center">PJ</TableHead>
                <TableHead className="text-center">PPP</TableHead>
                <TableHead className="text-center">RPP</TableHead>
                <TableHead className="text-center">APP</TableHead>
                <TableHead className="text-right">Perfil</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {players.length > 0 ? (
                players.map(({ player, stats }) => (
                  <TableRow key={player.id} className="border-b-border/50 hover:bg-accent/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={player.imageUrl ?? undefined} alt={player.name} />
                          <AvatarFallback>{getInitials(player.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium text-foreground">{player.name}</p>
                            <p className="text-xs text-muted-foreground">#{player.jerseyNumber}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-mono">{stats.gamesPlayed}</TableCell>
                    <TableCell className="text-center font-mono">{stats.ppg.toFixed(1)}</TableCell>
                    <TableCell className="text-center font-mono">{stats.rpg.toFixed(1)}</TableCell>
                    <TableCell className="text-center font-mono">{stats.apg.toFixed(1)}</TableCell>
                    <TableCell className="text-right">
                        <Button asChild variant="ghost" size="icon">
                            <Link href={`/jugadores/${player.id}`}>
                                <Eye className="h-4 w-4" />
                            </Link>
                        </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                        Este equipo no tiene jugadores asignados.
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
