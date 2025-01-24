const app = require("express")();
const port = 8080;
const fs = require("fs");

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  res.setHeader("Access-Control-Allow-Methods", "GET, POST");

  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  res.setHeader("Access-Control-Allow-Credentials", true);

  next();
});

app.get("/leaderboard", (req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  const leaderboard = fs.readFileSync("leaderboard.json", "utf8");
  res.write(JSON.stringify(leaderboard));
  res.send();
});

app.post("/update", (req, res) => {
  req.on("data", (data) => {
    const { name, score } = JSON.parse(data);
    const leaderboard = fs.readFileSync("leaderboard.json", "utf8");
    const leaderboardArray = JSON.parse(leaderboard).leaderboard;
    leaderboardArray.push({ name, score });
    leaderboardArray.sort((a, b) => b.score - a.score);
    if (leaderboardArray.length > 10) leaderboardArray.pop();
    const newLeaderboard = JSON.stringify({ leaderboard: leaderboardArray });
    fs.writeFileSync("leaderboard.json", newLeaderboard);
  });

  res.writeHead(201);
  res.send();
});

app.get("/healthcheck", (req, res) => {
  res.writeHead(200);
  res.send();
});

app.listen(port, () => {
  console.log("server is running on port 8080");
});
