"use client"

import { Button } from "@/components/ui/button"

interface GameControlsProps {
  onStartGame: () => void
  onEndGame: () => void
  onPeriodChange: (period: number) => void
  currentPeriod: number
  gameStarted: boolean
  gameEnded: boolean
}

export function GameControls({
  onStartGame,
  onEndGame,
  onPeriodChange,
  currentPeriod,
  gameStarted,
  gameEnded,
}: GameControlsProps) {
  return (
    <div className="flex items-center gap-4">
      <Button
        variant={gameStarted ? "secondary" : "default"}
        size="sm"
        onClick={onStartGame}
        className="bg-orange-500 hover:bg-orange-600 text-white"
      >
        Iniciar Partido
      </Button>

      <Button
        variant={gameEnded ? "secondary" : "outline"}
        size="sm"
        onClick={onEndGame}
        className="bg-red-600 hover:bg-red-700 text-white border-red-600"
      >
        Finalizar Partido
      </Button>

      <div className="flex gap-2">
        {[1, 2, 3, 4].map((period) => (
          <Button
            key={period}
            variant={currentPeriod === period ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onPeriodChange(period)}
            className="text-white hover:bg-slate-700"
          >
            P{period}
          </Button>
        ))}
      </div>
    </div>
  )
}
