import { IVector } from './IVector';
import { IPieceState } from './IPieceState';

/**
 * Categorizes the type of move for standard chess rule execution and custom variant triggers.
 */
export type MoveType = 
    | 'normal'
    | 'double_step'
    | 'castling_kingside'
    | 'castling_queenside'
    | 'en_passant'
    | 'promotion'
    | 'custom';

/**
 * Represents a complete move payload and historical record within the chess engine.
 * Contains execution coordinates, participating piece states, move type flags, and undo data.
 */
export interface IMove {
    /**
     * Starting coordinate of the move on the grid.
     */
    readonly from: IVector;

    /**
     * Target destination coordinate of the move.
     */
    readonly to: IVector;

    /**
     * Runtime state of the piece executing the move.
     */
    readonly piece: IPieceState;

    /**
     * Reference to the captured piece state, if a capture occurred.
     */
    readonly capturedPiece?: IPieceState | null;

    /**
     * Classification of the move for special rules validation.
     */
    readonly moveType: MoveType;

    /**
     * Symbol of the piece type chosen during pawn promotion (e.g., 'Q', 'R', 'B', 'N').
     */
    readonly promotedToSymbol?: string;

    /**
     * Extensible data container for custom variant parameters (e.g., skill IDs, mana costs, or status effects).
     */
    readonly customData?: Readonly<Record<string, unknown>>;
}

/**
 * High-performance factory and notation utilities for move instances.
 */
export class MoveUtils {
    /**
     * Creates a standardized immutable move object.
     */
    public static create(
        from: IVector,
        to: IVector,
        piece: IPieceState,
        moveType: MoveType = 'normal',
        capturedPiece: IPieceState | null = null,
        promotedToSymbol?: string,
        customData?: Record<string, unknown>
    ): IMove {
        return {
            from,
            to,
            piece,
            capturedPiece,
            moveType,
            promotedToSymbol,
            customData: customData ? Object.freeze({ ...customData }) : undefined
        };
    }

    /**
     * Creates a clone of a move instance. Useful for undo stacks and board simulation checks.
     */
    public static clone(move: IMove): IMove {
        return {
            from: { x: move.from.x, y: move.from.y },
            to: { x: move.to.x, y: move.to.y },
            piece: move.piece,
            capturedPiece: move.capturedPiece,
            moveType: move.moveType,
            promotedToSymbol: move.promotedToSymbol,
            customData: move.customData ? { ...move.customData } : undefined
        };
    }

    /**
     * Checks if two moves share the exact same origin and destination squares.
     */
    public static equals(a: IMove, b: IMove): boolean {
        return (
            a.from.x === b.from.x &&
            a.from.y === b.from.y &&
            a.to.x === b.to.x &&
            a.to.y === b.to.y
        );
    }

    /**
     * Converts a 0-indexed grid coordinate to standard algebraic notation (e.g., x=4, y=3 -> "e4").
     */
    public static toSquareName(pos: IVector): string {
        const file = String.fromCharCode(97 + pos.x); // 0 -> 'a', 1 -> 'b', etc.
        const rank = (pos.y + 1).toString();         // 0 -> '1', 1 -> '2', etc.
        return `${file}${rank}`;
    }

    /**
     * Formats a move into simple coordinate notation (e.g., "e2e4" or "e7e8q").
     */
    public static toSimpleNotation(move: IMove): string {
        const fromStr = MoveUtils.toSquareName(move.from);
        const toStr = MoveUtils.toSquareName(move.to);
        const promoStr = move.promotedToSymbol ? move.promotedToSymbol.toLowerCase() : '';
        return `${fromStr}${toStr}${promoStr}`;
    }
}