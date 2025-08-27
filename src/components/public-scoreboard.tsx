"use client";

import type { Game, GameStatus } from "@/types";
import { getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { FormattedDate } from "./formatted-date";

interface PublicScoreboardProps {
  game: Game;
  homeScore: number;
  awayScore: number;
}

const TeamRow = ({ team, score }: { team: Game['teamA'], score: number }) => {
    const teamAbbreviation = team.name.substring(0, 3).toUpperCase();
    return (
        <div className="flex items-center bg-white p-2 border-b border-gray-200 last:border-b-0">
            <Avatar className="h-6 w-6 mr-3">
                <AvatarImage src={team.logoUrl ?? undefined} alt={team.name} />
                <AvatarFallback className="text-xs">{getInitials(team.name)}</AvatarFallback>
            </Avatar>
            <span className="flex-1 font-bold text-lg text-blue-800 tracking-wider truncate">{teamAbbreviation}</span>
            <span className="font-bold text-lg bg-gray-200 text-gray-800 px-2 rounded">{score}</span>
        </div>
    )
};

const getStatusText = (status: GameStatus) => {
    switch (status) {
        case 'EN_VIVO': return 'EN VIVO';
        case 'Programado': return 'PRÓXIMO';
        case 'FINALIZADO': return 'FINALIZADO';
        default: return 'DESCONOCIDO';
    }
}

export function PublicScoreboard({ game, homeScore, awayScore }: PublicScoreboardProps) {
    // Assuming league and season are not available yet, using placeholders.
    const leagueName = "LIGA DE ASCENSO 2025";
    const statusText = getStatusText(game.status);

    return (
        <Link href={`/stats/${game.id}`} className="block w-full max-w-xs rounded-md overflow-hidden shadow-lg border border-gray-300 bg-gray-100 transition-transform hover:scale-105">
            <div className="px-2 py-1 text-center">
                <p className="text-xs font-bold text-gray-600 truncate">{leagueName} - <span className="text-red-600">{statusText}</span></p>
            </div>
            <div className="bg-white border-y border-gray-200">
                <TeamRow team={game.teamA} score={homeScore} />
                <TeamRow team={game.teamB} score={awayScore} />
            </div>
            <div className="bg-gray-700 text-white p-2 flex justify-between items-center text-xs font-semibold">
                <span><FormattedDate dateString={game.createdAt} formatString="dd/MM/yyyy" /></span>
                <span><FormattedDate dateString={game.createdAt} formatString="p" /></span>
            </div>
        </Link>
    )
}
