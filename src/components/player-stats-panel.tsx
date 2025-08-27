"use client";

import type { PlayerInGame } from "@/types";
import { cn } from "@/lib/utils";

const StatBox = ({ label, value }: { label: string, value: string }) => (
    <div className="text-center">
        <div className="text-2xl font-bold font-mono text-foreground">{value}</div>
        <div className="text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
    </div>
);

export function PlayerStatsPanel({ player }: { player: PlayerInGame | null }) {

    const calculateStats = () => {
        if (!player) {
            return {
                totalPoints: 0,
                twoPointsMade: 0,
                twoPointsAttempted: 0,
                threePointsMade: 0,
                threePointsAttempted: 0,
                freeThrowsMade: 0,
                freeThrowsAttempted: 0,
            };
        }

        // Calculate total stats across all periods
        return player.statsByPeriod.reduce(
            (acc, periodStats) => {
                acc.totalPoints += periodStats.points1.made + periodStats.points2.made * 2 + periodStats.points3.made * 3;
                acc.twoPointsMade += periodStats.points2.made;
                acc.twoPointsAttempted += periodStats.points2.attempted;
                acc.threePointsMade += periodStats.points3.made;
                acc.threePointsAttempted += periodStats.points3.attempted;
                acc.freeThrowsMade += periodStats.points1.made;
                acc.freeThrowsAttempted += periodStats.points1.attempted;
                return acc;
            },
            {
                totalPoints: 0,
                twoPointsMade: 0,
                twoPointsAttempted: 0,
                threePointsMade: 0,
                threePointsAttempted: 0,
                freeThrowsMade: 0,
                freeThrowsAttempted: 0,
            }
        );
    };

    const stats = calculateStats();

    const getPercentage = (made: number, attempted: number) => {
        if (attempted === 0) return "0%";
        return `${Math.round((made / attempted) * 100)}%`;
    };

    return (
        <div className={cn(
            "bg-card border border-border rounded-lg p-4 w-full max-w-md transition-opacity duration-300",
            player ? "opacity-100" : "opacity-0 invisible"
        )}>
            <div className="flex items-center mb-4">
                <div className="bg-primary text-primary-foreground font-bold text-xl rounded-md w-10 h-10 flex items-center justify-center mr-4 flex-shrink-0">
                    {player?.player.number}
                </div>
                <div className="text-lg font-semibold truncate flex-1">{player?.player.name || "Selecciona un jugador"}</div>
            </div>
            <div className="grid grid-cols-4 gap-2 divide-x divide-border">
                <StatBox label="Puntos" value={String(stats.totalPoints)} />
                <div className="text-center pl-2 space-y-1">
                    <StatBox label="T2" value={`${stats.twoPointsMade}/${stats.twoPointsAttempted}`} />
                    <div className="text-xs text-muted-foreground font-mono">{getPercentage(stats.twoPointsMade, stats.twoPointsAttempted)}</div>
                </div>
                 <div className="text-center pl-2 space-y-1">
                    <StatBox label="T3" value={`${stats.threePointsMade}/${stats.threePointsAttempted}`} />
                     <div className="text-xs text-muted-foreground font-mono">{getPercentage(stats.threePointsMade, stats.threePointsAttempted)}</div>
                </div>
                 <div className="text-center pl-2 space-y-1">
                    <StatBox label="TL" value={`${stats.freeThrowsMade}/${stats.freeThrowsAttempted}`} />
                     <div className="text-xs text-muted-foreground font-mono">{getPercentage(stats.freeThrowsMade, stats.freeThrowsAttempted)}</div>
                </div>
            </div>
        </div>
    );
}
