"use client";
import { useQuery } from "@tanstack/react-query";
import s from "./styles/leaderBoard.module.scss";
interface LeaderBoardEntry {
  name: string;
  score: number;
}

export default function LeaderBoard() {
  const fetchLeaderBoard = async () => {
    const response = await fetch("http://localhost:3000", { method: "GET" });
    const data = await response.json();
    return data;
  };

  const { data, status } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: fetchLeaderBoard,
  });

  return (
    <div className={s.leaderBoard}>
      <h2>Leaderboard</h2>
      {status === "pending" && <div>Loading...</div>}
      {status === "error" && <div>Error fetching data</div>}
      {status === "success" && (
        <ol>
          {data.map((entry: LeaderBoardEntry) => {
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
