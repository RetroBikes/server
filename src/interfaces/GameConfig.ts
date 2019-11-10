import PlayerInitialState from './PlayerInitialState';

/**
 * Interface to all gameconfig.js data.
 */
export default interface GameConfig {

    /**
     * Number of clients required for the game start.
     * @type number
     */
    clientsToPlay: number,

    /**
     * Game area virtual size. Determine the number of player parts the game area can support.
     * @type number
     */
    areaVirtualSize: number,

    /**
     * Initial player states. See more in PlayerInitialState interface.
     * @type Array<PlayerInitialState>
     */
    initialStates: Array<PlayerInitialState>,

}
