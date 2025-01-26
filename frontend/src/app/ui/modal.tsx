"use client";
import styles from "./styles/canvas.module.scss";
import { FormEvent, useEffect, useState } from "react";
import { useGameID, useHighScore } from "../store/store";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import CryptoJS from "crypto-js";

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
  const gameID = useGameID((state) => state.gameID);

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const decryptedID = parseInt(
      CryptoJS.AES.decrypt(gameID.toString(), "very secret yes").toString(
        CryptoJS.enc.Utf8
      )
    );

    const newScore = {
      name: name,
      score: highScore,
      id: decryptedID,
    };
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
        //"https://api.skowronski.one/update",
        "http://localhost:3000/update",
        body
      );
      return response;
    },
  });

  const fetchGameID = async () => {
    const response = await axios.post("http://localhost:3000/game"); //"https://api.skowronski.one/game");
    if (response.status !== 201) {
      throw new Error("Error");
    }
    return response.data;
  };

  const { data, status, refetch } = useQuery({
    queryKey: ["gameID"],
    queryFn: fetchGameID,
    enabled: false,
  });

  useEffect(() => {
    if (status === "success") {
      useGameID.setState({ gameID: data });
      props.setStart((prev) => !prev);
    }
  }, [status, data]);

  const startGame = async () => {
    refetch();
  };
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
              maxLength={25}
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
              startGame();
            }}
          >
            {props.restart ? "Restart" : "Start"}
          </button>
        </div>
      )}
    </>
  );
}
