"use client";
import style from "./styles/start.module.scss";

interface MyComponentProps {
  over: boolean;
  onClick: () => void;
}

const Restart: React.FC<MyComponentProps> = ({ over, onClick }) => {
  return (
    <div className={over ? style.start : style.hid}>
      <h2>Game over!</h2>
      <button className={style.btn} onClick={onClick}>
        Restart the game
      </button>
    </div>
  );
};

export default Restart;
