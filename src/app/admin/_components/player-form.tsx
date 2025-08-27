'use client';

import { useState, useRef, useTransition } from 'react';
import type { Player, Team } from '@prisma/client';
import { createPlayer, updatePlayer } from '@/lib/actions/players';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Edit } from 'lucide-react';

interface PlayerFormProps {
  player?: Player;
  teams: Team[];
  disabled?: boolean;
}

export function PlayerForm({ player, teams, disabled = false }: PlayerFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      if (player) {
        formData.append('id', player.id);
        await updatePlayer(formData);
      } else {
        await createPlayer(formData);
      }
      setIsDialogOpen(false);
    });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {player ? (
          <Button variant="ghost" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
        ) : (
          <Button disabled={disabled}>Añadir Jugador</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{player ? 'Editar Jugador' : 'Añadir Nuevo Jugador'}</DialogTitle>
        </DialogHeader>
        <form ref={formRef} action={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Nombre</Label>
            <Input id="name" name="name" defaultValue={player?.name || ''} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="jerseyNumber" className="text-right">N° Camiseta</Label>
            <Input id="jerseyNumber" name="jerseyNumber" type="number" defaultValue={player?.jerseyNumber || ''} className="col-span-3" required />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="imageUrl" className="text-right">URL de Imagen</Label>
            <Input id="imageUrl" name="imageUrl" defaultValue={player?.imageUrl || ''} className="col-span-3" placeholder="/logos/jugadores/placehoader_jugador.png" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="team" className="text-right">Equipo</Label>
            <Select name="teamId" defaultValue={player?.teamId ?? undefined} required>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecciona un equipo" />
              </SelectTrigger>
              <SelectContent>
                {teams.map(team => (
                  <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
