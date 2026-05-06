import { create } from "zustand";

type AppState = {
  phase: "scaffold";
};

export const useAppStore = create<AppState>(() => ({
  phase: "scaffold",
}));
