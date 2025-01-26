import { Express } from "express";
import express from "express";
import fs from "fs";
import cors from "cors";
import CryptoJS from "crypto-js";

const app: Express = express();
const port = 3000;

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: [
    "X-Requested-With",
    "Origin",
    "Content-Type",
    "X-Auth-Token",
  ],
  Credentials: true,
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

app.get("/leaderboard", (req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  const leaderboard = fs.readFileSync("leaderboard.json", "utf8");
  res.write(JSON.stringify(leaderboard));
  res.send();
});

interface score {
  name: string;
  score: number;
}

app.post("/update", (req, res) => {
  const gameIDs = JSON.parse(fs.readFileSync("games.json", "utf8")).games;
  if (!gameIDs.includes(req.body.id)) {
    res.writeHead(404);
    res.send();
    return;
  }
  if (req.body.score < 0 || req.body.score > 144) {
    res.writeHead(400);
    res.send();
    return;
  }
  const { name, score } = req.body;
  const leaderboard = fs.readFileSync("leaderboard.json", "utf8");
  const leaderboardArray = JSON.parse(leaderboard).leaderboard;
  leaderboardArray.push({ name, score });
  leaderboardArray.sort((a: score, b: score) => b.score - a.score);
  if (leaderboardArray.length > 10) leaderboardArray.pop();
  const newLeaderboard = JSON.stringify({ leaderboard: leaderboardArray });
  fs.writeFileSync("leaderboard.json", newLeaderboard);
  gameIDs.splice(gameIDs.indexOf(req.body.id), 1);
  fs.writeFileSync("games.json", JSON.stringify({ games: gameIDs }));
  res.writeHead(201);
  res.send();
});

//TODO: Add timestamps

app.post("/game", (req, res) => {
  const gameID = Math.floor(Math.random() * 1000000);
  const currentGames = JSON.parse(fs.readFileSync("games.json", "utf8")).games;
  currentGames.push(gameID);
  fs.writeFileSync("games.json", JSON.stringify({ games: currentGames }));
  res.writeHead(201);
  res.write(
    CryptoJS.AES.encrypt(gameID.toString(), "very secret yes").toString()
  );
  res.send();
  setTimeout(() => {
    currentGames.games.splice(currentGames.games.indexOf(gameID), 1);
    fs.writeFileSync("games.json", JSON.stringify({ games: currentGames }));
  }, 600000);
});

app.get("/healthcheck", (req, res) => {
  res.writeHead(200);
  res.send();
});

app.listen(port, () => {
  console.log("server is running on port " + port);
});
