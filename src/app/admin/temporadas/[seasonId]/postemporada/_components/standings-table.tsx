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
import { cn } from "@/lib/utils";

interface StandingsTableProps {
  title: string;
  standings: TeamStanding[];
  icon?: React.ReactNode;
}

export function StandingsTable({ title, standings, icon }: StandingsTableProps) {
  if (standings.length === 0) {
    return null; // Don't render anything if there are no teams for this category
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px] text-center">Pos</TableHead>
              <TableHead>Equipo</TableHead>
              <TableHead className="text-center">PJ</TableHead>
              <TableHead className="text-center">V</TableHead>
              <TableHead className="text-center">D</TableHead>
              <TableHead className="text-center">PF</TableHead>
              <TableHead className="text-center">PC</TableHead>
              <TableHead className="text-center">Dif</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {standings.map((team) => (
              <TableRow
                key={team.id}
              >
                <TableCell className="text-center font-bold">{team.position}</TableCell>
                <TableCell className="font-medium">{team.name}</TableCell>
                <TableCell className="text-center">{team.played}</TableCell>
                <TableCell className="text-center">{team.wins}</TableCell>
                <TableCell className="text-center">{team.losses}</TableCell>
                <TableCell className="text-center">{team.pointsFor}</TableCell>
                <TableCell className="text-center">{team.pointsAgainst}</TableCell>
                <TableCell className={cn("text-center font-bold", team.pointsDifference > 0 ? "text-green-600" : "text-red-600")}>
                  {team.pointsDifference > 0 && "+"}
                  {team.pointsDifference}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
