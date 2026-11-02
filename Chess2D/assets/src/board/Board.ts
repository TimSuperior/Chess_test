import { IVector } from 'db://assets/src/interfaces/IVector';
import { IPieceState, PieceColor, PieceStateUtils } from 'db://assets/src/interfaces/IPieceState';
import { PieceRegistry } from 'db://assets/src/pieces/PieceRegistry';

/**
 * Spatial grid container representing the chessboard state.
 * Uses a flat 1D array internally for O(1) lookups, cache locality, and maximum memory performance.
 */
export class Board {
    public readonly width: number;
    public readonly height: number;
    private grid: (IPieceState | null)[];

    /**
     * Instantiates a new board grid.
     * @param width Grid width (defaults to 8 for standard chess)
     * @param height Grid height (defaults to 8 for standard chess)
     */
    constructor(width = 8, height = 8) {
        this.width = width;
        this.height = height;
        this.grid = new Array<IPieceState | null>(width * height).fill(null);
    }

    // =========================================================================
    // SPATIAL CONVERSIONS & BOUNDS CHECKING
    // =========================================================================

    /** Converts 2D grid coordinates (x, y) to flat 1D array index */
    public toIndex(x: number, y: number): number {
        return y * this.width + x;
    }

    /** Converts a flat 1D array index back to a 2D coordinate vector */
    public toCoords(index: number): IVector {
        return {
            x: index % this.width,
            y: Math.floor(index / this.width)
        };
    }

    /** Checks if x, y coordinates fall within valid board boundaries */
    public isValidSquare(x: number, y: number): boolean {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }

    /** Checks if a vector coordinate falls within valid board boundaries */
    public isValidPos(pos: IVector): boolean {
        return this.isValidSquare(pos.x, pos.y);
    }

    // =========================================================================
    // PIECE ACCESS & MANIPULATION
    // =========================================================================

    /** Returns piece state at (x, y) or null if empty / out of bounds */
    public getPiece(x: number, y: number): IPieceState | null {
        if (!this.isValidSquare(x, y)) return null;
        return this.grid[this.toIndex(x, y)];
    }

    /** Returns piece state at vector coordinate or null if empty / out of bounds */
    public getPieceAt(pos: IVector): IPieceState | null {
        return this.getPiece(pos.x, pos.y);
    }

    /** Sets or clears a piece state at (x, y) */
    public setPiece(x: number, y: number, piece: IPieceState | null): void {
        if (this.isValidSquare(x, y)) {
            this.grid[this.toIndex(x, y)] = piece;
        }
    }

    /** Sets or clears a piece state at vector coordinate */
    public setPieceAt(pos: IVector, piece: IPieceState | null): void {
        this.setPiece(pos.x, pos.y, piece);
    }

    /** Removes and returns piece at (x, y) */
    public removePiece(x: number, y: number): IPieceState | null {
        const existing = this.getPiece(x, y);
        this.setPiece(x, y, null);
        return existing;
    }

    /** Removes and returns piece at vector coordinate */
    public removePieceAt(pos: IVector): IPieceState | null {
        return this.removePiece(pos.x, pos.y);
    }

    /**
     * Moves a piece directly from one coordinate to another on the grid.
     * @returns The captured piece state if a piece was captured, or null.
     */
    public movePiece(fromX: number, fromY: number, toX: number, toY: number): IPieceState | null {
        const piece = this.getPiece(fromX, fromY);
        if (!piece) return null;

        const captured = this.getPiece(toX, toY);
        this.setPiece(toX, toY, piece);
        this.setPiece(fromX, fromY, null);

        return captured;
    }

    /** Clears all squares on the board */
    public clear(): void {
        this.grid.fill(null);
    }

    // =========================================================================
    // SEARCH & UTILITY METHODS
    // =========================================================================

    /**
     * Creates a deep clone of the board and all contained piece states.
     * Crucial for move simulation, check validation, and AI search trees.
     */
    public clone(): Board {
        const newBoard = new Board(this.width, this.height);
        for (let i = 0; i < this.grid.length; i++) {
            const piece = this.grid[i];
            if (piece) {
                newBoard.grid[i] = PieceStateUtils.clone(piece);
            }
        }
        return newBoard;
    }

    /** Finds and returns all pieces matching an optional color filter */
    public findAllPieces(color?: PieceColor): { pos: IVector; piece: IPieceState }[] {
        const results: { pos: IVector; piece: IPieceState }[] = [];
        for (let i = 0; i < this.grid.length; i++) {
            const piece = this.grid[i];
            if (piece && (color === undefined || piece.color === color)) {
                results.push({
                    pos: this.toCoords(i),
                    piece
                });
            }
        }
        return results;
    }

    /**
     * Finds the coordinate of the King for a given player color.
     */
    public findKing(color: PieceColor): IVector | null {
        for (let i = 0; i < this.grid.length; i++) {
            const piece = this.grid[i];
            if (piece && piece.color === color && piece.definition.symbol === 'K') {
                return this.toCoords(i);
            }
        }
        return null;
    }

    // =========================================================================
    // INITIALIZATION & PRESETS
    // =========================================================================

    /**
     * Populates the board with standard 8x8 initial chess positions.
     */
    public setupStandardBoard(): void {
        this.clear();
        PieceRegistry.initialize();

        const pawnDef = PieceRegistry.getBySymbol('P')!;
        const rookDef = PieceRegistry.getBySymbol('R')!;
        const knightDef = PieceRegistry.getBySymbol('N')!;
        const bishopDef = PieceRegistry.getBySymbol('B')!;
        const queenDef = PieceRegistry.getBySymbol('Q')!;
        const kingDef = PieceRegistry.getBySymbol('K')!;

        const backRankOrder = [
            rookDef, knightDef, bishopDef, queenDef, 
            kingDef, bishopDef, knightDef, rookDef
        ];

        // 1. Setup White Pieces (Rank 1 & 2 / y = 0 & y = 1)
        for (let x = 0; x < 8; x++) {
            this.setPiece(x, 0, PieceStateUtils.create(backRankOrder[x], 'w'));
            this.setPiece(x, 1, PieceStateUtils.create(pawnDef, 'w'));
        }

        // 2. Setup Black Pieces (Rank 7 & 8 / y = 6 & y = 7)
        for (let x = 0; x < 8; x++) {
            this.setPiece(x, 6, PieceStateUtils.create(pawnDef, 'b'));
            this.setPiece(x, 7, PieceStateUtils.create(backRankOrder[x], 'b'));
        }
    }
}