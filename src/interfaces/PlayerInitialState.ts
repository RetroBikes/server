import Coordinate from '../schemas/Coordinate';

/**
 * All player initial states to begin the game.
 * Includes start position and initial direction.
 */
export default interface PlayerInitialState {

    /**
     * Start position, with x / y coordinates.
     * @type Coordinate
     */
    startPosition: Coordinate,

    /**
     * Start direction.
     * @type string
     */
    initialDirection: string,

}
