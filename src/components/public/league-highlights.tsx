import { getLeagueHomepageData } from "@/lib/actions/seasons";
import { StandingsTable } from "./standings-table";
import { FixtureList } from "./fixture-list";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export async function LeagueHighlights() {
    const data = await getLeagueHomepageData();

    if (!data || !data.season) {
        return (
            <section className="container mx-auto py-12 px-4">
                <Card>
                    <CardHeader>
                        <CardTitle>No hay datos de la liga</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>No se pudo cargar la información de la liga. Por favor, configura una liga y temporada en el panel de administración.</p>
                    </CardContent>
                </Card>
            </section>
        )
    }

    return (
        <section className="bg-card py-16 sm:py-24">
            <div className="container mx-auto px-4">
                 <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        {data.league.name} - {data.season.name}
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Clasificación y próximos partidos de la temporada actual.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {data.standings && data.standings.length > 0 ? (
                        <StandingsTable standings={data.standings} />
                    ) : (
                         <Card>
                            <CardHeader>
                                <CardTitle>Tabla de Posiciones no Disponible</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>La tabla de posiciones se mostrará cuando comiencen los partidos.</p>
                            </CardContent>
                        </Card>
                    )}
                    
                    {/* Añadida comprobación para data.fixture */}
                    {data.fixture && <FixtureList games={data.fixture} />}
                </div>

                <div className="mt-12 text-center">
                    <Button asChild variant="secondary">
                        <Link href="/stats">
                            Ver Todas las Estadísticas
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}
