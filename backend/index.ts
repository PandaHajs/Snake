const app = require("express")();
const port = 3000;
const fs = require("fs");

const leaderBoardArrayify = (leaderboard) => {
  return leaderboard.split("\n").map((line) => {
    const [name, score] = line.split(" ");
    return { name, score: parseInt(score) };
  });
};

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  res.setHeader("Access-Control-Allow-Credentials", true);

  next();
});

app.get("/leaderboard", (req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  const leaderboard = fs.readFileSync("leaderboard.txt", "utf8");
  res.write(JSON.stringify(leaderBoardArrayify(leaderboard)));
  res.end();
});

app.post("/update", (req, res) => {
  req.on("data", (data) => {
    const { name, score } = JSON.parse(data);
    const leaderboard = fs.readFileSync("leaderboard.txt", "utf8");
    const leaderboardArray = leaderBoardArrayify(leaderboard);
    leaderboardArray.push({ name, score });
    leaderboardArray.sort((a, b) => b.score - a.score);
    const updatedLeaderboard = leaderboardArray
      .map((entry) => `${entry.name} ${entry.score}`)
      .join("\n");
    if (leaderboardArray.length > 10) updatedLeaderboard.pop();
    fs.writeFileSync("leaderboard.txt", updatedLeaderboard);
  });
});

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
