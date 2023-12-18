import style from "./styles/dock.module.scss";

export default function Dock() {
  return (
    <div className={style.dock}>
      <h2>Game Controls</h2>
      <p>Use the arrow keys or WASD to move the snake.</p>
      <p>Press the spacebar to pause the game.</p>
      <p>Press the enter key to start a new game.</p>
    </div>
  );
}
