import { IVector } from 'db://assets/src/interfaces/IVector';
import { PieceColor, PieceStateUtils } from 'db://assets/src/interfaces/IPieceState';
import { Board } from 'db://assets/src/board/Board';
import { PieceRegistry } from 'db://assets/src/pieces/PieceRegistry';
/**
 * Castling availability flags parsed from or serialized to FEN notation.
 */
export interface ICastlingRights {
    whiteKingside: boolean;
    whiteQueenside: boolean;
    blackKingside: boolean;
    blackQueenside: boolean;
}

/**
 * Complete game state extracted from a parsed Forsyth-Edwards Notation (FEN) string.
 */
export interface IFENParsedState {
    activeTurn: PieceColor;
    castlingRights: ICastlingRights;
    enPassantTarget: IVector | null;
    halfmoveClock: number;
    fullmoveNumber: number;
}

/**
 * Utility parser for reading and exporting Forsyth-Edwards Notation (FEN) strings.
 * Supports standard chess states and custom piece symbols registered in PieceRegistry.
 */
export class FENParser {
    /** Standard chess initial position FEN string */
    public static readonly DEFAULT_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

    // =========================================================================
    // FEN PARSING (IMPORT)
    // =========================================================================

    /**
     * Parses a FEN string and populates the provided Board instance with piece states.
     * @param fen FEN string to parse
     * @param board Board container instance to populate
     * @returns Extracted match parameters (activeTurn, castlingRights, enPassantTarget, halfmoveClock, fullmoveNumber)
     */
    public static parse(fen: string, board: Board): IFENParsedState {
        board.clear();
        PieceRegistry.initialize();

        const tokens = fen.trim().split(/\s+/);
        if (tokens.length < 1) {
            throw new Error('Invalid FEN: String is empty.');
        }

        const placementStr = tokens[0];
        const activeTurnStr = tokens[1] ?? 'w';
        const castlingStr = tokens[2] ?? '-';
        const enPassantStr = tokens[3] ?? '-';
        const halfmoveStr = tokens[4] ?? '0';
        const fullmoveStr = tokens[5] ?? '1';

        // 1. Parse Piece Placement Grid
        const rows = placementStr.split('/');
        if (rows.length !== board.height) {
            throw new Error(`Invalid FEN: Expected ${board.height} rows, but found ${rows.length}.`);
        }

        for (let r = 0; r < rows.length; r++) {
            const rowStr = rows[r];
            const y = board.height - 1 - r; // FEN lists ranks from 8 down to 1
            let x = 0;

            for (let i = 0; i < rowStr.length; i++) {
                const char = rowStr[i];

                if (char >= '1' && char <= '9') {
                    // Empty square offset
                    x += parseInt(char, 10);
                } else {
                    const isWhite = char === char.toUpperCase();
                    const symbol = char.toUpperCase();
                    const color: PieceColor = isWhite ? 'w' : 'b';

                    const def = PieceRegistry.getBySymbol(symbol);
                    if (!def) {
                        throw new Error(`Invalid FEN: Unregistered piece symbol '${char}' at row ${r}, col ${x}.`);
                    }

                    const pieceState = PieceStateUtils.create(def, color);
                    
                    // Mark piece as moved if it is not on its default starting rank
                    const isPawn = symbol === 'P';
                    const pawnStartRank = color === 'w' ? 1 : board.height - 2;
                    if (isPawn && y !== pawnStartRank) {
                        pieceState.hasMoved = true;
                    }

                    board.setPiece(x, y, pieceState);
                    x++;
                }
            }

            if (x !== board.width) {
                throw new Error(`Invalid FEN row length at rank ${y + 1}: expected ${board.width} columns, got ${x}.`);
            }
        }

        // 2. Parse Active Player Turn
        const activeTurn: PieceColor = activeTurnStr.toLowerCase() === 'b' ? 'b' : 'w';

        // 3. Parse Castling Rights
        const castlingRights: ICastlingRights = {
            whiteKingside: castlingStr.includes('K'),
            whiteQueenside: castlingStr.includes('Q'),
            blackKingside: castlingStr.includes('k'),
            blackQueenside: castlingStr.includes('q')
        };

        // 4. Parse En Passant Target Square
        const enPassantTarget = enPassantStr !== '-' ? this.squareToPos(enPassantStr) : null;

        // 5. Parse Clocks
        const halfmoveClock = parseInt(halfmoveStr, 10) || 0;
        const fullmoveNumber = parseInt(fullmoveStr, 10) || 1;

        return {
            activeTurn,
            castlingRights,
            enPassantTarget,
            halfmoveClock,
            fullmoveNumber
        };
    }

    // =========================================================================
    // FEN GENERATION (EXPORT)
    // =========================================================================

    /**
     * Serializes a Board instance and game state parameters into a standard FEN string.
     * @param board Active board grid container
     * @param state Match parameters (activeTurn, castlingRights, enPassantTarget, halfmoveClock, fullmoveNumber)
     */
    public static generate(board: Board, state: IFENParsedState): string {
        const parts: string[] = [];

        // 1. Piece Placement String
        const rows: string[] = [];
        for (let y = board.height - 1; y >= 0; y--) {
            let rowStr = '';
            let emptyCount = 0;

            for (let x = 0; x < board.width; x++) {
                const piece = board.getPiece(x, y);

                if (piece === null) {
                    emptyCount++;
                } else {
                    if (emptyCount > 0) {
                        rowStr += emptyCount.toString();
                        emptyCount = 0;
                    }
                    const symbol = piece.definition.symbol;
                    rowStr += piece.color === 'w' ? symbol.toUpperCase() : symbol.toLowerCase();
                }
            }

            if (emptyCount > 0) {
                rowStr += emptyCount.toString();
            }

            rows.push(rowStr);
        }
        parts.push(rows.join('/'));

        // 2. Active Player Turn
        parts.push(state.activeTurn);

        // 3. Castling Availability Flags
        let castlingStr = '';
        if (state.castlingRights.whiteKingside) castlingStr += 'K';
        if (state.castlingRights.whiteQueenside) castlingStr += 'Q';
        if (state.castlingRights.blackKingside) castlingStr += 'k';
        if (state.castlingRights.blackQueenside) castlingStr += 'q';
        parts.push(castlingStr.length > 0 ? castlingStr : '-');

        // 4. En Passant Target Square
        parts.push(state.enPassantTarget ? this.posToSquare(state.enPassantTarget) : '-');

        // 5. Halfmove Clock & Fullmove Number
        parts.push(state.halfmoveClock.toString());
        parts.push(state.fullmoveNumber.toString());

        return parts.join(' ');
    }

    // =========================================================================
    // COORDINATE CONVERSIONS
    // =========================================================================

    /**
     * Converts algebraic square string (e.g., "e4") to a 0-indexed IVector coordinate ({ x: 4, y: 3 }).
     */
    public static squareToPos(square: string): IVector | null {
        if (!square || square.length < 2) return null;

        const fileChar = square[0].toLowerCase();
        const rankStr = square.substring(1);

        const x = fileChar.charCodeAt(0) - 97; // 'a' -> 0
        const y = parseInt(rankStr, 10) - 1;   // "1" -> 0

        if (isNaN(x) || isNaN(y) || x < 0 || y < 0) {
            return null;
        }

        return { x, y };
    }

    /**
     * Converts 0-indexed coordinate vector ({ x: 4, y: 3 }) to algebraic square string ("e4").
     */
    public static posToSquare(pos: IVector): string {
        const file = String.fromCharCode(97 + pos.x);
        const rank = (pos.y + 1).toString();
        return `${file}${rank}`;
    }
}