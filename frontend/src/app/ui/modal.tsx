"use client";
import styles from "./styles/canvas.module.scss";
import { useState } from "react";
import { useHighScore } from "../store/store";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export default function Modal(props: {
  setStart: React.Dispatch<React.SetStateAction<boolean>>;
  restart: boolean;
  start: boolean;
  high: boolean;
}) {
  const [name, setName] = useState("");
  const highScore = useHighScore((state) => state.count);
  const handleFormSubmit = (e) => {
    e.preventDefault();

    const newScore = { name: name, score: highScore };

    mutate(newScore);
  };

  const { mutate } = useMutation({
    mutationFn: async (body: { name: string; score: number }) => {
      const response = await axios.post("http://localhost:3000/update", body);
      return response.data;
    },
  });
  return (
    <>
      {props.start ? null : props.high ? (
        <div className={styles.reStart}>
          <h2>New high score!</h2>
          <form>
            <input
              type="text"
              placeholder="Enter your name"
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <button
              type="submit"
              onClick={(e) => {
                handleFormSubmit(e);
              }}
            >
              Submit
            </button>
          </form>
        </div>
      ) : (
        <div className={styles.reStart}>
          <h2>{props.restart ? "You lost :(" : "Welcome :)"}</h2>
          <p>
            {props.restart
              ? "Press the restart button to try again"
              : "Press the start button to begin"}
          </p>
          <button
            type="button"
            onClick={() => {
              props.setStart((prev) => !prev);
            }}
          >
            {props.restart ? "Restart" : "Start"}
          </button>
        </div>
      )}
    </>
  );
}
