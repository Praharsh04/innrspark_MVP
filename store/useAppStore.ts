"use client";

import { create } from "zustand";

type AppState = {
  selectedCareer: string;
  completedTasks: string[];
  setSelectedCareer: (career: string) => void;
  toggleTask: (task: string) => void;
};

export const useAppStore = create<AppState>((set) => ({
  selectedCareer: "Product manager",
  completedTasks: ["Understand product roles", "Read 3 product case studies"],
  setSelectedCareer: (career) => set({ selectedCareer: career }),
  toggleTask: (task) =>
    set((state) => ({
      completedTasks: state.completedTasks.includes(task)
        ? state.completedTasks.filter((item) => item !== task)
        : [...state.completedTasks, task],
    })),
}));
