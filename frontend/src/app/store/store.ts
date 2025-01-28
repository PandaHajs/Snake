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

interface gameID {
  gameID: number;
  setGameID: (gameID: number) => void;
}

interface lastMove {
  lastMove: string;
  setLastMove: (lastMove: string) => void;
}

interface lastViableMove {
  lastViableMove: string;
  setLastViableMove: (lastViableMove: string) => void;
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

export const useGameID = create<gameID>()((set) => ({
  gameID: 0,
  setGameID: (gameID: number) => set({ gameID }),
}));

export const useLastMove = create<lastMove>()((set) => ({
  lastMove: "",
  setLastMove: (lastMove: string) => set({ lastMove }),
}));

export const useLastViableMove = create<lastViableMove>()((set) => ({
  lastViableMove: "",
  setLastViableMove: (lastViableMove: string) => set({ lastViableMove }),
}));
