const http = require("http");
const fs = require("fs");
const port = 3000;

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  res.writeHead(200, { "Content-Type": "application/json" });
  const leaderboard = fs.readFileSync("leaderboard.txt", "utf8");
  res.write(JSON.stringify(leaderBoardArrayify(leaderboard)));
  res.end();
});

server.listen(port, (error) => {
  if (error) return console.log("Error: ", error);
  console.log("Server is listening on port: " + port);
});

const leaderBoardArrayify = (leaderboard) => {
  return leaderboard.split("\n").map((line) => {
    const [name, score] = line.split(" ");
    return { name, score: parseInt(score) };
  });
};
