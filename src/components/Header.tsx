import { useState } from "react";
import { Button } from "./ui/button";
import { Menu, X, Trophy, Users, Calendar, BarChart3 } from "lucide-react";
import basketballIcon from "@/assets/basketball-icon.png";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: "Ligas", icon: Trophy, href: "#ligas" },
    { name: "Equipos", icon: Users, href: "#equipos" },
    { name: "Partidos", icon: Calendar, href: "#partidos" },
    { name: "Estadísticas", icon: BarChart3, href: "#stats" },
  ];

  return (
    <header className="bg-card/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img src={basketballIcon} alt="Basketball" className="w-10 h-10" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Hoops Hub</h1>
              <p className="text-sm text-muted-foreground hidden sm:block">Sistema de Gestión de Ligas</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                className="flex items-center space-x-2"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <Button variant="orange" size="sm" className="hidden sm:flex">
              Nuevo Partido
            </Button>
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 border-t border-border pt-4">
            <div className="space-y-2">
              {navItems.map((item) => (
                <Button
                  key={item.name}
                  variant="ghost"
                  className="w-full justify-start space-x-2"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Button>
              ))}
              <Button variant="orange" className="w-full mt-3">
                Nuevo Partido
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};