"use client";
import { useEffect, useState, useRef } from "react";

export default function Snake() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  const head = {
    x: 275,
    y: 275,
    radius: 25,
    color: "white",
    vx: 0,
    vy: 0,
  };

  useEffect(() => {
    if (canvasRef.current) setCtx(canvasRef.current.getContext("2d"));
  }, [canvasRef]);

  useEffect(() => {
    if (ctx) {
      ctx.fillStyle = head.color;
      ctx.fillRect(head.x, head.y, head.radius, head.radius);
    }
  }, [ctx, head.color, head.radius, head.x, head.y]);

  function start(event: React.KeyboardEvent) {
    if (event.key === "ArrowUp") {
      head.vy = -5;
      head.vx = 0;
    }
    if (event.key === "ArrowDown") {
      head.vy = 5;
      head.vx = 0;
    }
    if (event.key === "ArrowLeft") {
      head.vx = -5;
      head.vy = 0;
    }
    if (event.key === "ArrowRight") {
      head.vx = 5;
      head.vy = 0;
    }
    if (event.key === "Space") {
      head.vx = 0;
      head.vy = 0;
    }
    draw();
  }

  function draw() {
    if (ctx) {
      ctx.clearRect(0, 0, 600, 600);
      ctx.fillStyle = head.color;
      if (head.x + head.vx > 600 || head.x + head.vx < 0) head.vx = -head.vx;
      if (head.y + head.vy > 600 || head.y + head.vy < 0) head.vy = -head.vy;
      ctx.fillRect(
        head.x + head.vx,
        head.y + head.vy,
        head.radius,
        head.radius
      );
      head.x += head.vx;
      head.y += head.vy;
      requestAnimationFrame(draw);
    }
  }

  return (
    <canvas
      tabIndex={0}
      ref={canvasRef}
      width="600"
      height="600"
      onKeyDown={start}
    />
  );
}
