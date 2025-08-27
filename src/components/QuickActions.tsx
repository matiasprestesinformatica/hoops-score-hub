import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { 
  Plus, 
  Play, 
  Users, 
  Trophy, 
  Calendar,
  Target,
  BarChart3,
  Settings 
} from "lucide-react";

export const QuickActions = () => {
  const actions = [
    {
      title: "Nuevo Partido",
      description: "Iniciar registro en vivo",
      icon: Play,
      variant: "hero" as const,
      primary: true
    },
    {
      title: "Agregar Equipo",
      description: "Registrar nuevo equipo",
      icon: Users,
      variant: "orange" as const
    },
    {
      title: "Nueva Liga",
      description: "Crear liga o temporada",
      icon: Trophy,
      variant: "court" as const
    },
    {
      title: "Programar Partido",
      description: "Agendar próximo encuentro",
      icon: Calendar,
      variant: "outline" as const
    },
    {
      title: "Gráfico de Tiros",
      description: "Vista interactiva de cancha",
      icon: Target,
      variant: "outline" as const
    },
    {
      title: "Estadísticas",
      description: "Ver reportes y análisis",
      icon: BarChart3,
      variant: "ghost" as const
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Acciones Rápidas
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Gestiona todos los aspectos de tus ligas de baloncesto desde un solo lugar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {actions.map((action, index) => (
            <Card 
              key={action.title}
              className="bg-gradient-card border-border/50 hover:shadow-court transition-all duration-300 hover:scale-105 group"
            >
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-basketball-orange/10">
                    <action.icon className="w-6 h-6 text-basketball-orange" />
                  </div>
                  <div>
                    <CardTitle className="text-foreground group-hover:text-basketball-orange transition-colors">
                      {action.title}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{action.description}</p>
                <Button 
                  variant={action.variant} 
                  className="w-full"
                  size={action.primary ? "lg" : "default"}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {action.primary ? "Comenzar Ahora" : "Crear"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};