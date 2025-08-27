'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { generatePlayoffMatches } from '@/lib/actions/seasons';
import { toast } from '@/hooks/use-toast';
import { Loader2, Zap } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface PlayoffControlsProps {
  seasonId: string;
  canGenerate: boolean;
}

export function PlayoffControls({ seasonId, canGenerate }: PlayoffControlsProps) {
  const [isPending, startTransition] = useTransition();

  const handleGenerate = () => {
    startTransition(async () => {
      const result = await generatePlayoffMatches(seasonId);
      if (result?.success) {
        toast({
          title: '¡Playoffs Generados!',
          description: 'Los enfrentamientos de playoffs se han creado correctamente.',
        });
      } else {
        toast({
          title: 'Error',
          description: result?.error || 'No se pudieron generar los playoffs.',
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-block"> {/* Wrapper div is necessary for Tooltip with disabled button */}
            <Button onClick={handleGenerate} disabled={isPending || !canGenerate} className="w-full">
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Zap className="mr-2 h-4 w-4" />
              )}
              {isPending ? 'Generando...' : 'Generar Playoffs'}
            </Button>
          </div>
        </TooltipTrigger>
        {!canGenerate && (
          <TooltipContent>
            <p>Se necesitan más equipos en la temporada para generar los playoffs.</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}
