'use client';

import { useGameStore } from '@/store/use-game-store';
import { CheckCircle, Clock, LoaderCircle, AlertTriangle } from 'lucide-react';

export function SyncStatusIndicator() {
  const syncStatus = useGameStore((state) => state.syncStatus);
  const pendingActionCount = useGameStore((state) => state.pendingActions.length);

  const statusInfo = {
    synced: {
      icon: <CheckCircle className="h-4 w-4 text-green-500" />,
      text: 'Sincronizado',
      className: 'text-green-500',
    },
    pending: {
      icon: <Clock className="h-4 w-4 text-orange-400" />,
      text: `${pendingActionCount} ${pendingActionCount === 1 ? 'acción pendiente' : 'acciones pendientes'}`,
      className: 'text-orange-400',
    },
    syncing: {
      icon: <LoaderCircle className="h-4 w-4 animate-spin" />,
      text: 'Sincronizando...',
      className: 'text-muted-foreground',
    },
    error: {
      icon: <AlertTriangle className="h-4 w-4 text-destructive" />,
      text: 'Error de sincronización',
      className: 'text-destructive',
    },
  };

  const currentStatus = statusInfo[syncStatus];

  return (
    <div className={`flex items-center gap-2 text-xs font-medium ${currentStatus.className}`}>
      {currentStatus.icon}
      <span>{currentStatus.text}</span>
    </div>
  );
}
