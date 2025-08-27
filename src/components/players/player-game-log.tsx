import type { PlayerGameLogData } from '@/lib/actions/stats';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';

interface PlayerGameLogProps {
  gameLogs: PlayerGameLogData[];
}

export function PlayerGameLog({ gameLogs }: PlayerGameLogProps) {
  return (
    <Card className="bg-card border-border">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-accent/50 border-b-border">
                <TableHead>Contrincante</TableHead>
                <TableHead className="text-center">Resultado</TableHead>
                <TableHead className="text-center">PTS</TableHead>
                <TableHead className="text-center">REB</TableHead>
                <TableHead className="text-center">AST</TableHead>
                <TableHead className="text-center">FLS</TableHead>
                <TableHead className="text-center">VAL</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gameLogs.length > 0 ? (
                gameLogs.map((log) => (
                  <TableRow key={log.gameId} className="border-b-border/50 hover:bg-accent/50">
                    <TableCell className="font-medium text-foreground">vs {log.opponentName}</TableCell>
                    <TableCell className={`text-center font-bold ${log.result === 'V' ? 'text-green-500' : 'text-red-500'}`}>
                      {log.result} {log.score}
                    </TableCell>
                    <TableCell className="text-center font-mono">{log.stats.points}</TableCell>
                    <TableCell className="text-center font-mono">{log.stats.rebounds}</TableCell>
                    <TableCell className="text-center font-mono">{log.stats.assists}</TableCell>
                    <TableCell className="text-center font-mono">{log.stats.fouls}</TableCell>
                    <TableCell className="text-center font-mono font-bold text-primary">{log.stats.valuation}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                    Este jugador aún no ha disputado ningún partido.
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
