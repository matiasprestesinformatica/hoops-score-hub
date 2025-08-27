import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock } from 'lucide-react';

// Mock data para desarrollo
const upcomingGames = [
  {
    id: '1',
    homeTeam: { name: 'Lakers', city: 'Los Angeles' },
    awayTeam: { name: 'Celtics', city: 'Boston' },
    scheduledDate: new Date('2024-02-15T20:00:00'),
    status: 'PROGRAMADO',
    league: 'NBA'
  },
  {
    id: '2', 
    homeTeam: { name: 'Warriors', city: 'Golden State' },
    awayTeam: { name: 'Bulls', city: 'Chicago' },
    scheduledDate: new Date('2024-02-16T21:30:00'),
    status: 'PROGRAMADO',
    league: 'NBA'
  }
];

const recentGames = [
  {
    id: '3',
    homeTeam: { name: 'Nets', city: 'Brooklyn' },
    awayTeam: { name: 'Heat', city: 'Miami' },
    homeScore: 108,
    awayScore: 102,
    status: 'FINALIZADO',
    league: 'NBA'
  }
];

export function FixtureList() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Calendario de Partidos</h2>
          <p className="text-muted-foreground">Próximos encuentros y resultados recientes</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Próximos Partidos */}
          <div>
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Próximos Partidos
            </h3>
            
            <div className="space-y-4">
              {upcomingGames.map((game) => (
                <Card key={game.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="font-medium">{game.homeTeam.name}</div>
                          <div className="text-sm text-muted-foreground">vs</div>
                          <div className="font-medium">{game.awayTeam.name}</div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                          <Clock className="h-4 w-4" />
                          {game.scheduledDate.toLocaleDateString('es-ES')}
                        </div>
                        <div className="text-sm font-medium">
                          {game.scheduledDate.toLocaleTimeString('es-ES', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                        <Badge variant="outline" className="mt-2">
                          {game.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Resultados Recientes */}
          <div>
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Clock className="h-5 w-5 text-secondary" />
              Resultados Recientes
            </h3>
            
            <div className="space-y-4">
              {recentGames.map((game) => (
                <Card key={game.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="font-medium">{game.homeTeam.name}</div>
                          <div className="text-2xl font-bold text-primary">{game.homeScore}</div>
                        </div>
                        <div className="text-center text-muted-foreground">
                          <div className="text-sm">vs</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{game.awayTeam.name}</div>
                          <div className="text-2xl font-bold text-secondary">{game.awayScore}</div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <Badge variant="secondary">
                          {game.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}