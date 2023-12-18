"use client";
import style from "./styles/start.module.scss";
import { useState } from "react";

export default function Start() {
  const [started, setStarted] = useState<boolean>(false);
  if (started) {
    const canvas = document.querySelector("canvas");
    canvas?.focus();
  }

  return (
    <div className={started ? style.hid : style.start}>
      <h2>Snake Game</h2>
      <button onClick={() => setStarted(true)}>Start game</button>
    </div>
  );
}
