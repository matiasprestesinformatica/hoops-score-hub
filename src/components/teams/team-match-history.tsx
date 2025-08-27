import Link from 'next/link';
import type { MatchHistory } from '@/lib/actions/stats';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

interface TeamMatchHistoryProps {
  matches: MatchHistory[];
  currentTeamId: string;
}

export function TeamMatchHistory({ matches, currentTeamId }: TeamMatchHistoryProps) {
  return (
    <Card className="bg-card border-border">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-accent/50 border-b-border">
                <TableHead>Contrincante</TableHead>
                <TableHead className="text-center">Resultado</TableHead>
                <TableHead className="text-center">Marcador</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {matches.length > 0 ? (
                matches.map((match) => {
                  const opponent = match.homeTeamId === currentTeamId ? match.awayTeam : match.homeTeam;
                  const isWin = (match.homeTeamId === currentTeamId && match.homeScore > match.awayScore) || 
                                (match.awayTeamId === currentTeamId && match.awayScore > match.homeScore);

                  return (
                    <TableRow key={match.id} className="border-b-border/50 hover:bg-accent/50">
                      <TableCell className="font-medium text-foreground">{opponent.name}</TableCell>
                      <TableCell className={`text-center font-bold ${isWin ? 'text-green-500' : 'text-red-500'}`}>
                        {isWin ? 'VICTORIA' : 'DERROTA'}
                      </TableCell>
                      <TableCell className="text-center font-mono">
                        {match.homeScore} - {match.awayScore}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/stats/${match.id}`}>
                            <Eye className="mr-2 h-4 w-4" /> Ver Partido
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                        Este equipo aún no ha jugado ningún partido.
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
