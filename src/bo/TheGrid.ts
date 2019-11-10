import Coordinate from '../schemas/Coordinate';
import GenericObject from '../interfaces/GenericObject';

/**
 * Deal with all game space management, as the collision checks.
 * Mantain a bidimentional array with the playerId who occupy each space.
 * Empty string means unoccupied spaces.
 */
export default class TheGrid {

    /**
     * Size of the gamearea. Used to calculate the area bounds.
     * @type number
     */
    private gridSize: number;

    /**
     * Bidimentional array that stores all players positions.
     * @type Array<Array<string>>
     */
    private gridItems: Array<Array<string>>;

    /**
     * Current players positions. This is used for check the collisions
     * as the gridItems. The gridItems can't be occupied before the
     * checks because all spaces will be overridden before the checks itself.
     * @type GenericObject<Coordinate>
     */
    private spacesCandidatesToOccupy: GenericObject<Coordinate>;

    /**
     * Initialize the gridItems with all spaces empty.
     * @param gridSize 
     */
    public constructor(gridSize: number) {
        this.gridSize = gridSize;
        let emptyLine = new Array<string>(gridSize);
        emptyLine = Array.from(emptyLine, () => '');
        this.gridItems = new Array<Array<string>>(gridSize);
        this.gridItems = Array.from(this.gridItems, () => emptyLine.slice());
        this.spacesCandidatesToOccupy = {};
    }

    /**
     * Add / override space cantidate to occupy.
     * @param spaceCoordinate Space coordinate x / y
     * @param playerId Player id for identify the space candidate
     */
    public addSpaceCandidateToOccupy(spaceCoordinate: Coordinate, playerId: string): void {
        if (! this.spaceExists(spaceCoordinate)) {
            return;
        }
        this.spacesCandidatesToOccupy[playerId] = new Coordinate(spaceCoordinate.x, spaceCoordinate.y);
    }

    /**
     * Occupy a game space with x / y and a player id.
     * @param spaceCoordinate Space coordinate x / y
     * @param playerId Player id for identify the space occupied
     */
    public occupySpace(spaceCoordinate: Coordinate, playerId: string): void {
        if (! this.spaceExists(spaceCoordinate)) {
            return;
        }
        this.gridItems[spaceCoordinate.x][spaceCoordinate.y] = playerId;
    }

    /**
     * Check if the passed coordinate is occupied.
     * Consider the space candidates object too, if has a space
     * candidate for another player id, consider occupied too.
     * @param spaceCoordinate Space coordinate x / y
     * @param playerId Used for check the space candidates object
     */
    public isSpaceOccupied(spaceCoordinate: Coordinate, playerId: string): boolean {
        // If is out of grid bounds.
        if (! this.spaceExists(spaceCoordinate)) {
            return true;
        }
        // If will crash on next opponent step.
        for (let spacePlayerId in this.spacesCandidatesToOccupy) {
            if (playerId === spacePlayerId) {
                continue;
            }
            if (this.spacesCandidatesToOccupy[spacePlayerId].toString() === spaceCoordinate.toString()) {
                return true;
            }
        }
        // If will crash on opponent trail.
        return '' !== this.gridItems[spaceCoordinate.x][spaceCoordinate.y];
    }

    /**
     * Free all gridItems spaces for one player id.
     * @param playerId Used for identify the spaces to free.
     */
    public freeAllPlayerSpaces(playerId: string): void {
        for (let xCoordinate in this.gridItems) {
            for (let yCoordinate in this.gridItems[xCoordinate]) {
                if (playerId === this.gridItems[xCoordinate][yCoordinate]) {
                    this.gridItems[xCoordinate][yCoordinate] = '';
                }
            }
        }
    }

    /**
     * Verify if coordinate exists on gridItems array.
     * Basically, a coordinate exists if x and y are greater or equal to 0 or lesser the grid size.
     * @param spaceCoordinate 
     */
    private spaceExists(spaceCoordinate: Coordinate): boolean {
        return 0 <= spaceCoordinate.x && this.gridSize > spaceCoordinate.x &&
            0 <= spaceCoordinate.y && this.gridSize > spaceCoordinate.y;
    }

}
