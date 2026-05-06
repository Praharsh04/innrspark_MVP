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

const DEMO_USER_STORAGE_KEY = "innrspark-demo-user";

const initialDemoUser = readStoredDemoUser();

export const useUserStore = create<UserState>((set) => ({
  isLoggedIn: Boolean(initialDemoUser),
  user: initialDemoUser,
  isLoading: false,
  error: null,
  login: (email) => {
    const user = { email, name: formatDemoName(email) };
    storeDemoUser(user);
    set({ isLoggedIn: true, user, error: null });
  },
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
    const demoUser = readStoredDemoUser();

    if (demoUser) {
      set({ isLoggedIn: true, isLoading: false, user: demoUser, error: null });
      return true;
    }

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
    clearStoredDemoUser();
    await signOut();
    set({ isLoggedIn: false, user: null, error: null });
  },
  clearError: () => set({ error: null }),
}));

function readStoredDemoUser(): UserState["user"] {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(DEMO_USER_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as UserState["user"]) : null;

    if (!parsed?.email) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function storeDemoUser(user: NonNullable<UserState["user"]>) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(user));
}

function clearStoredDemoUser() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(DEMO_USER_STORAGE_KEY);
}

function formatDemoName(email: string) {
  return email
    .split("@")[0]
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
