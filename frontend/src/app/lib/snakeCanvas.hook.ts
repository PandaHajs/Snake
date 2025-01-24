import type { snakeHead, snake, food } from "../lib/snakeLogic";
import { draw, roundNearest50 } from "../lib/snakeLogic";
import { useEffect, useRef, useState } from "react";
import { useHighScore, useLeaderboard } from "../store/store";

export function useGameCanvas(): {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  setStart: React.Dispatch<React.SetStateAction<boolean>>;
  restart: boolean;
  begin: boolean;
  high: boolean;
} {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const move = useRef<string>("");
  const [begin, setBegin] = useState<boolean>(false);
  const [start, setStart] = useState<boolean>(false);
  const animation = useRef<NodeJS.Timeout | null>(null);
  const [restart, setRestart] = useState<boolean>(false);
  const incHighscore = useHighScore((state) => state.inc);
  const resetHighscore = useHighScore((state) => state.resetScore);
  const [high, setHigh] = useState<boolean>(false);
  let cumulativeDistances: Array<number> = [
    0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50,
  ];
  let result:
    | [snakeHead, snake, food, Array<{ x: number; y: number }>, Array<number>]
    | undefined;

  let head: snakeHead = {
    mx: roundNearest50(Math.random() * 500),
    my: roundNearest50(Math.random() * 550),
    vx: 0,
    vy: 0,
    radius: 50,
    color: "white",
  };

  let tail: snake = {
    radius: 50,
    color: "grey",
    tail: [{ x: head.mx + 50, y: head.my }],
  };

  let food: food = {
    x: roundNearest50(Math.random() * 500),
    y: roundNearest50(Math.random() * 500),
    radius: 50,
    color: "green",
  };
  let positionHistory: Array<{ x: number; y: number }> = [
    { x: tail.tail[0].x, y: tail.tail[0].y },
    { x: head.mx + 45, y: head.my },
    { x: head.mx + 40, y: head.my },
    { x: head.mx + 35, y: head.my },
    { x: head.mx + 30, y: head.my },
    { x: head.mx + 25, y: head.my },
    { x: head.mx + 20, y: head.my },
    { x: head.mx + 15, y: head.my },
    { x: head.mx + 10, y: head.my },
    { x: head.mx + 5, y: head.my },
    { x: head.mx, y: head.my },
  ];
  // biome-ignore lint/correctness/useExhaustiveDependencies: None of specified dependencies are needed, and shouldn't be used since they change every render
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
        setRestart(true);
        setHigh(false);
        resetHighscore();
        animation.current = setInterval(() => {
          requestAnimationFrame(() => {
            if (ctxRef.current)
              result = draw(
                food,
                tail,
                animation.current,
                move.current,
                ctxRef.current,
                head,
                setBegin,
                setStart,
                incHighscore,
                positionHistory,
                cumulativeDistances,
                setHigh
              );
            if (result) {
              [head, tail, food, positionHistory, cumulativeDistances] = result;
            }
          });
        }, 1000 / 60);
      }
    }
    return () => {
      document.removeEventListener("keydown", (e) => {
        move.current = e.key;
      });
    };
  }, [start]);
  return { canvasRef, setStart, restart, begin, high };
}
