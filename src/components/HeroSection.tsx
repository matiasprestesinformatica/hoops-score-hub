import { Button } from "./ui/button";
import { Play, Trophy, BarChart3 } from "lucide-react";
import basketballCourtHero from "@/assets/basketball-court-hero.jpg";

export const HeroSection = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${basketballCourtHero})` }}
      >
        <div className="absolute inset-0 bg-basketball-dark/80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 animate-slide-up">
          Gestiona tus
          <span className="bg-gradient-hero bg-clip-text text-transparent"> Ligas</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-up">
          Plataforma completa para administrar equipos, jugadores y partidos en tiempo real
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
          <Button variant="hero" size="lg" className="group">
            <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Comenzar Partido
          </Button>
          
          <Button variant="court" size="lg">
            <Trophy className="w-5 h-5" />
            Ver Ligas
          </Button>

          <Button variant="ghost" size="lg">
            <BarChart3 className="w-5 h-5" />
            Estadísticas
          </Button>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-20 right-10 w-4 h-4 bg-basketball-orange rounded-full animate-basketball-bounce opacity-60"></div>
      <div className="absolute bottom-32 left-10 w-6 h-6 bg-basketball-blue rounded-full animate-basketball-bounce opacity-40" style={{ animationDelay: "0.3s" }}></div>
      <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-basketball-orange rounded-full animate-basketball-bounce opacity-50" style={{ animationDelay: "0.6s" }}></div>
    </section>
  );
};