import { createContext, useContext } from 'react';
import type { User } from '@/types';

export type Route =
  | { name: 'login' }
  | { name: 'dashboard' }
  | { name: 'cases' }
  | { name: 'case-details'; id: string }
  | { name: 'documents' }
  | { name: 'document-details'; id: string }
  | { name: 'upload' }
  | { name: 'ai-assistant' }
  | { name: 'audit' }
  | { name: 'security' }
  | { name: 'settings' };

export interface AppState {
  route: Route;
  navigate: (route: Route) => void;
  user: User;
  logout: () => void;
}

export const AppContext = createContext<AppState | null>(null);

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
