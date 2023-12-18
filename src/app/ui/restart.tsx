"use client";
import style from "./styles/start.module.scss";

export default function Restart(over: boolean, set: () => void) {
  /*if (over) {
    const canvas = document.querySelector("canvas");
    canvas?.focus();
  }*/

  return (
    <div className={over ? style.hid : style.start}>
      <h2>Game over!</h2>
      <button onClick={set}>Restart the game</button>
    </div>
  );
}
