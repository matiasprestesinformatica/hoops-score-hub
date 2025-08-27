'use client';

import { useState, useRef, useTransition } from 'react';
import type { Season } from '@prisma/client';
import { createSeason, updateSeason } from '@/lib/actions/seasons';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit, Calendar as CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface SeasonFormProps {
  season?: Season;
  leagueId: string;
}

export function SeasonForm({ season, leagueId }: SeasonFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const [startDate, setStartDate] = useState<Date | undefined>(
    season?.startDate ? new Date(season.startDate) : undefined
  );

  const handleSubmit = (formData: FormData) => {
    if (startDate) {
      formData.append('startDate', startDate.toISOString());
    }
    formData.append('leagueId', leagueId);
    
    startTransition(async () => {
      if (season) {
        formData.append('id', season.id);
        await updateSeason(formData);
      } else {
        await createSeason(formData);
      }
      setIsDialogOpen(false);
    });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {season ? (
          <Button variant="ghost" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
        ) : (
          <Button>Añadir Temporada</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{season ? 'Editar Temporada' : 'Añadir Nueva Temporada'}</DialogTitle>
        </DialogHeader>
        <form ref={formRef} action={handleSubmit} className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" name="name" defaultValue={season?.name || ''} required placeholder="Ej: Temporada 2025-2026" />
          </div>
           <div className="space-y-2">
            <Label htmlFor="startDate">Fecha de Inicio de la Temporada</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : <span>Selecciona una fecha</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label htmlFor="playoffTeams">Equipos en Playoffs</Label>
            <Input id="playoffTeams" name="playoffTeams" type="number" defaultValue={season?.playoffTeams || 4} required />
            <p className="text-sm text-muted-foreground">Define los X primeros equipos de la tabla que jugarán por el título.</p>
          </div>
           <div className="space-y-2">
            <Label htmlFor="relegationTeams">Equipos en Descenso</Label>
            <Input id="relegationTeams" name="relegationTeams" type="number" defaultValue={season?.relegationTeams || 2} required />
            <p className="text-sm text-muted-foreground">Define los X últimos equipos de la tabla que jugarán por no descender.</p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
