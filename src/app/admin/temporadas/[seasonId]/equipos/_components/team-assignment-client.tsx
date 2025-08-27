'use client';

import { useState, useTransition, useMemo } from "react";
import type { Team, Season } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { updateSeasonTeams } from "@/lib/actions/seasons";
import { toast } from "@/hooks/use-toast";

interface TeamAssignmentClientProps {
  season: Season;
  initialParticipatingTeams: Team[];
  allTeams: Team[];
}

export function TeamAssignmentClient({ season, initialParticipatingTeams, allTeams }: TeamAssignmentClientProps) {
  const [isPending, startTransition] = useTransition();
  const [participatingTeamIds, setParticipatingTeamIds] = useState<Set<string>>(
    new Set(initialParticipatingTeams.map(t => t.id))
  );

  const availableTeams = useMemo(() => {
    return allTeams.filter(team => !participatingTeamIds.has(team.id));
  }, [allTeams, participatingTeamIds]);

  const participatingTeams = useMemo(() => {
    return allTeams.filter(team => participatingTeamIds.has(team.id));
  }, [allTeams, participatingTeamIds]);

  const handleToggleTeam = (teamId: string) => {
    setParticipatingTeamIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(teamId)) {
        newSet.delete(teamId);
      } else {
        newSet.add(teamId);
      }
      return newSet;
    });
  };

  const handleSave = () => {
    startTransition(async () => {
      const result = await updateSeasonTeams(season.id, Array.from(participatingTeamIds));
      if (result.success) {
        toast({
          title: "¡Guardado!",
          description: "La lista de equipos para la temporada ha sido actualizada.",
        });
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    });
  };
  
  const TeamList = ({ teams }: { teams: Team[] }) => (
    <ScrollArea className="h-96 rounded-md border p-4">
      <div className="space-y-4">
        {teams.map(team => (
          <div key={team.id} className="flex items-center space-x-2">
            <Checkbox
              id={`team-${team.id}`}
              checked={participatingTeamIds.has(team.id)}
              onCheckedChange={() => handleToggleTeam(team.id)}
            />
            <Label htmlFor={`team-${team.id}`} className="font-normal cursor-pointer flex-1">
              {team.name}
            </Label>
          </div>
        ))}
         {teams.length === 0 && (
            <div className="text-center text-muted-foreground h-full flex items-center justify-center">
                <p>No hay equipos en esta lista.</p>
            </div>
         )}
      </div>
    </ScrollArea>
  );

  return (
    <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <Card>
                <CardHeader>
                    <CardTitle>Equipos Disponibles</CardTitle>
                </CardHeader>
                <CardContent>
                    <TeamList teams={availableTeams} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Equipos en la Temporada</CardTitle>
                </CardHeader>
                <CardContent>
                    <TeamList teams={participatingTeams} />
                </CardContent>
            </Card>
        </div>
        <div className="mt-6 flex justify-end">
            <Button onClick={handleSave} disabled={isPending}>
                {isPending ? "Guardando..." : "Guardar Cambios"}
            </Button>
        </div>
    </div>
  );
}
