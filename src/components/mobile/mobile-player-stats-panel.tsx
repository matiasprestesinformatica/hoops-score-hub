"use client";

import type { PlayerInGame } from "@/types";
import { cn } from "@/lib/utils";

const StatBox = ({ label, value }: { label: string, value: string | number }) => (
    <div className="text-center">
        <div className="text-xl font-bold font-mono text-gray-100">{value}</div>
        <div className="text-[10px] text-gray-400 uppercase tracking-wider">{label}</div>
    </div>
);

export function MobilePlayerStatsPanel({ player }: { player: PlayerInGame | null }) {

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
                rebounds: 0,
                assists: 0,
                fouls: 0,
            };
        }

        return player.statsByPeriod.reduce(
            (acc, periodStats) => {
                acc.totalPoints += periodStats.points1.made + periodStats.points2.made * 2 + periodStats.points3.made * 3;
                acc.twoPointsMade += periodStats.points2.made;
                acc.twoPointsAttempted += periodStats.points2.attempted;
                acc.threePointsMade += periodStats.points3.made;
                acc.threePointsAttempted += periodStats.points3.attempted;
                acc.freeThrowsMade += periodStats.points1.made;
                acc.freeThrowsAttempted += periodStats.points1.attempted;
                acc.rebounds += periodStats.rebounds;
                acc.assists += periodStats.assists;
                acc.fouls += periodStats.fouls;
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
                rebounds: 0,
                assists: 0,
                fouls: 0,
            }
        );
    };

    const stats = calculateStats();

    if (!player) {
        return (
             <div className="bg-black/40 backdrop-blur-md border border-white/20 rounded-lg p-2 w-full text-center">
                <p className="text-sm text-gray-400">Selecciona un jugador para ver sus estadísticas</p>
            </div>
        )
    }

    return (
        <div className={cn(
            "bg-black/40 backdrop-blur-md border border-white/20 rounded-lg p-2 w-full transition-opacity duration-300"
        )}>
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="bg-primary text-primary-foreground font-bold text-lg rounded-md w-8 h-8 flex items-center justify-center flex-shrink-0">
                        {player?.player.number}
                    </div>
                    <div className="text-base font-semibold truncate text-gray-100">{player?.player.name}</div>
                </div>
                <div className="grid grid-cols-6 gap-2 flex-1">
                    <StatBox label="Pts" value={stats.totalPoints} />
                    <StatBox label="T2" value={`${stats.twoPointsMade}/${stats.twoPointsAttempted}`} />
                    <StatBox label="T3" value={`${stats.threePointsMade}/${stats.threePointsAttempted}`} />
                    <StatBox label="TL" value={`${stats.freeThrowsMade}/${stats.freeThrowsAttempted}`} />
                    <StatBox label="Reb" value={stats.rebounds} />
                    <StatBox label="Ast" value={stats.assists} />
                </div>
            </div>
        </div>
    );
}
