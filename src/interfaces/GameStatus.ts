import { MapSchema } from '@colyseus/schema';
import Player from '../schemas/Player';

/**
 * Hold all import data for the game status. Include flags that
 * determines if the game is finished, if is draw and the players array.
 */
export default interface GameStatus {

    /**
     * Determine if the game is finished. Used for stop drop de game room.
     * @type boolean
     */
    finished: boolean,

    /**
     * Determine if the game is draw. If is true, a broadcast message is sent to all last players.
     * @type boolean
     */
    isDraw: boolean,

    /**
     * Players array, for check if one players lose (used for 3+ players
     * case, when one player lose but the game is not finished).
     * @type MapSchema<Player>
     */
    players: MapSchema<Player>,

}
