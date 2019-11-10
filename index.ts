import http from 'http';
import express from 'express';
import { Server } from 'colyseus';
import { monitor } from '@colyseus/monitor';

import GameRoom from './src/rooms/GameRoom';

const allowCrossDomain = (req: any, res: any, next: any) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
    res.send(200);
  }
  else {
    next();
  }
};

const port = Number(3000);
const app = express();


app.use(allowCrossDomain);

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
