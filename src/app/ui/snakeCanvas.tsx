"use client";
import { use, useEffect, useMemo, useRef, useState } from "react";
import styles from "./styles/canvas.module.scss";

type snakeHead = {
	mx: number;
	my: number;
	radius: number;
	color: string;
};

export default function GameCanvas() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
	const move = useRef<string | null>(null);
	const [begin, setBegin] = useState<boolean>(false);
	const [start, setStart] = useState<boolean>(false);
	const head = useMemo<snakeHead>(
		() => ({
			mx: roundNearest50(Math.random() * 550),
			my: roundNearest50(Math.random() * 550),
			radius: 50,
			color: "red",
		}),
		[],
	);

	function roundNearest50(num: number) {
		return Math.round(num / 50) * 50;
	}

	function draw(context: CanvasRenderingContext2D, head: snakeHead) {
		const direction = move.current;
		switch (direction) {
			case "ArrowUp":
				head.my -= 50;
				break;
			case "ArrowDown":
				head.my += 50;
				break;
			case "ArrowLeft":
				head.mx -= 50;
				break;
			case "ArrowRight":
				head.mx += 50;
				break;
		}
		context.clearRect(0, 0, 600, 600);
		context.fillStyle = head.color;
		context.fillRect(head.mx, head.my, head.radius, head.radius);
		setTimeout(() => {
			requestAnimationFrame(() => draw(context, head));
		}, 1000);
	}

	useEffect(() => {
		document.addEventListener("keydown", (e) => {
			move.current = e.key;
		});
		const canvas = canvasRef.current;
		if (canvas) {
			setCtx(canvas.getContext("2d"));
			if (ctx) {
				if (start) {
					setStart(false);
					setBegin(true);
					requestAnimationFrame(() => draw(ctx, head));
				}
			}
		}
		return () => {
			document.removeEventListener("keydown", (e) => {
				move.current = e.key;
			});
		};
	}, [ctx, move, begin, head, start]);

	return (
		<div className={styles.mid}>
			{!begin ? (
				<button type="button" onClick={() => setStart(true)}>
					Start
				</button>
			) : null}
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
