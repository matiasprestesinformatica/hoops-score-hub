'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { produce } from 'immer';
import type { Game, ActionPayload } from '@/types';

export type SyncStatus = 'synced' | 'pending' | 'syncing' | 'error';

interface GameState {
  game: Game | null;
  pendingActions: ActionPayload[];
  syncStatus: SyncStatus;
  initializeGame: (game: Game) => void;
  updateGameMetadata: (game: Game) => void;
  addAction: (action: ActionPayload) => void;
  clearPendingActions: () => void;
  setSyncStatus: (status: SyncStatus) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      game: null,
      pendingActions: [],
      syncStatus: 'synced',
      
      // Initializes the store only if it's a new game or has no state
      initializeGame: (game) => {
        const currentGame = get().game;
        if (currentGame?.id !== game.id) {
          set({ game, pendingActions: [], syncStatus: 'synced' });
        }
      },

      // Updates non-stat parts of the game (status, period) without overriding player stats
      updateGameMetadata: (serverGame) => {
         set(produce((state: GameState) => {
            if (state.game && state.game.id === serverGame.id) {
              state.game.status = serverGame.status;
              state.game.currentPeriod = serverGame.currentPeriod;
            }
         }));
      },

      addAction: (action) =>
        set(
          produce((state: GameState) => {
            if (!state.game) return;

            const { payload } = action;
            const teamKey = state.game.teamA.players.some(p => p.player.id === payload.playerId) ? 'teamA' : 'teamB';
            
            const team = state.game[teamKey];
            const playerIndex = team.players.findIndex(p => p.player.id === payload.playerId);

            if (playerIndex === -1) return;

            const periodIndex = payload.period - 1;
            const stats = state.game[teamKey].players[playerIndex].statsByPeriod[periodIndex];

            if (action.type === 'shot') {
              const { points, made } = action.payload;
              if (points === 1) {
                stats.points1.attempted++;
                if (made) stats.points1.made++;
              } else if (points === 2) {
                stats.points2.attempted++;
                if (made) stats.points2.made++;
              } else {
                stats.points3.attempted++;
                if (made) stats.points3.made++;
              }
            } else if (action.type === 'stat') {
              const { stat } = action.payload;
              stats[stat]++;
            }
            
            state.pendingActions.push(action);
            state.syncStatus = 'pending';
          })
        ),
      clearPendingActions: () => set({ pendingActions: [], syncStatus: 'synced' }),
      setSyncStatus: (status) => set({ syncStatus: status }),
    }),
    {
      name: 'game-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
