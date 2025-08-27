import { StatsCard } from "./StatsCard";
import { Trophy, Users, Calendar, Target, TrendingUp, Clock } from "lucide-react";

export const DashboardStats = () => {
  const stats = [
    {
      title: "Ligas Activas",
      value: "12",
      description: "3 nuevas este mes",
      icon: Trophy,
      trend: "up" as const,
      trendValue: "+25%"
    },
    {
      title: "Equipos Registrados",
      value: "156",
      description: "en todas las ligas",
      icon: Users,
      trend: "up" as const,
      trendValue: "+12%"
    },
    {
      title: "Partidos Jugados",
      value: "489",
      description: "esta temporada",
      icon: Calendar,
      trend: "neutral" as const
    },
    {
      title: "Promedio de Tiros",
      value: "67%",
      description: "efectividad general",
      icon: Target,
      trend: "up" as const,
      trendValue: "+3%"
    },
    {
      title: "Puntos por Partido",
      value: "89.5",
      description: "promedio de la liga",
      icon: TrendingUp,
      trend: "up" as const,
      trendValue: "+5.2"
    },
    {
      title: "Tiempo Promedio",
      value: "2h 15m",
      description: "duración de partidos",
      icon: Clock,
      trend: "neutral" as const
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Estadísticas en Tiempo Real
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Mantén un seguimiento completo del rendimiento de tus ligas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <StatsCard key={stat.title} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
};