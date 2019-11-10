import { Client } from 'colyseus';
import { MapSchema, Schema, type } from '@colyseus/schema';
import Coordinate from './Coordinate';
import GenericObject from '../interfaces/GenericObject';
import PlayerInitialState from '../interfaces/PlayerInitialState';

/**
 * All the data the player needs to exists on the game, like current position, direction and goes on.
 * This extends the Schema Colyseus class to be passed to client side.
 */
export default class Player extends Schema {

    /**
     * Current player x / y position.
     * Flagged to be passed to client side.
     * @type string
     */
    @type(Coordinate)
    public currentPosition: Coordinate;

    /**
     * Player direction, basically defines the next player position on move method.
     * Flagged to be passed to client side.
     * @type Coordinate
     */
    @type('string')
    public direction = 'right';

    /**
     * Defines if the player char is alive. Heavily used on the game step (GameRoom and Arena
     * classes) to define if the player need to be removed of the game area or the game is finished.
     * @type boolean
     */
    public isAlive = true;

    /**
     * Player client object. Used to send message on player win or defeat.
     * @type Client
     */
    private clientObject: Client;

    /**
     * Define if the player can change their direction.
     * Basically, the player can't do two moves per game loop iteration
     * to guarantee he/she can't move to the own way and lose.
     * @type boolean
     */
    private canChangeDirection = true;

    /**
     * Opposite directions object, used to deny the player change their
     * direction to the opposite direction, losing in the process.
     * @type GenericObject<string>
     */
    private oppositeDirections: GenericObject<string> = {
        up: 'down',
        right: 'left',
        down: 'up',
        left: 'right',
    };

    /**
     * Create new player with initial state setted.
     * @param client Player client object.
     * @param initialState Initial state, includes the first location and direction.
     */
    public constructor(client: Client, initialState: PlayerInitialState) {
        super();
        this.clientObject = client;
        this.direction = initialState.initialDirection;
        this.currentPosition = initialState.startPosition;
    }

    /**
     * Refresh the current position recreating a new object.
     * This forces the sending of the data to all clients connected to the current game.
     */
    public refreshCurrentPosition(): void {
        this.currentPosition = new Coordinate(
            this.currentPosition.x,
            this.currentPosition.y,
        );
    }

    /**
     * Change the player direction, if the new direction isn't equal to current direction
     * and the player not changed their direction on this game step (game loop iteration).
     * Deny the direction changing on current player after a successful direction changing.
     * This state will be reseted on current game step ending.
     * @param direction new direction to change
     */
    public changeDirection(direction: string): void {
        if (! this.canChangeDirection ||
            this.direction === this.oppositeDirections[direction]) {
            return;
        }
        this.direction = direction;
        this.denyChangeDirection();
    }

    /**
     * Just make a move, based on the current player direction.
     * This action send the updated player data to all clients connected to the current game.
     */
    public move(): void {
        const newPosition = this.currentPosition;
        switch(this.direction) {
            case 'up':
                newPosition.y -= 1;
                break;
            case 'down':
                newPosition.y += 1;
                break;
            case 'left':
                newPosition.x -= 1;
                break;
            case 'right':
                newPosition.x += 1;
                break;
        }
        this.updateCurrentPosition(newPosition);
    }

    /**
     * Just allow the player to change direction.
     * Called on end of each game loop.
     */
    public allowChangeDirection(): void {
        this.canChangeDirection = true;
    }

    /**
     * Stop the direction changes to current player.
     * Called after a direction changing.
     */
    public denyChangeDirection(): void {
        this.canChangeDirection = false;
    }

    /**
     * Just change the player isAlive status to false.
     */
    public kill(): void {
        this.isAlive = false;
    }

    /**
     * Return the player client object.
     */
    public getClientObject(): Client {
        return this.clientObject;
    }

    /**
     * Loop through a player MapSchema on the functional way. Static
     * method, is called from the class, not a player object.
     * Example:
     * Player.loopMap(myMap, (player: Player, playerId: string) => {
     *   console.log(player, playerId);
     * });
     * @param players Players map to loop
     * @param callback Method to call on each iteration. Receives the player and their id.
     */
    public static loopMap(players: MapSchema<Player>, callback: Function): void {
        for (let playerId in players) {
            callback(players[playerId], playerId);
        }
    }

    /**
     * Just update the player current position.
     * This action send the updated player data to all clients connected to the current game.
     * @param newPlayerPosition 
     */
    private updateCurrentPosition(newPlayerPosition: Coordinate): void {
        this.currentPosition = newPlayerPosition;
    }

}
