"use client";
import { useGameCanvas } from "../lib/snakeCanvas.hook";
import styles from "./styles/canvas.module.scss";
import Modal from "./modal";

export default function GameCanvas() {
  const { canvasRef, score, setStart, restart, begin, highScore, high } =
    useGameCanvas();
  return (
    <div>
      <div className={styles.score}>
        <p>Score: {score}</p>
        <p>High Score: {highScore}</p>
      </div>
      <div className={styles.cDiv}>
        <Modal
          setStart={setStart}
          restart={restart}
          start={begin}
          high={high}
        />
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
