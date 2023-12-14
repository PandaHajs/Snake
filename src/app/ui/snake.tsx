"use client";
import { useEffect, useState, useRef, useMemo } from "react";

export default function Snake() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [score, setScore] = useState<number>(0);
  const [play, setPlay] = useState<boolean>(false);
  const fps: number = 15;

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
    if (event.key === "ArrowUp") {
      head.vy = -50;
      head.vx = 0;
    }
    if (event.key === "ArrowDown") {
      head.vy = 50;
      head.vx = 0;
    }
    if (event.key === "ArrowLeft") {
      head.vx = -50;
      head.vy = 0;
    }
    if (event.key === "ArrowRight") {
      head.vx = 50;
      head.vy = 0;
    }
    if (event.code === "Space") {
      head.vx = 0;
      head.vy = 0;
    }
  }
  const canvas = document.querySelector("canvas");

  useEffect(() => {
    canvas?.focus();
    if (canvasRef.current) setCtx(canvasRef.current.getContext("2d"));

    canvas?.addEventListener("keydown", draw);

    if (ctx) {
      ctx.fillStyle = head.color;
      ctx.fillRect(head.x, head.y, head.radius, head.radius);
    }
    function draw() {
      setPlay(true);
      canvas?.removeEventListener("keydown", draw);
      if (ctx) {
        ctx.clearRect(0, 0, 600, 600);
        ctx.fillStyle = head.color;
        if (head.x + head.vx > 550 || head.x + head.vx < 0) head.vx = -head.vx;
        if (head.y + head.vy > 550 || head.y + head.vy < 0) head.vy = -head.vy;
        ctx.fillRect(head.x, head.y, head.radius, head.radius);
        head.x += head.vx;
        head.y += head.vy;
        ctx.fillStyle = food.color;
        ctx.fillRect(food.x, food.y, food.radius, food.radius);
        if (head.x === food.x && head.y === food.y) {
          food.x = roundNearest50(Math.random() * 550);
          food.y = roundNearest50(Math.random() * 550);
          setScore((score) => score + 1);
        }
        if (play) {
          return;
        }
        setTimeout(() => {
          requestAnimationFrame(draw);
        }, 1000 / fps);
      }
    }
  }, [ctx, fps, score, head, food, play, canvas]);

  return (
    <div>
      <p>Score: {score}</p>
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
