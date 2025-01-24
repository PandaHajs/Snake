"use client";
import { useQuery } from "@tanstack/react-query";
import s from "./styles/leaderBoard.module.scss";
import { useLeaderboard } from "../store/store";
import { useEffect } from "react";
import axios from "axios";
interface LeaderBoardEntry {
  name: string;
  score: number;
}

export default function LeaderBoard() {
  const fetchLeaderBoard = async () => {
    const response = await axios.get("http://localhost:3000/leaderboard");
    if (response.status !== 200) {
      throw new Error("Error fetching data");
    }
    return response.data;
  };

  const { data, status } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: fetchLeaderBoard,
  });

  const leaderBoard = useLeaderboard((state) => state.leaderboard);

  useEffect(() => {
    if (status === "success") {
      useLeaderboard.setState({ leaderboard: data });
    }
  }, [status]);

  return (
    <div className={s.leaderBoard}>
      <h2>Leaderboard</h2>
      {status === "pending" && <div>Loading...</div>}
      {status === "error" && <div>Error fetching data</div>}
      {status === "success" && (
        <ol>
          {leaderBoard.map((entry: LeaderBoardEntry) => {
            return (
              <li key={entry.name}>
                {entry.name} - {entry.score}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}