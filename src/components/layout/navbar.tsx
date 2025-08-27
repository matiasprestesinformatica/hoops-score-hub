'use client';

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart3, Play, ClipboardList, Dribbble, Menu, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";
import { Button } from '../ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const navLinks = [
  { href: '/', label: 'Principal', icon: Home },
  { href: '/game', label: 'Partidos', icon: Play },
  { href: '/partidos', label: 'Partidos (Prueba)', icon: Play },
  { href: '/equipos', label: 'Equipos', icon: Users },
  { href: '/stats', label: 'Estadísticas', icon: BarChart3 },
  { href: '/admin', label: 'Administración', icon: ClipboardList },
];

interface NavLinkProps {
    href: string;
    label: string;
    icon: React.ElementType;
    className?: string;
}

const NavLink = ({ href, label, icon: Icon, className }: NavLinkProps) => {
  const location = useLocation();
  const pathname = location.pathname;
  const isActive = (pathname === href) || (pathname.startsWith(href) && href !== '/');

  return (
    <Link
      to={href}
      className={cn(
        'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
        className
      )}
    >
      <Icon className="h-5 w-5" />
      {label}
    </Link>
  );
};

interface NavbarProps {
    title: string;
    logoUrl: string | null;
}

export function Navbar({ title, logoUrl }: NavbarProps) {
  const location = useLocation();
  const pathname = location.pathname;
  const [isScrolled, setIsScrolled] = useState(false);
  const isMobile = useIsMobile();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const isImmersivePage = /^\/(game|partidos|shot-chart)\/[^/]+/.test(pathname);

  if (isImmersivePage) {
    return null; 
  }

  const renderNavContent = () => {
    if (!isMounted) {
      return <div className="h-8 w-8 md:hidden" />; // Placeholder to prevent layout shift
    }

    if (isMobile) {
      return (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Abrir menú</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px]">
            <SheetHeader>
              <SheetTitle className="sr-only">Menú de Navegación</SheetTitle>
            </SheetHeader>
              <div className="p-4">
                   <Link to="/" className="flex items-center gap-2 text-primary font-bold text-lg mb-8">
                      {logoUrl ? (
                        <img src={logoUrl} alt={`${title} logo`} className="h-8 w-8 object-contain"/>
                      ) : (
                        <Dribbble className="h-6 w-6" />
                      )}
                      <span>{title}</span>
                  </Link>
                  <div className="flex flex-col space-y-2">
                      {navLinks.map((link) => (
                         <SheetClose asChild key={link.href}>
                           <NavLink {...link} className="text-base" />
                         </SheetClose>
                      ))}
                  </div>
              </div>
          </SheetContent>
        </Sheet>
      );
    }

    return (
      <div className="hidden md:flex items-center space-x-2">
        {navLinks.map((link) => (
          <NavLink key={link.href} {...link} />
        ))}
      </div>
    );
  };

  return (
    <nav className={cn(
      "fixed top-0 z-50 w-full bg-background/80 backdrop-blur-sm transition-all duration-300",
      isScrolled && "border-b border-border shadow-lg"
    )}>
      <div className="container mx-auto flex items-center justify-between h-16 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 text-primary font-bold text-lg">
          {logoUrl ? (
            <img src={logoUrl} alt={`${title} logo`} className="h-8 w-8 object-contain"/>
          ) : (
            <Dribbble className="h-6 w-6" />
          )}
          <span>{title}</span>
        </Link>
        
        {renderNavContent()}

      </div>
    </nav>
  );
}