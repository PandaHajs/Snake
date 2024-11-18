"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./styles/canvas.module.scss";
import { draw, roundNearest50 } from "../lib/snakeLogic";
import type { snakeHead, snake } from "../lib/snakeLogic";

export default function GameCanvas() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
	const move = useRef<string>("");
	const [begin, setBegin] = useState<boolean>(false);
	const [start, setStart] = useState<boolean>(false);
	const animation = useRef<NodeJS.Timeout | null>(null);
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

	useEffect(() => {
		document.addEventListener("keydown", (e) => {
			move.current = e.key;
		});
		const canvas = canvasRef.current;
		if (canvas) {
			setCtx(canvas.getContext("2d"));
			if (ctx) {
				if (start) {
					move.current = "";
					setStart(false);
					setBegin(true);
					animation.current = setInterval(() => {
						requestAnimationFrame(() =>
							draw(
								tail,
								animation.current,
								move.current,
								ctx,
								head,
								setBegin,
								setStart,
							),
						);
					}, 1000 / 6);
				}
			}
		}
		return () => {
			document.removeEventListener("keydown", (e) => {
				move.current = e.key;
			});
		};
	}, [ctx, head, start, tail]);

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
