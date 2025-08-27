import type { LeagueLeader } from '@/lib/stats-utils';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { getInitials } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Crown } from 'lucide-react';

interface RankingTableProps {
  title: string;
  leaders: LeagueLeader[];
  icon: React.ReactNode;
}

export function RankingTable({ title, leaders, icon }: RankingTableProps) {
  return (
    <Card className="bg-black/30 backdrop-blur-lg border border-white/20 text-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl text-gray-100">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-b-white/20">
              <TableHead className="w-[50px] text-center">#</TableHead>
              <TableHead>Jugador</TableHead>
              <TableHead className="text-right">Promedio</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaders.map((leader, index) => (
              <TableRow
                key={leader.player.id}
                className={cn(
                  "border-b-white/10",
                  index === 0 && "bg-primary/20"
                )}
              >
                <TableCell className="text-center font-bold">
                  {index === 0 ? (
                    <Crown className="h-5 w-5 mx-auto text-yellow-400" />
                  ) : (
                    index + 1
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 border-2 border-white/20">
                        <AvatarImage src={leader.player.imageUrl ?? undefined} alt={leader.player.name} />
                        <AvatarFallback>{getInitials(leader.player.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold text-gray-100">{leader.player.name}</p>
                        <p className="text-xs text-muted-foreground">{leader.player.team.name}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono text-lg font-bold text-gray-100">
                  {leader.value.toFixed(1)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
