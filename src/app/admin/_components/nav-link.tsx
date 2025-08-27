'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, Users, User, ClipboardList, LucideIcon, Settings, Trophy, ChevronDown, Dot } from 'lucide-react';

const iconMap: { [key: string]: LucideIcon } = {
  Home,
  Users,
  User,
  ClipboardList,
  Settings,
  Trophy,
  Dot,
};

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  iconName: keyof typeof iconMap;
  exact?: boolean;
  isActive?: boolean;
  hasDropdown?: boolean;
  disabled?: boolean;
}

export function NavLink({ href, children, iconName, exact = false, isActive: isActiveProp, hasDropdown = false, disabled = false }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = isActiveProp ?? (exact ? pathname === href : pathname.startsWith(href));

  const Icon = iconMap[iconName];

  const linkContent = (
    <>
      {Icon && <Icon className="h-5 w-5" />}
      {children}
      {hasDropdown && <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />}
    </>
  );

  const className = cn(
    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors w-full',
    isActive
      ? 'bg-primary text-primary-foreground'
      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
    disabled && 'pointer-events-none opacity-50'
  );

  if (disabled) {
    return (
      <span className={className}>
        {linkContent}
      </span>
    );
  }
  
  return (
    <Link href={href} className={className}>
      {linkContent}
    </Link>
  );
}
