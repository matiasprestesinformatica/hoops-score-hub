"use client";

import { useState, useEffect } from "react";
import type { Game } from "@/types";
import { getGameById } from "@/lib/actions/game";
import { PublicScoreboard } from "./public-scoreboard";

interface PublicGameViewProps {
  initialGame: Game;
}

export function PublicGameView({ initialGame }: PublicGameViewProps) {
  const [liveGame, setLiveGame] = useState(initialGame);

  useEffect(() => {
    if (liveGame.status === 'FINALIZADO') {
      return; // No polling if the game is over
    }

    const pollInterval = liveGame.status === 'Programado' ? 30000 : 5000;

    const intervalId = setInterval(async () => {
      const fullGame = await getGameById(initialGame.id);
      if (fullGame) {
        setLiveGame(fullGame);
      }
    }, pollInterval);

    return () => clearInterval(intervalId);
  }, [initialGame.id, liveGame.status]);


  return <PublicScoreboard game={liveGame} homeScore={0} awayScore={0} />;
}
