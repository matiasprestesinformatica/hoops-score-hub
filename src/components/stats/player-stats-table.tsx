import type { TeamInGame, PlayerInGame } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { calculatePlayerTotals } from '@/lib/stats-utils';

interface PlayerStatsTableProps {
    team: TeamInGame;
}

const StatHeader = ({ children }: { children: React.ReactNode }) => (
    <TableHead className="text-center p-2 font-semibold text-gray-300">{children}</TableHead>
)
const StatCell = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <TableCell className={`text-center font-mono p-2 text-gray-200 ${className}`}>{children}</TableCell>
)

const formatPercentage = (made: number, attempted: number) => {
    if (attempted === 0) return 0;
    return Math.round((made / attempted) * 100);
}

const PlayerRow = ({ playerInGame }: { playerInGame: PlayerInGame }) => {
    const totals = calculatePlayerTotals(playerInGame.statsByPeriod);
    
    const fieldGoalsMade = totals.points2.made + totals.points3.made;
    const fieldGoalsAttempted = totals.points2.attempted + totals.points3.attempted;

    return (
        <TableRow className="border-b-white/10 hover:bg-white/5">
            <TableCell className="font-semibold p-2 sticky left-0 bg-black/30 whitespace-nowrap text-gray-100">
                #{playerInGame.player.number} {playerInGame.player.name}
            </TableCell>
            <StatCell className="font-bold">{totals.points}</StatCell>
            <StatCell>{fieldGoalsMade}-{fieldGoalsAttempted}</StatCell>
            <StatCell>{formatPercentage(fieldGoalsMade, fieldGoalsAttempted)}</StatCell>
            <StatCell>{totals.points2.made}-{totals.points2.attempted}</StatCell>
            <StatCell>{formatPercentage(totals.points2.made, totals.points2.attempted)}</StatCell>
            <StatCell>{totals.points3.made}-{totals.points3.attempted}</StatCell>
            <StatCell>{formatPercentage(totals.points3.made, totals.points3.attempted)}</StatCell>
            <StatCell>{totals.points1.made}-{totals.points1.attempted}</StatCell>
            <StatCell>{formatPercentage(totals.points1.made, totals.points1.attempted)}</StatCell>
            <StatCell>{totals.rebounds}</StatCell>
            <StatCell>{totals.assists}</StatCell>
            <StatCell>{totals.fouls}</StatCell>
            <StatCell className="font-bold text-primary">{totals.valuation}</StatCell>
        </TableRow>
    )
}

export function PlayerStatsTable({ team }: PlayerStatsTableProps) {
  return (
    <Card className="bg-black/30 backdrop-blur-lg border border-white/20 text-gray-200">
      <CardHeader>
        <CardTitle className="text-gray-100">{team.name} - Estadísticas por Jugador</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto relative">
            <Table className="min-w-full text-xs">
            <TableHeader className="bg-black/40">
                <TableRow className="border-b-white/20 hover:bg-white/5">
                    <TableHead className="p-2 sticky left-0 bg-black/40 w-[150px] font-semibold text-gray-300">Jugador</TableHead>
                    <StatHeader>PTS</StatHeader>
                    <StatHeader>LC</StatHeader>
                    <StatHeader>LC%</StatHeader>
                    <StatHeader>2PTS</StatHeader>
                    <StatHeader>2PTS%</StatHeader>
                    <StatHeader>3PTS</StatHeader>
                    <StatHeader>3PTS%</StatHeader>
                    <StatHeader>1PT</StatHeader>
                    <StatHeader>1PT%</StatHeader>
                    <StatHeader>REB</StatHeader>
                    <StatHeader>AST</StatHeader>
                    <StatHeader>FLS</StatHeader>
                    <StatHeader>VAL</StatHeader>
                </TableRow>
            </TableHeader>
            <TableBody>
                {team.players.map((playerInGame) => (
                    <PlayerRow key={playerInGame.player.id} playerInGame={playerInGame} />
                ))}
            </TableBody>
            </Table>
        </div>
      </CardContent>
    </Card>
  );
}
