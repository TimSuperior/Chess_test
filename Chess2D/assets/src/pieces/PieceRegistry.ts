import { IPieceDefinition } from 'db://assets/src/interfaces/IPieceDefinition';
import { PieceDefinition } from 'db://assets/src/pieces/PieceDefinition';
/**
 * Central registry managing piece definitions for the chess engine.
 * Serves as a global dictionary mapping FEN symbols ('P', 'N', 'R', etc.) 
 * and type names ('pawn', 'knight', etc.) to their movement rules.
 */
export class PieceRegistry {
    private static symbolMap: Map<string, IPieceDefinition> = new Map();
    private static typeMap: Map<string, IPieceDefinition> = new Map();
    private static isInitialized = false;

    /**
     * Initializes the registry with standard chess pieces (Pawn, Knight, Bishop, Rook, Queen, King).
     * Automatically invoked on first lookup if not manually triggered.
     */
    public static initialize(): void {
        if (this.isInitialized) return;

        this.register(PieceDefinition.createPawn());
        this.register(PieceDefinition.createKnight());
        this.register(PieceDefinition.createBishop());
        this.register(PieceDefinition.createRook());
        this.register(PieceDefinition.createQueen());
        this.register(PieceDefinition.createKing());

        this.isInitialized = true;
    }

    /**
     * Registers a piece definition in the engine.
     * Overwrites any existing registration with the same symbol or type.
     * @param definition The piece definition object to register
     */
    public static register(definition: IPieceDefinition): void {
        const symbolKey = definition.symbol.toUpperCase();
        const typeKey = definition.type.toLowerCase();

        this.symbolMap.set(symbolKey, definition);
        this.typeMap.set(typeKey, definition);
    }

    /**
     * Retrieves a piece definition by its FEN shorthand symbol (e.g., 'R', 'n', 'k').
     * Case-insensitive: both 'N' and 'n' return the Knight definition.
     */
    public static getBySymbol(symbol: string): IPieceDefinition | undefined {
        this.ensureInitialized();
        return this.symbolMap.get(symbol.toUpperCase());
    }

    /**
     * Retrieves a piece definition by its type name (e.g., 'rook', 'knight', 'custom_dragon').
     */
    public static getByType(type: string): IPieceDefinition | undefined {
        this.ensureInitialized();
        return this.typeMap.get(type.toLowerCase());
    }

    /**
     * Checks if a symbol is currently registered.
     */
    public static hasSymbol(symbol: string): boolean {
        this.ensureInitialized();
        return this.symbolMap.has(symbol.toUpperCase());
    }

    /**
     * Checks if a piece type identifier is currently registered.
     */
    public static hasType(type: string): boolean {
        this.ensureInitialized();
        return this.typeMap.has(type.toLowerCase());
    }

    /**
     * Returns an array of all registered piece definitions.
     */
    public static getAll(): IPieceDefinition[] {
        this.ensureInitialized();
        return Array.from(this.symbolMap.values());
    }

    /**
     * Resets and clears all registered piece definitions.
     * Useful for unit tests or reconfiguring custom game variants.
     */
    public static clear(): void {
        this.symbolMap.clear();
        this.typeMap.clear();
        this.isInitialized = false;
    }

    /**
     * Internal guard ensuring standard pieces are registered before any query.
     */
    private static ensureInitialized(): void {
        if (!this.isInitialized) {
            this.initialize();
        }
    }
}