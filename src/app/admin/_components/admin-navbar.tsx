'use client';
import Link from 'next/link';
import { Dribbble, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { NavLink } from './nav-link';

export function AdminNavbar() {

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col bg-card">
          <SheetHeader>
            <SheetTitle className="sr-only">Menú de Navegación</SheetTitle>
          </SheetHeader>
          <nav className="grid gap-2 text-lg font-medium p-4">
            <SheetClose asChild>
              <Link
                href="/"
                className="flex items-center gap-2 text-lg font-semibold mb-4 text-foreground"
              >
                <Dribbble className="h-6 w-6 text-primary" />
                <span>Panel Principal</span>
              </Link>
            </SheetClose>
            <SheetClose asChild>
               <NavLink href="/admin" iconName="ClipboardList" exact>
                Equipos y Jugadores
              </NavLink>
            </SheetClose>
             <SheetClose asChild>
              <NavLink href="/admin/ligas" iconName="Trophy">
                Ligas
              </NavLink>
            </SheetClose>
            <SheetClose asChild>
              <NavLink href="/admin/config" iconName="Settings">
                Configuración
              </NavLink>
            </SheetClose>
          </nav>
        </SheetContent>
      </Sheet>
       <div className="w-full flex-1">
        {/* Puedes añadir un breadcrumb o título de página aquí si lo necesitas */}
       </div>
    </header>
  );
}
