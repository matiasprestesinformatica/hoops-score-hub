'use client';
import Link from 'next/link';
import { Dribbble, Dot } from 'lucide-react';
import { NavLink } from './nav-link';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { usePathname } from 'next/navigation';

export function AdminSidebar() {
  const pathname = usePathname();
  
  // Extraer leagueId y seasonId de la URL actual
  const leagueMatch = pathname.match(/\/admin\/ligas\/([^/]+)/);
  const seasonMatch = pathname.match(/\/admin\/temporadas\/([^/]+)/);
  const leagueId = leagueMatch ? leagueMatch[1] : null;
  const seasonId = seasonMatch ? seasonMatch[1] : null;

  const isLeaguesSection = pathname.startsWith('/admin/ligas') || pathname.startsWith('/admin/temporadas');

  return (
    <div className="hidden border-r bg-card md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold text-foreground">
            <Dribbble className="h-6 w-6 text-primary" />
            <span>Panel Principal</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <NavLink href="/admin" iconName="ClipboardList" exact>
              Equipos y Jugadores
            </NavLink>
            
            <Collapsible open={isLeaguesSection}>
              <CollapsibleTrigger className="w-full">
                 <NavLink 
                    href="/admin/ligas" 
                    iconName="Trophy"
                    isActive={isLeaguesSection}
                    hasDropdown
                  >
                  Ligas
                </NavLink>
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-7 pt-1 space-y-1">
                 <NavLink href={`/admin/ligas/${leagueId}/temporadas`} iconName="Dot" disabled={!leagueId}>
                  Temporadas
                </NavLink>
                <NavLink href={`/admin/temporadas/${seasonId}/equipos`} iconName="Dot" disabled={!seasonId}>
                  Equipos
                </NavLink>
                <NavLink href={`/admin/temporadas/${seasonId}/fixture`} iconName="Dot" disabled={!seasonId}>
                  Fixture
                </NavLink>
              </CollapsibleContent>
            </Collapsible>

            <NavLink href="/admin/config" iconName="Settings">
              Configuración
            </NavLink>
          </nav>
        </div>
      </div>
    </div>
  );
}
