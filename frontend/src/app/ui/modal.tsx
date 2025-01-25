"use client";
import styles from "./styles/canvas.module.scss";
import { FormEvent, useState } from "react";
import { useHighScore } from "../store/store";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export default function Modal(props: {
  setStart: React.Dispatch<React.SetStateAction<boolean>>;
  restart: boolean;
  start: boolean;
  high: boolean;
  setHigh: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [name, setName] = useState("");
  const highScore = useHighScore((state) => state.count);
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const newScore = { name: name, score: highScore };
    new Promise((resolve, reject) => {
      setLoading(true);
      mutateAsync(newScore).then((status) => {
        if (status.status !== 201) {
          reject("Error");
        }
        resolve("Success");
      });
    }).then(() => {
      setLoading(false);
      props.setHigh(false);
      setName("");
    });
  };

  const { mutateAsync } = useMutation({
    mutationFn: async (body: { name: string; score: number }) => {
      const response = await axios.post(
        "https://api.skowronski.one/update",
        body
      );
      return response;
    },
  });
  return (
    <>
      {props.start ? null : props.high ? (
        <div className={styles.reStart}>
          <h2>New high score!</h2>
          <form onSubmit={handleFormSubmit}>
            <input
              type="text"
              placeholder="Enter your name"
              onChange={(e) => {
                setName(e.target.value);
              }}
              minLength={3}
              maxLength={12}
              required
            />
            <button type="submit" disabled={loading}>
              Submit
            </button>
          </form>
          <button type="button" onClick={() => props.setHigh(false)}>
            Skip
          </button>
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
