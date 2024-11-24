"use client";
import { useGameCanvas } from "../lib/snakeCanvas.hook";
import styles from "./styles/canvas.module.scss";
import ReStart from "./reStart";

export default function GameCanvas() {
	const { canvasRef, score, highScore, setStart, restart, begin } =
		useGameCanvas();
	return (
		<div>
			<div className={styles.score}>
				<p>Score: {score}</p>
				<p>High Score: {highScore}</p>
			</div>
			<div className={styles.cDiv}>
				<ReStart setStart={setStart} restart={restart} start={begin} />
				<canvas
					width="600"
					height="600"
					ref={canvasRef}
					className={styles.canvas}
					tabIndex={-1}
				/>
			</div>
		</div>
	);
}
