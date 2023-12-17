"use client";
import { constants } from "crypto";
import { useEffect, useState, useRef, useMemo } from "react";

export default function Snake() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [score, setScore] = useState<number>(0);
  const [play, setPlay] = useState<boolean>(false);
  const [highScore, setHighScore] = useState<number>(0);
  const fps: number = 10;
  let tail: { x: number; y: number }[] = [];

  const head = useMemo(
    () => ({
      x: 250,
      y: 250,
      radius: 50,
      color: "white",
      vx: 0,
      vy: 0,
    }),
    []
  );

  const food = useMemo(
    () => ({
      x: roundNearest50(Math.random() * 550),
      y: roundNearest50(Math.random() * 550),
      radius: 50,
      color: "red",
    }),
    []
  );

  function roundNearest50(num: number) {
    return Math.round(num / 50) * 50;
  }

  function start(event: React.KeyboardEvent) {
    if ((event.key === "w" || event.key === "ArrowUp") && head.vy !== 50) {
      head.vy = -50;
      head.vx = 0;
    }
    if ((event.key === "s" || event.key === "ArrowDown") && head.vy !== -50) {
      head.vy = 50;
      head.vx = 0;
    }
    if ((event.key === "a" || event.key === "ArrowLeft") && head.vx !== 50) {
      head.vx = -50;
      head.vy = 0;
    }
    if ((event.key === "d" || event.key === "ArrowRight") && head.vx !== -50) {
      head.vx = 50;
      head.vy = 0;
    }
  }
  if (ctx) {
    ctx.fillStyle = head.color;
    ctx.fillRect(head.x, head.y, head.radius, head.radius);
  }

  function gameOver() {
    setScore(0);
    head.x = 250;
    head.y = 250;
    head.vx = 0;
    head.vy = 0;
    tail = [];
    food.x = roundNearest50(Math.random() * 550);
    food.y = roundNearest50(Math.random() * 550);
    return alert("Game Over");
  }
  useEffect(() => {
    const canvas = document.querySelector("canvas");
    canvas?.focus();
    if (canvasRef.current) setCtx(canvasRef.current.getContext("2d"));

    canvas?.addEventListener("keydown", draw);

    function draw() {
      setPlay(true);
      canvas?.removeEventListener("keydown", draw);
      if (ctx) {
        if (play) {
          return;
        }
        ctx.clearRect(0, 0, 600, 600);
        ctx.fillStyle = head.color;

        let nextPositions = [{ x: head.x, y: head.y }, ...tail];

        nextPositions.pop();

        if (
          head.x + head.vx > 550 ||
          head.x + head.vx < 0 ||
          head.y + head.vy > 550 ||
          head.y + head.vy < 0
        ) {
          gameOver();
          nextPositions = [];
        }
        head.x += head.vx;
        head.y += head.vy;
        ctx.fillRect(head.x, head.y, head.radius, head.radius);

        // eslint-disable-next-line react-hooks/exhaustive-deps
        tail = nextPositions;
        tail.forEach((part) => {
          ctx.fillStyle = "gray";
          ctx.fillRect(part.x, part.y, head.radius, head.radius);

          if (head.x === part.x && head.y === part.y) {
            gameOver();
            nextPositions = [];
          }
        });

        ctx.fillStyle = food.color;
        ctx.fillRect(food.x, food.y, food.radius, food.radius);
        if (head.x === food.x && head.y === food.y) {
          do {
            food.x = roundNearest50(Math.random() * 550);
            food.y = roundNearest50(Math.random() * 550);
          } while (
            tail.some((part) => part.x === food.x && part.y === food.y) ||
            (head.x === food.x && head.y === food.y)
          );

          setScore((score) => score + 1);
          console.log(score + " " + highScore);
          if (score > highScore) {
            setHighScore(score);
          }
          nextPositions.unshift({ x: head.x, y: head.y });
        }

        setTimeout(() => {
          requestAnimationFrame(draw);
        }, 1000 / fps);
      }
    }
  }, [ctx, fps, score, head, food, play, tail]);

  return (
    <div>
      <p>Score: {score}</p>
      <p>High score: {highScore}</p>
      <canvas
        tabIndex={0}
        ref={canvasRef}
        width="600"
        height="600"
        onKeyDown={start}
      />
    </div>
  );
}
