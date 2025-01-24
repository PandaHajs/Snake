import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface highScore {
  count: number;
  setState: (newScore: number) => void;
}

interface leaderboard {
  leaderboard: { name: string; score: number }[];
  setLeaderboard: (scores: { name: string; score: number }[]) => void;
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

export const useLeaderboard = create<leaderboard>()((set) => ({
  leaderboard: [],
  setLeaderboard: (leaderboard) => set({ leaderboard }),
}));
