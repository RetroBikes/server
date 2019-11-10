import { MapSchema } from '@colyseus/schema';
import { Client, Room } from 'colyseus';
import Arena from '../schemas/Arena';
import Configurations from '../bo/Configurations';
import GameStatus from '../interfaces/GameStatus';
import Player from '../schemas/Player';

/**
 * Deal with the requests sent by clients and received on Express framework (initial server file a.k.a. index.ts).
 * Closest class to the gameloop itself; send win, lose and draw messages and disconnect defeated players.
 * Have an instance of Arena class, the state root sent to client side on data change, by example.
 */
export default class GameRoom extends Room<Arena> {

    /**
     * Colyseus Room class property, define the maximum number of connected
     * clients until instantiate another room and start all over again.
     * The game itself only starts when the clients number reach the maxClients value.
     * See on onJoin method below.
     * @type number
     */
    public maxClients: number = 2;

    /**
     * Called on game room creation. Read the 'gameconfig.json' file, set the
     * maxClients value and start the Arena object with the gameconfig stored data.
     * @param options just an unused colyseus parameter
     */
    public onCreate(options: any): void {
        const gameconfigdata = new Configurations('gameconfig.json'),
            gameconfig = gameconfigdata.getJsonData();
        this.maxClients = gameconfig.clientsToPlay;
        this.setState(new Arena(gameconfig));
        console.log('StateHandlerRoom created!', options);
    }

    /**
     * Called on new player join. If the maxClients number is reached, start the game.
     * @param client Joined client object. Used on player creation on the Arena class.
     */
    public onJoin(client: Client): void {
        const clientNumber = this.clients.length + 1,
            roomOccupied = this.maxClients <= this.clients.length + 1;
        this.state.createPlayer(client, clientNumber);
        if (roomOccupied) {
            this.startGame();
        }
    }

    /**
     * Remove the player of game arena on their disconnection.
     * @param client Disconnected client object. Used for remove the player from game arena.
     */
    public onLeave(client: Client): void {
        this.state.removePlayer(client.sessionId);
    }

    /**
     * Executed on receive message. In this case, this only means changing direction.
     * @param client Client who changed their direction
     * @param data Data with the new direction
     */
    public onMessage(client: Client, data: any): void {
        console.log('StateHandlerRoom received message from', client.sessionId, ':', data);
        this.state.changePlayerDirection(client.sessionId, data.direction);
    }

    /**
     * Called on room instance erasing. In another words, then the game is finished.
     * But does nothing.
     */
    public onDispose(): void {
        console.log('Dispose StateHandlerRoom');
    }

    /**
     * Start the game, what means take some steps:
     * refresh the first player positions to all clients;
     * start the game loop itself;
     * 
     * The game loop executes a game step on Arena class, that means move
     * all players, calculate collisions and return the game status after this;
     * verify if the game is finished to stop the game loop;
     * flush the game step (if the game is not finished but
     * there is players defeated, remove them from arena).
     * 
     * See more about the game step and the game step flush on Arena makeGameStep and flushGameStep methods.
     */
    private startGame(): void {
        this.state.refreshAllPlayersPositions();
        this.setSimulationInterval(() => {
            const gameStatus = this.state.makeGameStep();
            if (gameStatus.finished) {
                this.stopGame(gameStatus);
            } else {
                this.sendMessageToPlayers(gameStatus.players, false);
            }
            this.state.flushGameStep();
        }, 100);
    }

    /**
     * Send message to players (if is draw broadcast the message to all remaining players).
     * Disconnect after this.
     * @param gameStatus Important game data used on decisions explained right above 
     */
    private stopGame(gameStatus: GameStatus): void {
        if (gameStatus.isDraw) {
            this.broadcast('Draw :o');
        } else {
            this.sendMessageToPlayers(gameStatus.players, true);
        }
        this.disconnect();
    }

    /**
     * Send the 'win' or 'lose' message to players.
     * @param players Players map to get the isAlive status and the client object to send the message
     * @param canSendWinMessage Define if can send the 'win' message to the alive players
     */
    private sendMessageToPlayers(players: MapSchema<Player>, canSendWinMessage: boolean): void {
        Player.loopMap(players, (player: Player) => {
            if (player.isAlive && ! canSendWinMessage) {
                return;
            }
            const message = player.isAlive ? 'You win :D' : 'You lose :/';
            this.send(player.getClientObject(), message);
        });
    }

}
