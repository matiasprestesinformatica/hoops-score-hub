"use client";

import type { PlayerInGame, TeamInGame } from '@/types';
import { Button } from '../ui/button';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';

interface ShotControlsProps {
    team: TeamInGame;
    selectedPlayer: PlayerInGame | null;
    onPlayerSelect: (player: PlayerInGame | null) => void;
    shotResult: 'made' | 'missed';
    onShotResultChange: (result: 'made' | 'missed') => void;
    shotValue: '1' | '2' | '3';
    onShotValueChange: (value: '1' | '2' | '3') => void;
    onRegisterEvent: (eventType: 'rebound' | 'assist' | 'foul') => void;
}

const PlayerButton = ({ player, isSelected, onClick }: { player: PlayerInGame, isSelected: boolean, onClick: () => void }) => (
    <Button
      variant={isSelected ? 'default' : 'outline'}
      onClick={onClick}
      className="h-auto w-full justify-start p-2"
    >
      <div className="flex items-center gap-2">
        <div className={cn("w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs", isSelected ? 'bg-primary-foreground text-primary' : 'bg-secondary text-secondary-foreground')}>
            {player.player.number}
        </div>
        <span className="truncate">{player.player.name}</span>
      </div>
    </Button>
  );

export function ShotControls({
    team,
    selectedPlayer,
    onPlayerSelect,
    shotResult,
    onShotResultChange,
    shotValue,
    onShotValueChange,
    onRegisterEvent,
}: ShotControlsProps) {
    const isPlayerInThisTeam = selectedPlayer && team.players.some(p => p.player.id === selectedPlayer.player.id);

    return (
        <Card className="w-full h-full bg-black/30 backdrop-blur-lg border border-white/20 text-gray-200">
            <CardHeader>
                <CardTitle className="truncate text-gray-100">{team.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label className="font-semibold text-gray-300">Jugador</Label>
                    <ScrollArea className="h-48 mt-2 pr-4">
                        <div className="space-y-2">
                        {team.players.map(p => (
                            <PlayerButton 
                                key={p.player.id} 
                                player={p} 
                                isSelected={selectedPlayer?.player.id === p.player.id}
                                onClick={() => onPlayerSelect(selectedPlayer?.player.id === p.player.id ? null : p)}
                            />
                        ))}
                        </div>
                    </ScrollArea>
                </div>

                <Separator />

                <div className="space-y-4" aria-disabled={!isPlayerInThisTeam} style={{ pointerEvents: isPlayerInThisTeam ? 'auto' : 'none', opacity: isPlayerInThisTeam ? 1 : 0.5 }}>
                    <div className="space-y-2">
                        <Label className="font-semibold text-gray-300">Resultado</Label>
                        <RadioGroup value={shotResult} onValueChange={(v) => onShotResultChange(v as 'made' | 'missed')} className="flex gap-4">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="made" id={`${team.id}-made`} />
                                <Label htmlFor={`${team.id}-made`}>Anotado</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="missed" id={`${team.id}-missed`} />
                                <Label htmlFor={`${team.id}-missed`}>Fallado</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <div className="space-y-2">
                        <Label className="font-semibold text-gray-300">Valor</Label>
                        <RadioGroup value={shotValue} onValueChange={(v) => onShotValueChange(v as '1' | '2' | '3')} className="flex gap-4">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="1" id={`${team.id}-1pt`} />
                                <Label htmlFor={`${team.id}-1pt`}>1 Punto</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="2" id={`${team.id}-2pt`} />
                                <Label htmlFor={`${team.id}-2pt`}>2 Puntos</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="3" id={`${team.id}-3pt`} />
                                <Label htmlFor={`${team.id}-3pt`}>3 Puntos</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <div className="space-y-2">
                        <Label className="font-semibold text-gray-300">Otras Acciones</Label>
                        <div className='grid grid-cols-3 gap-2'>
                            <Button variant="outline" onClick={() => onRegisterEvent('rebound')}>Rebote</Button>
                            <Button variant="outline" onClick={() => onRegisterEvent('assist')}>Asistencia</Button>
                            <Button variant="outline" onClick={() => onRegisterEvent('foul')}>Falta</Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
