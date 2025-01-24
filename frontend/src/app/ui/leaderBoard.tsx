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
  console.log(process.env.NEXT_PUBLIC_LEADERBOARD_API);
  const fetchLeaderBoard = async () => {
    const response = await axios.get(
      "https://130.162.46.124:8080/leaderboard/update"
    );
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
      useLeaderboard.setState({ leaderboard: JSON.parse(data).leaderboard });
    }
  }, [status]);

  return (
    <div className={s.leaderBoard}>
      <h2>Leaderboard</h2>
      {status === "pending" && <div>Loading...</div>}
      {status === "error" && <div>Error fetching data</div>}
      {status === "success" && (
        <ol>
          {leaderBoard.map((entry: LeaderBoardEntry, i) => {
            return (
              <li key={i}>
                {entry.name} - {entry.score}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
