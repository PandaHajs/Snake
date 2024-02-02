"use client";
import style from "./styles/start.module.scss";
import { useState } from "react";

export default function Start() {
  const [started, setStarted] = useState<boolean>(false);
  const [check, setCheck] = useState<boolean>(false);
  if (started && !check) {
    const canvas = document.querySelector("canvas");
    canvas?.focus();
    setCheck(true);
    console.log("check");
  }

  return (
    <div className={started ? style.hid : style.start}>
      <h2>A Simple Snake Game</h2>
      <button className={style.btn} onClick={() => setStarted(true)}>
        Start
      </button>
    </div>
  );
}
