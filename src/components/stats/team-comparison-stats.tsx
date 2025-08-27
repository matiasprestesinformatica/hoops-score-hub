import type { TeamStatsSummary } from '@/lib/stats-utils';
import { cn } from '@/lib/utils';

interface TeamComparisonStatsProps {
    teamAStats: TeamStatsSummary;
    teamBStats: TeamStatsSummary;
}

const StatRow = ({ label, valueA, valueB, barA, barB, better }: { label: string, valueA: string | number, valueB: string | number, barA: number, barB: number, better?: 'higher' | 'lower' }) => {
    // Determina qué valor es "mejor" basado en la prop `better`
    const numericValueA = typeof valueA === 'string' ? parseFloat(valueA) : valueA;
    const numericValueB = typeof valueB === 'string' ? parseFloat(valueB) : valueB;

    let isABetter = false;
    let isBBetter = false;

    if (better === 'higher') {
        isABetter = numericValueA > numericValueB;
        isBBetter = numericValueB > numericValueA;
    } else if (better === 'lower') {
        isABetter = numericValueA < numericValueB;
        isBBetter = numericValueB < numericValueA;
    }

    return (
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-x-4 text-center border-b border-white/10 last:border-b-0 py-3">
            <span className={cn("font-mono text-sm md:text-base", isABetter && "text-primary font-bold")}>{valueA}</span>
            <span className="font-semibold text-xs uppercase text-gray-400">{label}</span>
            <span className={cn("font-mono text-sm md:text-base", isBBetter && "text-primary font-bold")}>{valueB}</span>
            <div className="relative h-1.5 bg-secondary rounded-full mt-1 col-span-3 flex">
                <div className="bg-blue-600 h-full rounded-l-full" style={{ width: `${barA}%` }}></div>
                <div className="bg-red-600 h-full rounded-r-full" style={{ width: `${barB}%` }}></div>
            </div>
        </div>
    )
}

const formatPercentage = (made: number, attempted: number) => {
    if (attempted === 0) return '0%';
    return `${Math.round((made / attempted) * 100)}%`;
}

const getPercentageValue = (made: number, attempted: number) => {
    if (attempted === 0) return 0;
    return (made / attempted) * 100;
}

export function TeamComparisonStats({ teamAStats, teamBStats }: TeamComparisonStatsProps) {
    // --- Helper para calcular las barras relativas ---
    const calculateRelativeBars = (valueA: number, valueB: number) => {
        const total = valueA + valueB;
        if (total === 0) {
            return { barA: 50, barB: 50 }; // Si ambos son 0, mostrar barras iguales
        }
        const barA = (valueA / total) * 100;
        const barB = (valueB / total) * 100;
        return { barA, barB };
    };

    // --- Cálculos de Tiros de Campo (LC) ---
    const totalMadeA = teamAStats.points2.made + teamAStats.points3.made;
    const totalAttemptsA = teamAStats.points2.attempted + teamAStats.points3.attempted;
    const percentageA_LC = getPercentageValue(totalMadeA, totalAttemptsA);
    const bars_LC = calculateRelativeBars(percentageA_LC, getPercentageValue(teamBStats.points2.made + teamBStats.points3.made, teamBStats.points2.attempted + teamBStats.points3.attempted));
    
    // --- Cálculos de 2 Puntos ---
    const percentageA_2P = getPercentageValue(teamAStats.points2.made, teamAStats.points2.attempted);
    const bars_2P = calculateRelativeBars(percentageA_2P, getPercentageValue(teamBStats.points2.made, teamBStats.points2.attempted));

    // --- Cálculos de 3 Puntos ---
    const percentageA_3P = getPercentageValue(teamAStats.points3.made, teamAStats.points3.attempted);
    const bars_3P = calculateRelativeBars(percentageA_3P, getPercentageValue(teamBStats.points3.made, teamBStats.points3.attempted));

    // --- Cálculos de 1 Punto (Tiro Libre) ---
    const percentageA_1P = getPercentageValue(teamAStats.points1.made, teamAStats.points1.attempted);
    const bars_1P = calculateRelativeBars(percentageA_1P, getPercentageValue(teamBStats.points1.made, teamBStats.points1.attempted));

    // --- Cálculos de Rebotes y Asistencias ---
    const bars_REB = calculateRelativeBars(teamAStats.rebounds, teamBStats.rebounds);
    const bars_AST = calculateRelativeBars(teamAStats.assists, teamBStats.assists);
    
    return (
        <div className="w-full max-w-2xl mx-auto">
            <StatRow 
                label="LC"
                valueA={`${totalMadeA}/${totalAttemptsA} (${formatPercentage(totalMadeA, totalAttemptsA)})`}
                valueB={`${teamBStats.points2.made + teamBStats.points3.made}/${teamBStats.points2.attempted + teamBStats.points3.attempted} (${formatPercentage(teamBStats.points2.made + teamBStats.points3.made, teamBStats.points2.attempted + teamBStats.points3.attempted)})`}
                barA={bars_LC.barA}
                barB={bars_LC.barB}
                better="higher"
            />
            <StatRow 
                label="2Pts"
                valueA={`${teamAStats.points2.made}/${teamAStats.points2.attempted} (${formatPercentage(teamAStats.points2.made, teamAStats.points2.attempted)})`}
                valueB={`${teamBStats.points2.made}/${teamBStats.points2.attempted} (${formatPercentage(teamBStats.points2.made, teamBStats.points2.attempted)})`}
                barA={bars_2P.barA}
                barB={bars_2P.barB}
                better="higher"
            />
            <StatRow 
                label="3Pts"
                valueA={`${teamAStats.points3.made}/${teamAStats.points3.attempted} (${formatPercentage(teamAStats.points3.made, teamAStats.points3.attempted)})`}
                valueB={`${teamBStats.points3.made}/${teamBStats.points3.attempted} (${formatPercentage(teamBStats.points3.made, teamBStats.points3.attempted)})`}
                barA={bars_3P.barA}
                barB={bars_3P.barB}
                better="higher"
            />
            <StatRow 
                label="1Pt"
                valueA={`${teamAStats.points1.made}/${teamAStats.points1.attempted} (${formatPercentage(teamAStats.points1.made, teamAStats.points1.attempted)})`}
                valueB={`${teamBStats.points1.made}/${teamBStats.points1.attempted} (${formatPercentage(teamBStats.points1.made, teamBStats.points1.attempted)})`}
                barA={bars_1P.barA}
                barB={bars_1P.barB}
                better="higher"
            />
            <StatRow 
                label="REB"
                valueA={teamAStats.rebounds}
                valueB={teamBStats.rebounds}
                barA={bars_REB.barA}
                barB={bars_REB.barB}
                better="higher"
            />
            <StatRow 
                label="AST"
                valueA={teamAStats.assists}
                valueB={teamBStats.assists}
                barA={bars_AST.barA}
                barB={bars_AST.barB}
                better="higher"
            />
        </div>
    );
}
