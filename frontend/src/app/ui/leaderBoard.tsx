"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { useLeaderboard } from "../store/store";
import s from "./styles/leaderBoard.module.scss";

interface LeaderBoardEntry {
	name: string;
	score: number;
}

export default function LeaderBoard() {
	const fetchLeaderBoard = async (): Promise<LeaderBoardEntry[]> => {
		const response = await axios.get(
			"https://api.skowronski.one/snake/leaderboard",
		);
		if (response.status !== 200) {
			throw new Error("Error fetching data");
		}
		return response.data;
	};

	const { data, status } = useQuery({
		queryKey: ["leaderboard"],
		queryFn: fetchLeaderBoard,
		refetchInterval: 10000,
	});

	const leaderBoard = useLeaderboard(
		(state: { leaderboard: LeaderBoardEntry[] }) => state.leaderboard,
	);

	useEffect(() => {
		if (status === "success") {
			useLeaderboard.getState().setLeaderboard(data ?? []);
		}
	}, [status, data]);

	return (
		<div className={s.leaderBoard}>
			<h2>Leaderboard</h2>
			{status === "pending" && <div>Loading...</div>}
			{status === "error" && <div>Error fetching data</div>}
			{status === "success" && (
				<ol>
					{leaderBoard.map((entry: LeaderBoardEntry, i: number) => {
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
