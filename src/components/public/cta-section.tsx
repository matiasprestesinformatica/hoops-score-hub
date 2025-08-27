import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CallToActionSection() {
  return (
    <section className="bg-card py-20 sm:py-28">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          ¿Listo para unirte a la acción?
        </h2>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">
          Lleva el control de tu liga al siguiente nivel. Registra estadísticas, sigue partidos en vivo y gestiona todo desde un solo lugar.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button asChild size="lg">
            <Link href="/admin">Empezar a Gestionar</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
