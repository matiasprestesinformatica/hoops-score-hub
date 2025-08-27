import type { TeamStanding } from "@/lib/actions/seasons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { getInitials } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface StandingsTableProps {
  standings: TeamStanding[];
}

export function StandingsTable({ standings }: StandingsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tabla de Posiciones</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px] text-center">Pos</TableHead>
              <TableHead>Equipo</TableHead>
              <TableHead className="text-center">V</TableHead>
              <TableHead className="text-center">D</TableHead>
              <TableHead className="text-center">Pts</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {standings.map((team, index) => (
              <TableRow
                key={team.id}
                className={cn(index < 4 && "bg-accent/50")}
              >
                <TableCell className="text-center font-bold">{team.position}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={team.logoUrl ?? undefined} alt={team.name} />
                      <AvatarFallback>{getInitials(team.name)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{team.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center font-mono">{team.wins}</TableCell>
                <TableCell className="text-center font-mono">{team.losses}</TableCell>
                <TableCell className="text-center font-mono font-bold">{team.wins * 2 + team.losses}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
