import type { PlayerAverages } from '@/lib/actions/stats';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart, Star, Medal } from 'lucide-react';

interface PlayerStatsCardsProps {
  averages: PlayerAverages;
}

const StatCard = ({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) => (
  <Card className="bg-card border-border">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-4xl font-bold text-foreground">{value}</div>
    </CardContent>
  </Card>
);

export function PlayerStatsCards({ averages }: PlayerStatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard 
        title="Puntos por Partido"
        value={averages.ppg.toFixed(1)}
        icon={<Star className="h-5 w-5 text-muted-foreground" />}
      />
      <StatCard 
        title="Rebotes por Partido"
        value={averages.rpg.toFixed(1)}
        icon={<Medal className="h-5 w-5 text-muted-foreground" />}
      />
      <StatCard 
        title="Asistencias por Partido"
        value={averages.apg.toFixed(1)}
        icon={<BarChart className="h-5 w-5 text-muted-foreground" />}
      />
    </div>
  );
}
