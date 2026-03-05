import { create } from "zustand";

type ThemeMode = 'light' | 'dark' | 'system';

interface UIState {
    version: number;
    themeMode: ThemeMode;
    backgroundSyncEnabled: boolean;
    setThemeMode: (mode: ThemeMode) => void;
    toggleBackgroundSync: () => void;
    refresh: () => void;
}

export const useUIStore = create<UIState>((set) => ({
    version: 0,
    themeMode: 'system',
    backgroundSyncEnabled: true,

    setThemeMode: (themeMode) => set({ themeMode }),
    toggleBackgroundSync: () => set((state) => ({ backgroundSyncEnabled: !state.backgroundSyncEnabled })),
    refresh: () => set((state) => ({ version: state.version + 1 })),
}));
