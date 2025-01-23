import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface highScore {
  count: number;
  setState: (newScore: number) => void;
}

export const useHighScore = create<highScore>()(
  persist(
    (set) => ({
      count: 0,
      setState: (count) => set({ count }),
    }),
    {
      name: "highScore",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useLeaderboard = create((set) => ({
  scores: [],
}));
