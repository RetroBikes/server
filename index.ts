import http from 'http';
import express from 'express';
import cors from 'cors';
import { Server } from 'colyseus';
import { monitor } from '@colyseus/monitor';

import GameRoom from './src/rooms/GameRoom';

const port = Number(process.env.PORT || 2567);
const app = express();


var allowedOrigins = [
  'http://localhost:3000',
  'https://retrobikes-client-react.herokuapp.com',
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin 
    // (like mobile apps or curl requests)
    if (! origin) {
      return callback(null, true);
    }
    if (-1 === allowedOrigins.indexOf(origin)) {
      const msg = 'The CORS policy for this site does not ' +
        'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

app.use(express.json());

const server = http.createServer(app);
const gameServer = new Server({
  server,
  express: app
});

// register your room handlers
gameServer.define('my_room', GameRoom);

// register colyseus monitor AFTER registering your room handlers
app.use('/colyseus', monitor(gameServer));

gameServer.listen(port);
console.log(`Listening on ws://localhost:${ port }`)
