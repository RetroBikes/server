import { Schema, type } from '@colyseus/schema';

/**
 * Basically holds a x / y coordinate. Can give the stringfied version too.
 * Only this. Just separation of concerns ;-)
 * This extends the Schema Colyseus class to be passed to client side.
 */
export default class Coordinate extends Schema {

    /**
     * Just the x coordinate.
     * Flagged to be passed to client side.
     * @type number
     */
    @type('number')
    public x: number;

    /**
     * Just the y coordinate.
     * Flagged to be passed to client side.
     * @type number
     */
    @type('number')
    public y: number;

    /**
     * Just initialize the x / y coordinates.
     * Very simple if you think about it.
     * @param x 
     * @param y 
     */
    public constructor(x: number, y: number) {
        super();
        this.x = x;
        this.y = y;
    }

    /**
     * Return a stringfied version of the coordinate.
     * Good to compare if two coordinates are equals.
     */
    public toString(): string {
        return `${this.x}-${this.y}`;
    }

}
