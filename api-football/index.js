// index.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let matchData = {
  score: "0-0",
  events: []
};

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(express.static('public'));

// Endpoint to get the current match data
app.get('/match', (req, res) => {
  res.json(matchData);
});

// Endpoint to update the match score
app.post('/update-score', (req, res) => {
  const { score } = req.body;
  if (score) {
    matchData.score = score;
    io.sockets.emit('matchUpdate', matchData);
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
});

// Endpoint to add an event
app.post('/add-event', (req, res) => {
  const { time, description } = req.body;
  if (time && description) {
    const event = { time, description };
    matchData.events.push(event);
    io.sockets.emit('matchUpdate', matchData);
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
});

// WebSocket connection
io.on('connection', (socket) => {
  console.log('New client connected');

  // Send the current match data to the newly connected client
  socket.emit('matchUpdate', matchData);

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
