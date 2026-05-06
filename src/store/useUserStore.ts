import { create } from "zustand";
import {
  ensureProfile,
  getCurrentUserProfile,
  signInWithGoogle,
  signOut,
} from "@/lib/supabase/persistence";

interface UserState {
  isLoggedIn: boolean;
  user: {
    id?: string;
    name?: string;
    email?: string;
  } | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string) => void;
  loginWithGoogle: (redirectTo: string) => Promise<boolean>;
  hydrateFromSupabase: () => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  isLoggedIn: false,
  user: null,
  isLoading: false,
  error: null,
  login: (email) => set({ isLoggedIn: true, user: { email }, error: null }),
  loginWithGoogle: async (redirectTo) => {
    set({ isLoading: true, error: null });

    const result = await signInWithGoogle(redirectTo);

    if (result.skipped) {
      set({
        isLoggedIn: true,
        isLoading: false,
        user: { email: "google_user@example.com", name: "Mock Google User" },
        error: null,
      });
      return true;
    }

    if (result.error) {
      set({ isLoading: false, error: result.error });
      return false;
    }

    set({ isLoading: false });
    return true;
  },
  hydrateFromSupabase: async () => {
    set({ isLoading: true, error: null });

    const result = await ensureProfile();

    if (result.skipped) {
      set({ isLoading: false });
      return false;
    }

    if (result.error || !result.data) {
      const userResult = await getCurrentUserProfile();

      if (!userResult.data) {
        set({ isLoading: false, error: result.error ?? userResult.error });
        return false;
      }

      set({
        isLoggedIn: true,
        isLoading: false,
        user: {
          id: userResult.data.id,
          email: userResult.data.email ?? undefined,
          name: userResult.data.name ?? undefined,
        },
        error: result.error,
      });

      return true;
    }

    const profile = result.data;

    set({
      isLoggedIn: Boolean(profile),
      isLoading: false,
      user: profile
        ? {
            id: profile.id,
            email: profile.email ?? undefined,
            name: profile.name ?? undefined,
          }
        : null,
    });

    return Boolean(profile);
  },
  logout: async () => {
    await signOut();
    set({ isLoggedIn: false, user: null, error: null });
  },
  clearError: () => set({ error: null }),
}));
