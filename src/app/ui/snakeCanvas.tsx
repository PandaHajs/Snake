"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./styles/canvas.module.scss";
import { draw, roundNearest50 } from "../lib/snakeLogic";
import type { snakeHead, snake, food } from "../lib/snakeLogic";

export default function GameCanvas() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
	const move = useRef<string>("");
	const [begin, setBegin] = useState<boolean>(false);
	const [start, setStart] = useState<boolean>(false);
	const animation = useRef<NodeJS.Timeout | null>(null);
	const [score, setScore] = useState<number>(0);
	const [highScore, setHighScore] = useState<number>(
		Number.parseInt(window.localStorage.getItem("highScore") || "0"),
	);
	const highScoreTest = useRef<number>(0);

	const head = useMemo<snakeHead>(
		() => ({
			mx: roundNearest50(Math.random() * 500),
			my: roundNearest50(Math.random() * 550),
			vx: 0,
			vy: 0,
			radius: 50,
			color: "white",
		}),
		[],
	);

	const tail = useMemo<snake>(
		() => ({
			radius: 50,
			color: "grey",
			tail: [{ x: head.mx + 50, y: head.my }],
		}),
		[head.mx, head.my],
	);

	const food = useMemo<food>(
		() => ({
			x: roundNearest50(Math.random() * 500),
			y: roundNearest50(Math.random() * 500),
			radius: 50,
			color: "green",
		}),
		[],
	);

	useEffect(() => {
		document.addEventListener("keydown", (e) => {
			move.current = e.key;
		});
		const canvas = canvasRef.current;
		if (canvas) {
			ctxRef.current = canvas.getContext("2d");
			if (start) {
				move.current = "";
				setStart(false);
				setBegin(true);
				setScore(0);
				setHighScore(
					Number.parseInt(window.localStorage.getItem("highScore") || "0"),
				);
				animation.current = setInterval(() => {
					requestAnimationFrame(() => {
						if (ctxRef.current)
							draw(
								food,
								tail,
								animation.current,
								move.current,
								ctxRef.current,
								head,
								setBegin,
								setStart,
								setScore,
								score,
								setHighScore,
								highScore,
							);
					});
				}, 1000 / 8);
			}
		}
		return () => {
			document.removeEventListener("keydown", (e) => {
				move.current = e.key;
			});
		};
	}, [head, start, tail, food, score, highScore]);

	return (
		<div className={styles.mid}>
			{!begin ? (
				<button type="button" onClick={() => setStart(true)}>
					Start
				</button>
			) : null}
			<div className={styles.score}>
				<p>Score: {score}</p>
				<p>High Score: {highScore}</p>
			</div>
			<canvas
				width="600"
				height="600"
				ref={canvasRef}
				className={styles.canvas}
				tabIndex={-1}
			/>
		</div>
	);
}
