// server.js — Black Parade NYC
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/assets", express.static(path.join(__dirname, "assets")));

app.get("/", (req, res) => {
  res.redirect("/assets/index.html");
});

// json paths
const DATA_DIR = path.join(__dirname, "data");
const P_FILE = path.join(DATA_DIR, "profiles.json");
const W_FILE = path.join(DATA_DIR, "walls.json");

const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const write = (p, obj) => fs.writeFileSync(p, JSON.stringify(obj, null, 2));

// creatse data if missig
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
if (!fs.existsSync(P_FILE)) write(P_FILE, { profiles: [] });
if (!fs.existsSync(W_FILE)) write(W_FILE, { walls: {} });

// Profiles routes
app.get("/api/profiles", (req, res) => {
  const db = read(P_FILE);
  res.json(db.profiles.sort((a, b) => b.createdAt - a.createdAt));
});

app.post("/api/profiles", (req, res) => {
  const { username, bio = "", song = "", top8 = [] } = req.body;
  if (!username || !username.trim())
    return res.status(400).json({ error: "username required" });

  const db = read(P_FILE);
  if (
    db.profiles.some((p) => p.username.toLowerCase() === username.toLowerCase())
  )
    return res.status(409).json({ error: "username taken" });

  const id = "p" + Date.now();
  const profile = {
    id,
    username: username.trim(),
    bio,
    song,
    top8,
    createdAt: Date.now(),
  };

  db.profiles.push(profile);
  write(P_FILE, db);

  const walls = read(W_FILE);
  walls.walls[id] = [];
  write(W_FILE, walls);

  res.status(201).json(profile);
});

app.get("/api/profiles/:id", (req, res) => {
  const db = read(P_FILE);
  const profile = db.profiles.find((x) => x.id === req.params.id);
  if (!profile) return res.status(404).json({ error: "not found" });
  res.json(profile);
});

// Wall routes
app.get("/api/profiles/:id/wall", (req, res) => {
  const walls = read(W_FILE).walls;
  const posts = walls[req.params.id];
  if (!posts) return res.status(404).json({ error: "not found" });
  res.json(posts.sort((a, b) => b.createdAt - a.createdAt));
});

app.post("/api/profiles/:id/wall", (req, res) => {
  const { author = "anon", text } = req.body;
  if (!text || !text.trim())
    return res.status(400).json({ error: "text required" });

  const wallsDB = read(W_FILE);
  if (!wallsDB.walls[req.params.id])
    return res.status(404).json({ error: "profile wall not found" });

  const post = {
    id: "w" + Date.now(),
    author: (author || "anon").trim(),
    text: text.trim(),
    createdAt: Date.now(),
  };

  wallsDB.walls[req.params.id].unshift(post);
  write(W_FILE, wallsDB);
  res.status(201).json(post);
});

// feed
app.get("/api/feed", (req, res) => {
  const { walls } = read(W_FILE);
  const items = Object.values(walls).flat();
  res.json(items.sort((a, b) => b.createdAt - a.createdAt).slice(0, 20));
});

//  Start the server
app.listen(PORT, () =>
  console.log(
    ` Black Parade running at http://localhost:${PORT}/assets/index.html`
  )
);
