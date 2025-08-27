"use client";

import type { TeamSummaryStats as TeamSummaryStatsType } from '@/lib/actions/stats';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ArrowDown, ArrowUp, Home, Globe } from 'lucide-react';

interface TeamSummaryStatsProps {
    stats: TeamSummaryStatsType;
}

const StatCard = ({ title, value, icon }: { title: string, value: string | React.ReactNode, icon: React.ReactNode }) => (
    <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
        </CardContent>
    </Card>
);


export function TeamSummaryStats({ stats }: TeamSummaryStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
            title="Puntos Por Partido (A Favor)"
            value={stats.pointsFor.toFixed(1)}
            icon={<ArrowUp className="h-4 w-4 text-green-500" />}
        />
        <StatCard 
            title="Puntos Por Partido (En Contra)"
            value={stats.pointsAgainst.toFixed(1)}
            icon={<ArrowDown className="h-4 w-4 text-red-500" />}
        />
        <StatCard 
            title="Récord en Casa"
            value={<><span className="text-green-500">{stats.homeWins}V</span> - <span className="text-red-500">{stats.homeLosses}D</span></>}
            icon={<Home className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard 
            title="Récord Visitante"
            value={<><span className="text-green-500">{stats.awayWins}V</span> - <span className="text-red-500">{stats.awayLosses}D</span></>}
            icon={<Globe className="h-4 w-4 text-muted-foreground" />}
        />
    </div>
  );
}
