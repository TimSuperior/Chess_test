import { IVector } from 'db://assets/src/interfaces/IVector';
import { IPieceDefinition } from 'db://assets/src/interfaces/IPieceDefinition';

/**
 * Configuration options payload for instantiating a PieceDefinition.
 */
export interface PieceDefinitionConfig {
    type: string;
    symbol: string;
    directions: IVector[];
    isSlider: boolean;
    maxSteps?: number;
    value?: number;
    canJump?: boolean;
    customData?: Record<string, unknown>;
}

/**
 * Concrete implementation of IPieceDefinition.
 * Represents immutable piece movement rules, vectors, and metadata.
 */
export class PieceDefinition implements IPieceDefinition {
    public readonly type: string;
    public readonly symbol: string;
    public readonly directions: ReadonlyArray<IVector>;
    public readonly isSlider: boolean;
    public readonly maxSteps?: number;
    public readonly value?: number;
    public readonly canJump?: boolean;
    public readonly customData?: Readonly<Record<string, unknown>>;

    constructor(config: PieceDefinitionConfig) {
        this.type = config.type;
        this.symbol = config.symbol.toUpperCase();
        this.directions = Object.freeze([...config.directions]);
        this.isSlider = config.isSlider;
        this.maxSteps = config.maxSteps;
        this.value = config.value ?? 0;
        this.canJump = config.canJump ?? false;
        this.customData = config.customData ? Object.freeze({ ...config.customData }) : undefined;
    }

    // =========================================================================
    // STANDARD CHESS PRESETS (Factory Methods)
    // =========================================================================

    /** Creates a standard Pawn definition */
    public static createPawn(): PieceDefinition {
        return new PieceDefinition({
            type: 'pawn',
            symbol: 'P',
            // Forward steps + diagonal attack vectors (resolved by MoveCalculator / engine rules)
            directions: [
                { x: 0, y: 1 },   // White forward / Black forward direction
                { x: 1, y: 1 },   // Right capture vector
                { x: -1, y: 1 }   // Left capture vector
            ],
            isSlider: false,
            maxSteps: 1,
            value: 1,
            canJump: false
        });
    }

    /** Creates a standard Knight definition */
    public static createKnight(): PieceDefinition {
        return new PieceDefinition({
            type: 'knight',
            symbol: 'N',
            directions: [
                { x: 1, y: 2 }, { x: 2, y: 1 },
                { x: -1, y: 2 }, { x: -2, y: 1 },
                { x: 1, y: -2 }, { x: 2, y: -1 },
                { x: -1, y: -2 }, { x: -2, y: -1 }
            ],
            isSlider: false,
            maxSteps: 1,
            value: 3,
            canJump: true
        });
    }

    /** Creates a standard Bishop definition */
    public static createBishop(): PieceDefinition {
        return new PieceDefinition({
            type: 'bishop',
            symbol: 'B',
            directions: [
                { x: 1, y: 1 }, { x: -1, y: 1 },
                { x: 1, y: -1 }, { x: -1, y: -1 }
            ],
            isSlider: true,
            value: 3,
            canJump: false
        });
    }

    /** Creates a standard Rook definition */
    public static createRook(): PieceDefinition {
        return new PieceDefinition({
            type: 'rook',
            symbol: 'R',
            directions: [
                { x: 1, y: 0 }, { x: -1, y: 0 },
                { x: 0, y: 1 }, { x: 0, y: -1 }
            ],
            isSlider: true,
            value: 5,
            canJump: false
        });
    }

    /** Creates a standard Queen definition */
    public static createQueen(): PieceDefinition {
        return new PieceDefinition({
            type: 'queen',
            symbol: 'Q',
            directions: [
                { x: 1, y: 0 }, { x: -1, y: 0 },
                { x: 0, y: 1 }, { x: 0, y: -1 },
                { x: 1, y: 1 }, { x: -1, y: 1 },
                { x: 1, y: -1 }, { x: -1, y: -1 }
            ],
            isSlider: true,
            value: 9,
            canJump: false
        });
    }

    /** Creates a standard King definition */
    public static createKing(): PieceDefinition {
        return new PieceDefinition({
            type: 'king',
            symbol: 'K',
            directions: [
                { x: 1, y: 0 }, { x: -1, y: 0 },
                { x: 0, y: 1 }, { x: 0, y: -1 },
                { x: 1, y: 1 }, { x: -1, y: 1 },
                { x: 1, y: -1 }, { x: -1, y: -1 }
            ],
            isSlider: false,
            maxSteps: 1,
            value: 1000,
            canJump: false
        });
    }

    /**
     * Helper to create custom variant pieces (e.g., Dragon, Archbishop, Assassin).
     */
    public static createCustom(config: PieceDefinitionConfig): PieceDefinition {
        return new PieceDefinition(config);
    }
}