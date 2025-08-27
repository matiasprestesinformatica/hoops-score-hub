import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Target, RotateCcw, Save } from "lucide-react";

interface ShotAttempt {
  x: number;
  y: number;
  made: boolean;
  id: number;
}

export const BasketballCourt = () => {
  const [shots, setShots] = useState<ShotAttempt[]>([]);
  const [nextId, setNextId] = useState(1);
  const [selectedShotType, setSelectedShotType] = useState<"made" | "missed">("made");

  const handleCourtClick = (e: React.MouseEvent<SVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newShot: ShotAttempt = {
      x,
      y,
      made: selectedShotType === "made",
      id: nextId
    };

    setShots([...shots, newShot]);
    setNextId(nextId + 1);
  };

  const clearShots = () => {
    setShots([]);
    setNextId(1);
  };

  const madeShots = shots.filter(shot => shot.made).length;
  const totalShots = shots.length;
  const percentage = totalShots > 0 ? Math.round((madeShots / totalShots) * 100) : 0;

  return (
    <section className="py-16 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Gráfico de Tiros Interactivo
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Registra tiros en tiempo real haciendo clic en la cancha
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-basketball-orange" />
                  <span>Registro de Tiros</span>
                </CardTitle>
                
                <div className="flex items-center space-x-3">
                  <div className="flex bg-muted rounded-lg p-1">
                    <Button
                      variant={selectedShotType === "made" ? "orange" : "ghost"}
                      size="sm"
                      onClick={() => setSelectedShotType("made")}
                    >
                      Acierto
                    </Button>
                    <Button
                      variant={selectedShotType === "missed" ? "destructive" : "ghost"}
                      size="sm"
                      onClick={() => setSelectedShotType("missed")}
                    >
                      Fallo
                    </Button>
                  </div>
                  
                  <Button variant="outline" size="sm" onClick={clearShots}>
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {/* Stats */}
              <div className="flex space-x-6 text-sm">
                <span className="text-muted-foreground">
                  Aciertos: <span className="text-green-500 font-semibold">{madeShots}</span>
                </span>
                <span className="text-muted-foreground">
                  Fallos: <span className="text-red-500 font-semibold">{totalShots - madeShots}</span>
                </span>
                <span className="text-muted-foreground">
                  Porcentaje: <span className="text-basketball-orange font-semibold">{percentage}%</span>
                </span>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="relative bg-gradient-court rounded-lg p-6 shadow-court">
                <svg
                  viewBox="0 0 400 200"
                  className="w-full h-auto cursor-crosshair border border-basketball-lines/20 rounded"
                  onClick={handleCourtClick}
                >
                  {/* Court background */}
                  <rect width="400" height="200" fill="hsl(var(--basketball-court-wood))" />
                  
                  {/* Court lines */}
                  <g stroke="hsl(var(--basketball-court-lines))" strokeWidth="2" fill="none">
                    {/* Outer bounds */}
                    <rect x="0" y="0" width="400" height="200" />
                    
                    {/* Center line */}
                    <line x1="200" y1="0" x2="200" y2="200" />
                    
                    {/* Center circle */}
                    <circle cx="200" cy="100" r="30" />
                    
                    {/* Three-point lines */}
                    <path d="M 60 0 A 80 80 0 0 1 60 200" />
                    <path d="M 340 0 A 80 80 0 0 0 340 200" />
                    
                    {/* Free throw lanes */}
                    <rect x="60" y="70" width="80" height="60" />
                    <rect x="260" y="70" width="80" height="60" />
                    
                    {/* Free throw circles */}
                    <circle cx="100" cy="100" r="30" />
                    <circle cx="300" cy="100" r="30" />
                    
                    {/* Baskets */}
                    <circle cx="10" cy="100" r="4" fill="hsl(var(--basketball-orange))" />
                    <circle cx="390" cy="100" r="4" fill="hsl(var(--basketball-orange))" />
                  </g>
                  
                  {/* Shot markers */}
                  {shots.map((shot) => (
                    <circle
                      key={shot.id}
                      cx={(shot.x / 100) * 400}
                      cy={(shot.y / 100) * 200}
                      r="4"
                      fill={shot.made ? "hsl(var(--basketball-orange))" : "#ef4444"}
                      stroke="white"
                      strokeWidth="1"
                      className="animate-ping"
                      style={{ 
                        animationDuration: "0.5s",
                        animationIterationCount: "1"
                      }}
                    />
                  ))}
                </svg>
                
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    Haz clic en la cancha para registrar tiros
                  </div>
                  
                  {shots.length > 0 && (
                    <Button variant="orange" size="sm">
                      <Save className="w-4 h-4 mr-2" />
                      Guardar Registro
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};