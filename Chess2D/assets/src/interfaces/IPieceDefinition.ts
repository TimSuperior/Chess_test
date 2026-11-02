import { IVector } from './IVector';

/**
 * Defines the movement rules, physical properties, and metadata for a chess piece type.
 * Supports standard pieces (Pawn, Knight, Bishop, Rook, Queen, King) and custom variants.
 */
export interface IPieceDefinition {
    /**
     * Unique text identifier for the piece type (e.g., 'pawn', 'knight', 'custom_dragon').
     */
    readonly type: string;

    /**
     * FEN symbol or shorthand character representing the piece (e.g., 'P', 'N', 'R', 'B', 'Q', 'K', 'D').
     * Typically stored as an uppercase letter. Color is handled at runtime by the board engine.
     */
    readonly symbol: string;

    /**
     * Relative 2D direction vectors defining where the piece can move or raycast.
     */
    readonly directions: ReadonlyArray<IVector>;

    /**
     * If true, the piece continues moving along direction vectors until blocked by a piece or board boundary (e.g., Rook, Bishop, Queen).
     * If false, the piece steps or leaps directly to the target vector offset (e.g., Knight, King).
     */
    readonly isSlider: boolean;

    /**
     * Optional limit on maximum steps allowed along a direction vector.
     * If undefined, sliders move up to board length, and non-sliders move 1 step.
     */
    readonly maxSteps?: number;

    /**
     * Optional material value of the piece for AI evaluation, heuristics, or scoring (e.g., Pawn = 1, Queen = 9).
     */
    readonly value?: number;

    /**
     * Optional flag indicating if the piece can ignore intervening pieces along its path.
     * True for Knights; false for standard sliding pieces.
     */
    readonly canJump?: boolean;

    /**
     * Key-value container for variant-specific parameters (e.g., custom abilities, cooldowns, or elemental traits).
     */
    readonly customData?: Readonly<Record<string, unknown>>;
}

/**
 * High-performance helper utilities for inspecting and resolving piece definitions.
 */
export class PieceDefinitionUtils {
    /**
     * Resolves the maximum step count for raycasting during move calculations.
     * @param def The piece definition
     * @param boardMaxDimension Optional max board dimension (defaults to 8 for standard chess)
     */
    public static getMaxSteps(def: IPieceDefinition, boardMaxDimension = 8): number {
        if (def.maxSteps !== undefined && def.maxSteps > 0) {
            return def.maxSteps;
        }
        return def.isSlider ? boardMaxDimension : 1;
    }

    /**
     * Validates that a piece definition contains all required movement properties.
     */
    public static isValid(def: IPieceDefinition): boolean {
        return (
            typeof def.type === 'string' &&
            def.type.length > 0 &&
            typeof def.symbol === 'string' &&
            def.symbol.length > 0 &&
            Array.isArray(def.directions) &&
            def.directions.length > 0 &&
            typeof def.isSlider === 'boolean'
        );
    }
}