import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TeamActions } from "./team-actions";
import type { Team } from "@prisma/client";
import { Card } from "@/components/ui/card";

interface TeamsTableProps {
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

export function TeamsTable({ teams }: TeamsTableProps) {
    return (
        <Card>
            <Table>
                <TableHeader>
                <TableRow className="hover:bg-accent/50 border-b-border">
                    <TableHead className="w-[80px]">Logo</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead className="text-right w-[160px]">Acciones</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {teams.length > 0 ? (
                    teams.map((team: Team) => (
                    <TableRow key={team.id} className="border-b-border/50 hover:bg-accent/50">
                        <TableCell>
                        <Avatar>
                            {team.logoUrl && <AvatarImage src={team.logoUrl} alt={team.name} />}
                            <AvatarFallback>{getInitials(team.name)}</AvatarFallback>
                        </Avatar>
                        </TableCell>
                        <TableCell className="font-medium text-foreground">{team.name}</TableCell>
                        <TableCell className="text-right space-x-2">
                        <TeamActions team={team} />
                        </TableCell>
                    </TableRow>
                    ))
                ) : (
                    <TableRow>
                    <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
                        No hay equipos. ¡Añade uno para empezar!
                    </TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
        </Card>
    );
}
