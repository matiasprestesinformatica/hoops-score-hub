'use client';

import { useTransition } from 'react';
import type { ProjectConfig } from '@/types';
import { updateConfig } from '@/lib/actions/config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

interface ConfigFormProps {
  config: ProjectConfig;
}

export function ConfigForm({ config }: ConfigFormProps) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await updateConfig(formData);
      if (result.error) {
        toast({
            title: 'Error',
            description: result.error,
            variant: 'destructive',
        });
      } else {
        toast({
            title: '¡Guardado!',
            description: 'La configuración del proyecto ha sido actualizada.',
        });
      }
    });
  };

  return (
    <form action={handleSubmit}>
        <Card>
            <CardHeader>
                <CardTitle>Información General</CardTitle>
                <CardDescription>
                    Estos datos se usarán en toda la aplicación, como en la página de inicio y las pestañas del navegador.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="title">Título del Proyecto</Label>
                    <Input id="title" name="title" defaultValue={config.title} required />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="slogan">Slogan (Opcional)</Label>
                    <Input id="slogan" name="slogan" defaultValue={config.slogan ?? ''} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="logoUrl">URL del Logo (Opcional)</Label>
                    <Input id="logoUrl" name="logoUrl" defaultValue={config.logoUrl ?? ''} placeholder="/logos/mi-logo.png"/>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="metaDescription">Descripción para SEO (Opcional)</Label>
                    <Textarea id="metaDescription" name="metaDescription" defaultValue={config.metaDescription ?? ''} placeholder="Una breve descripción para los motores de búsqueda." />
                </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
                <Button type="submit" disabled={isPending}>
                    {isPending ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
            </CardFooter>
        </Card>
    </form>
  );
}
