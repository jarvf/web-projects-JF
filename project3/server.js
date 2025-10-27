const express = require('express');
const path = require('path');
const app = express();

// Serve everything inside ./assets at the site root
app.use(express.static(path.join(__dirname, 'assets')));

// Home -> assets/index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'assets', 'index.html'));
});

// Guestbook page (also inside assets)
app.get('/guestbook', (req, res) => {
  res.sendFile(path.join(__dirname, 'assets', 'guestbook.html'));
});

// Simple in-memory notes API used by script.js
let allNotes = [];
app.get('/submit', (req, res) => {
  const { guest, note } = req.query;
  const time = new Date().toLocaleString();
  allNotes.push({ username: guest, message: note, date: time });
  res.redirect('/');
});
app.get('/all-messages', (req, res) => res.json({ notes: allNotes }));

app.listen(3001, () => {
  console.log('Server running on http://157.230.8.232:3001');
});
