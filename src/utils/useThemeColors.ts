import { useColorScheme } from "react-native";

import { useUIStore } from "@/src/store/useUIStore";

export function useThemeColors() {
    const systemScheme = useColorScheme();
    const themeMode = useUIStore((s) => s.themeMode);
    const isDark =
        themeMode === 'system' ? systemScheme === 'dark' : themeMode === 'dark';

    return {
        isDark,
        bg: isDark ? '#0f172a' : '#f8fafc',
        card: isDark ? '#1e293b' : '#ffffff',
        text: isDark ? '#f1f5f9' : '#0f172a',
        textSecondary: isDark ? '#94a3b8' : '#64748b',
        border: isDark ? '#334155' : '#e2e8f0',
        primary: '#6366f1',
        primaryLight: isDark ? '#312e81' : '#eef2ff',
        danger: '#ef4444',
        dangerLight: isDark ? '#450a0a' : '#fef2f2',
        inputBg: isDark ? '#1e293b' : '#f1f5f9',
        inputBorder: isDark ? '#475569' : '#cbd5e1',
        placeholder: isDark ? '#64748b' : '#94a3b8',
    };
}
