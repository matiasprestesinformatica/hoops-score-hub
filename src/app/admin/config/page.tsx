import { getProjectConfig } from '@/lib/actions/config';
import { ConfigForm } from './_components/config-form';

export default async function ConfigPage() {
  const config = await getProjectConfig();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Configuración del Proyecto</h1>
        <p className="text-muted-foreground mt-2">
          Personaliza el título, logo y metadatos de tu aplicación.
        </p>
      </div>
      <ConfigForm config={config} />
    </div>
  );
}
