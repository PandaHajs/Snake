"use client";
import { useGameCanvas } from "../lib/snakeCanvas.hook";
import styles from "./styles/canvas.module.scss";
import Modal from "./modal";
import { useHighScore } from "../store/store";

export default function GameCanvas() {
  const { canvasRef, setStart, restart, begin, high } = useGameCanvas();
  const score = useHighScore((state) => state.count);
  return (
    <div>
      <div className={styles.score}>
        <p>Score: {score}</p>
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
