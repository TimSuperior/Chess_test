/**
 * Represents a 2D relative direction vector or coordinate pair on the chessboard.
 * Used for move directions, piece vectors, and grid offsets.
 */
export interface IVector {
    readonly x: number;
    readonly y: number;
}

/**
 * High-performance utility class for vector calculations.
 * Avoids unnecessary object allocations during move generation loops.
 */
export class VectorUtils {
    /**
     * Creates an immutable vector interface instance.
     */
    public static create(x: number, y: number): IVector {
        return { x, y };
    }

    /**
     * Adds two vectors together (e.g., currentPosition + directionVector).
     */
    public static add(a: IVector, b: IVector): IVector {
        return { x: a.x + b.x, y: a.y + b.y };
    }

    /**
     * Subtracts vector B from vector A.
     */
    public static subtract(a: IVector, b: IVector): IVector {
        return { x: a.x - b.x, y: a.y - b.y };
    }

    /**
     * Scales a vector by a scalar step multiplier.
     */
    public static scale(v: IVector, factor: number): IVector {
        return { x: v.x * factor, y: v.y * factor };
    }

    /**
     * Checks if two vectors share the same coordinates.
     */
    public static equals(a: IVector, b: IVector): boolean {
        return a.x === b.x && a.y === b.y;
    }

    /**
     * Returns true if the vector represents zero displacement (0, 0).
     */
    public static isZero(v: IVector): boolean {
        return v.x === 0 && v.y === 0;
    }
}