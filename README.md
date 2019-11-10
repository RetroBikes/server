![RetroBikes demo](https://avatars3.githubusercontent.com/u/54962401?s=150)
# RetroBikes server
Game server side, do all the complex logics and let the clients show the game state on screen and send direction changing events.

## 🏃 Run the server
 * `git clone https://github.com/RetroBikes/server.git`
 * `cd server`
 * `npm install`
 * `npm start`

## 📄 Gameconfig quick reference
This file will set the initial state for your game:
   * The clients number to start the game;
   * the virtual area size (a.k.a the area size based on the number of steps);
   * the initial players states, as the start position and direction.

On start positions, negative values means counting from right (on x axis) or bottom (on y axis). Just like a Python array.

This would be a great place to set the players default colors, by example.

__The array on initialStates can't have minus items than clientsToPlay number or the server will break down by the initial player states information lack.__

Gameconfig file example, this considers four players, starting on each corner of the game area:
```json
{
    "clientsToPlay": 4,
    "areaVirtualSize": 150,
    "initialStates": [
        {
            "startPosition": {
                "x": 10,
                "y": 10
            },
            "initialDirection": "right"
        },
        {
            "startPosition": {
                "x": -10,
                "y": -10
            },
            "initialDirection": "left"
        },
        {
            "startPosition": {
                "x": -10,
                "y": 10
            },
            "initialDirection": "down"
        },
        {
            "startPosition": {
                "x": 10,
                "y": -10
            },
            "initialDirection": "up"
        }
    ]
}
```

## 💻📲 The client / server communication
All the heavy logics happen in the server side. The game loop, player steps, collision calculation and goes on. The client side is the simpliest thing possible, just receives the last players virtual location (confused? check the below section) to render on the screen and send the movement events to server. Just like this.  
Thanks to [Colyseus](https://colyseus.io/) people for this amazing framework :D.

The React client uses the Konva lib, wich makes more easy to do all the client rendering. The only things that deserves more attention is the calculations behind the sizes and positions on the physical game area. See the section belor for more.

## 🧮 Going into the mathinery (hahaha I'm sorry)
This game works with virtual and physical sizes and locations. This means the server deal only with integer numbers starting with zero and ending with the game area size minus 1 (basic array setting). The client side will have to do all the calculations to place all the stuff in the right places, as the examples below:

This calculate the player part size (rendered on game each step made)  
*__player part size = physical area size / virtual area size__*

This calcullate the physical position (x and y) to render each player part  
*__physical position (x or y) = virtual position (x or y) * player part size__*

Do not worry, there is a practical example on client-react repository. [Just click here to reach it](https://github.com/RetroBikes/client-react).

## 🔌 Powered by
 * [Colyseus multiplayer game framework](https://colyseus.io/) - make the hard calculations on the server and handle events on the client

----------------

##### 💜 Made with love by a [cyberpunk and coding enthusiast](https://github.com/VictorHugoBatista)

----------------

###### 	💻 Flynn lives