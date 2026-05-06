import { create } from "zustand";

interface OnboardingState {
  currentIndex: number;
  setIndex: (index: number) => void;
  nextSlide: () => void;
  prevSlide: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  currentIndex: 0,
  setIndex: (index) => set({ currentIndex: index }),
  nextSlide: () => set((state) => ({ currentIndex: state.currentIndex + 1 })),
  prevSlide: () => set((state) => ({ currentIndex: Math.max(0, state.currentIndex - 1) })),
}));
