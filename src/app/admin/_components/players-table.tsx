import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlayerActions } from "./player-actions";
import type { Player, Team } from "@prisma/client";
import { Card } from "@/components/ui/card";

// Definimos un tipo explícito para los jugadores que incluyen la información del equipo.
export type PlayerWithTeam = Player & { team: Team | null };

interface PlayersTableProps {
  players: PlayerWithTeam[];
  teams: Team[];
}

const getInitials = (name: string) => {
    if (!name) return "";
    const names = name.split(' ');
    if (names.length > 1 && names[1]) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    if (name.length > 1) {
      return name.substring(0, 2).toUpperCase();
    }
    return name.toUpperCase();
}

export function PlayersTable({ players, teams }: PlayersTableProps) {
  const noTeams = teams.length === 0;

  return (
     <Card>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-accent/50 border-b-border">
              <TableHead className="w-[80px]">Foto</TableHead>
              <TableHead>Nombre Completo</TableHead>
              <TableHead className="w-[120px]">N° Camiseta</TableHead>
              <TableHead>Equipo</TableHead>
              <TableHead className="text-right w-[160px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {players.length > 0 ? (
              players.map((player) => (
                <TableRow key={player.id} className="border-b-border/50 hover:bg-accent/50">
                  <TableCell>
                     <Avatar>
                      <AvatarImage src={player.imageUrl ?? undefined} alt={player.name} />
                      <AvatarFallback>{getInitials(player.name)}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium text-foreground">{player.name}</TableCell>
                  <TableCell className="text-muted-foreground">#{player.jerseyNumber}</TableCell>
                  <TableCell className="text-muted-foreground">{player.team?.name || 'Sin equipo'}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <PlayerActions player={player} teams={teams} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                  {noTeams ? "Primero debes añadir un equipo." : "No hay jugadores. ¡Añade uno para empezar!"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
  );
}
