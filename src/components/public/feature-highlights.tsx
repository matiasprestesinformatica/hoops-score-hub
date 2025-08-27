import { Trophy, Tv, Users } from "lucide-react";
import { FeatureCard } from "./feature-card";

export function FeatureHighlights() {
    return (
        <section className="py-16 sm:py-24 bg-background">
            <div className="container mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Explora la Liga
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Sumérgete en las estadísticas, sigue a tus equipos favoritos y no te pierdas ni un solo momento de la acción.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <FeatureCard 
                        icon={<Trophy size={32} />}
                        title="Líderes de la Liga"
                        description="Descubre a los jugadores que dominan las estadísticas en puntos, rebotes y asistencias."
                    />
                     <FeatureCard 
                        icon={<Tv size={32} />}
                        title="Partidos en Vivo"
                        description="Sigue la acción en tiempo real con nuestra vista de espectador para cada partido."
                    />
                     <FeatureCard 
                        icon={<Users size={32} />}
                        title="Explora los Equipos"
                        description="Conoce las plantillas, récords e historiales de cada equipo participante en la liga."
                    />
                </div>
            </div>
        </section>
    );
}
