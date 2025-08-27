import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Trophy, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// Mock data para desarrollo
const mockLeagues = [
  {
    id: '1',
    name: 'Liga Nacional',
    description: 'Liga profesional de baloncesto',
    status: 'ACTIVA',
    teams: 8,
    gamesPlayed: 24,
    currentSeason: 'Temporada 2024'
  },
  {
    id: '2', 
    name: 'Liga Regional',
    description: 'Competición regional de equipos locales',
    status: 'ACTIVA',
    teams: 6,
    gamesPlayed: 18,
    currentSeason: 'Temporada 2024'
  }
];

export function LeagueHighlights() {
  return (
    <section className="py-16 bg-gradient-to-b from-secondary/30 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-4">
            Ligas Destacadas
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explora las competiciones activas y mantente al día con los últimos resultados
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {mockLeagues.map((league) => (
            <Card key={league.id} className="bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{league.name}</CardTitle>
                  <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-500/20">
                    {league.status}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{league.description}</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-primary">{league.teams}</div>
                    <div className="text-sm text-muted-foreground">Equipos</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Trophy className="h-5 w-5 text-secondary" />
                    </div>
                    <div className="text-2xl font-bold text-secondary">{league.gamesPlayed}</div>
                    <div className="text-sm text-muted-foreground">Partidos</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Calendar className="h-5 w-5 text-accent" />
                    </div>
                    <div className="text-sm font-medium text-accent">{league.currentSeason}</div>
                  </div>
                </div>
                <Link to={`/leagues/${league.id}`}>
                  <Button className="w-full" variant="outline">
                    Ver Liga
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}