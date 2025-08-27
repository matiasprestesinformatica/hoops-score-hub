import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative w-full min-h-[70vh] flex items-center justify-center bg-gradient-to-b from-background to-card">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tighter text-foreground">
          Bienvenido a la Liga
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Tu centro de control para los partidos de la liga. Gestiona marcadores, estadísticas y más.
        </p>
        <div className="mt-8">
          <Button asChild size="lg">
            <Link href="/stats/leaders">Ver Clasificación</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
