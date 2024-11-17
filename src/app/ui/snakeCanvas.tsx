"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./styles/canvas.module.scss";

export default function GameCanvas() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
	const head = {
		x: 50,
		y: 50,
		color: "red",
	};

	useEffect(() => {
		const canvas = canvasRef.current;
		if (canvas) {
			setCtx(canvas.getContext("2d"));
			if (ctx) {
				ctx.fillStyle = head.color;
				ctx.fillRect(50, 50, head.x, head.y);
			}
		}
	}, [ctx]);

	return (
		<div className={styles.mid}>
			<canvas
				width="600"
				height="600"
				ref={canvasRef}
				className={styles.canvas}
			/>
		</div>
	);
}
