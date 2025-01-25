import { create } from "zustand";

interface highScore {
  count: number;
  resetScore: () => void;
  inc: () => void;
}

interface leaderboard {
  leaderboard: { name: string; score: number }[];
  setLeaderboard: (scores: { name: string; score: number }[]) => void;
}

export const useHighScore = create<highScore>()((set) => ({
  count: 0,
  resetScore: () => set({ count: 0 }),
  inc: () => set((state) => ({ count: state.count + 1 })),
}));

export const useLeaderboard = create<leaderboard>()((set) => ({
  leaderboard: [],
  setLeaderboard: (leaderboard) => set({ leaderboard }),
}));
