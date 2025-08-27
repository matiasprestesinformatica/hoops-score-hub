'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { Loader2, Sparkles } from 'lucide-react';
import type { SimulationContext } from '@/lib/actions/seasons';
import { simulateFixtureGames } from '@/lib/actions/seasons';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface FixtureActionsProps {
  seasonId: string;
  selectedGameIds: string[];
  onClearSelection: () => void;
}

export function FixtureActions({ seasonId, selectedGameIds, onClearSelection }: FixtureActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [context, setContext] = useState<SimulationContext>('random');

  const handleSimulate = () => {
    startTransition(async () => {
      const result = await simulateFixtureGames(selectedGameIds, context);
      if (result?.success) {
        toast({
          title: '¡Partidos Simulados!',
          description: `${result.simulatedCount} partidos han sido simulados y finalizados.`,
        });
        onClearSelection();
      } else {
        toast({
          title: 'Error',
          description: result?.error || 'No se pudieron simular los partidos.',
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <p className="text-sm text-muted-foreground">
        {selectedGameIds.length} partido(s) seleccionado(s)
      </p>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button disabled={selectedGameIds.length === 0}>
            <Sparkles className="mr-2 h-4 w-4" />
            Simular Partidos Seleccionados
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Simular {selectedGameIds.length} Partido(s)</AlertDialogTitle>
            <AlertDialogDescription>
              Selecciona el escenario para la simulación. La IA generará estadísticas realistas y finalizará los partidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-4">
            <RadioGroup value={context} onValueChange={(value) => setContext(value as SimulationContext)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="home_wins" id="home_wins" />
                <Label htmlFor="home_wins">Gana el Equipo Local</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="away_wins" id="away_wins" />
                <Label htmlFor="away_wins">Gana el Equipo Visitante</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="random" id="random" />
                <Label htmlFor="random">Resultado Aleatorio</Label>
              </div>
            </RadioGroup>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleSimulate} disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? 'Simulando...' : 'Confirmar y Simular'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
