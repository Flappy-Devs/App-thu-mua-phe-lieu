import * as Linking from "expo-linking";
import { useCallback, useEffect } from "react";
import { AppState } from "react-native";

import { supabase } from "@/src/api";
import { useAuthStore } from "@/src/store/useAuthStore";

const redirectUrl = Linking.createURL('/');

/**
 * Auth service hook.
 *
 * Provides signUp / signIn / signOut and sets up:
 * - `onAuthStateChange` listener → updates Zustand auth store
 * - `AppState` listener → refreshes tokens when app comes to foreground
 * - Initializes sync engine on sign-in, tears down on sign-out
 */
export function useAuth() {
    const { setSession, clearSession } = useAuthStore();

    // ── Auth state listener ──────────────────────────────────────────────
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [setSession]);

    useEffect(() => {
        const handler = AppState.addEventListener('change', (state) => {
            if (state === 'active') {
                supabase.auth.startAutoRefresh();
            } else {
                supabase.auth.stopAutoRefresh();
            }
        });

        return () => {
            handler.remove();
        };
    }, []);


    const signUp = useCallback(
        async (email: string, password: string) => {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: { emailRedirectTo: redirectUrl },
            });
            if (error) throw error;
            return data;
        },
        [],
    );

    const signIn = useCallback(
        async (email: string, password: string) => {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
            return data;
        },
        [],
    );

    const signOut = useCallback(async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        clearSession();
    }, [clearSession]);

    const sendMagicLink = useCallback(async (email: string) => {
        const { data, error } = await supabase.auth.signInWithOtp({
            email,
            options: { emailRedirectTo: redirectUrl },
        });
        if (error) throw error;
        return data;
    }, []);

    return { signUp, signIn, signOut, sendMagicLink };
}
