'use client';

import { useTransition } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { generateSeasonFixture } from '@/lib/actions/seasons';
import { toast } from '@/hooks/use-toast';
import { CalendarCheck, ListChecks, Loader2, Trophy } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface FixtureControlsProps {
  seasonId: string;
  teamCount: number;
}

export function FixtureControls({ seasonId, teamCount }: FixtureControlsProps) {
  const [isPending, startTransition] = useTransition();
  const canGenerate = teamCount >= 2;

  const handleGenerate = () => {
    startTransition(async () => {
      const result = await generateSeasonFixture(seasonId);
      if (result?.success) {
        toast({
          title: '¡Fixture Generado!',
          description: `Se han creado ${result.gameCount} partidos para la temporada.`,
        });
      } else {
        toast({
          title: 'Error',
          description: result?.error || 'No se pudo generar el fixture.',
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="inline-block"> {/* Wrapper div for TooltipTrigger */}
              <Button onClick={handleGenerate} disabled={isPending || !canGenerate}>
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CalendarCheck className="mr-2 h-4 w-4" />
                )}
                {isPending ? 'Generando...' : 'Generar Fixture'}
              </Button>
            </div>
          </TooltipTrigger>
          {!canGenerate && (
            <TooltipContent>
              <p>Se necesitan al menos 2 equipos para generar un fixture.</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>

      <Button asChild variant="secondary">
        <Link href={`/admin/temporadas/${seasonId}/fixture`}>
          <ListChecks className="mr-2 h-4 w-4" />
          Ver Fixture
        </Link>
      </Button>
       <Button asChild variant="secondary">
        <Link href={`/admin/temporadas/${seasonId}/postemporada`}>
          <Trophy className="mr-2 h-4 w-4" />
          Post-Temporada
        </Link>
      </Button>
    </div>
  );
}
