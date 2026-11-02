import { IVector } from 'db://assets/src/interfaces/IVector';
import { IPieceState, PieceColor, PieceStateUtils } from 'db://assets/src/interfaces/IPieceState';
import { IMove } from 'db://assets/src/interfaces/IMove';
import { Board } from 'db://assets/src/board/Board';
import { MoveCalculator } from 'db://assets/src/rules/MoveCalculator';
import { SpecialRules } from 'db://assets/src/rules/SpecialRules';

/**
 * Validates moves against legal constraints (King safety / check rules),
 * and evaluates game end states (Checkmate, Stalemate, Insufficient Material).
 */
export class RuleValidator {

    // =========================================================================
    // LEGAL MOVE VALIDATION
    // =========================================================================

    /**
     * Filters pseudo-legal moves into strictly legal moves by simulating each move
     * on a cloned board and verifying that the active player's King is not in check.
     * 
     * @param board Active board instance
     * @param fromX Starting X coordinate
     * @param fromY Starting Y coordinate
     * @param activeTurn Current player color
     * @param enPassantTarget Active en passant target square if available
     */
    public static getLegalMoves(
        board: Board,
        fromX: number,
        fromY: number,
        activeTurn: PieceColor,
        enPassantTarget?: IVector | null
    ): IMove[] {
        const piece = board.getPiece(fromX, fromY);
        if (!piece || piece.color !== activeTurn) {
            return [];
        }

        const fromPos: IVector = { x: fromX, y: fromY };

        // 1. Get pseudo-legal moves (basic vector movement and captures)
        const pseudoMoves = MoveCalculator.getPseudoLegalMoves(board, fromX, fromY, enPassantTarget);

        // 2. Append castling moves if piece is a King
        if (piece.definition.symbol === 'K') {
            const castlingMoves = SpecialRules.getCastlingMoves(board, fromPos, activeTurn);
            for (let i = 0; i < castlingMoves.length; i++) {
                pseudoMoves.push(castlingMoves[i]);
            }
        }

        // 3. Filter out moves that leave or place friendly King in check
        const legalMoves: IMove[] = [];

        for (let i = 0; i < pseudoMoves.length; i++) {
            const move = pseudoMoves[i];

            if (this.isMoveLegal(board, move, activeTurn)) {
                legalMoves.push(move);
            }
        }

        return legalMoves;
    }

    /**
     * Generates all strictly legal moves for all pieces belonging to a player color.
     */
    public static getAllLegalMoves(
        board: Board,
        color: PieceColor,
        enPassantTarget?: IVector | null
    ): IMove[] {
        const legalMoves: IMove[] = [];
        const pieces = board.findAllPieces(color);

        for (let i = 0; i < pieces.length; i++) {
            const { pos } = pieces[i];
            const pieceMoves = this.getLegalMoves(board, pos.x, pos.y, color, enPassantTarget);
            for (let j = 0; j < pieceMoves.length; j++) {
                legalMoves.push(pieceMoves[j]);
            }
        }

        return legalMoves;
    }

    /**
     * Verifies if a single move is legal for the specified player color.
     */
    public static isMoveLegal(board: Board, move: IMove, color: PieceColor): boolean {
        // Clone board state for non-destructive simulation
        const simulatedBoard = board.clone();

        // Execute special/normal move mechanics on simulation board
        SpecialRules.executeSpecialMove(simulatedBoard, move);

        // Verify friendly King is not under attack after move
        return !this.isInCheck(simulatedBoard, color);
    }

    // =========================================================================
    // GAME STATE & THREAT EVALUATION
    // =========================================================================

    /**
     * Checks if the King of the specified player color is currently under attack (in check).
     */
    public static isInCheck(board: Board, color: PieceColor): boolean {
        const kingPos = board.findKing(color);

        // If no King exists (e.g., custom variant without kings), King cannot be in check
        if (!kingPos) return false;

        const enemyColor = PieceStateUtils.getOppositeColor(color);
        return MoveCalculator.isSquareAttacked(board, kingPos, enemyColor);
    }

    /**
     * Checks if player color is in Checkmate (In check with 0 legal moves remaining).
     */
    public static isCheckmate(
        board: Board,
        color: PieceColor,
        enPassantTarget?: IVector | null
    ): boolean {
        if (!this.isInCheck(board, color)) {
            return false;
        }

        const legalMoves = this.getAllLegalMoves(board, color, enPassantTarget);
        return legalMoves.length === 0;
    }

    /**
     * Checks if player color is in Stalemate (Not in check, but 0 legal moves remaining).
     */
    public static isStalemate(
        board: Board,
        color: PieceColor,
        enPassantTarget?: IVector | null
    ): boolean {
        if (this.isInCheck(board, color)) {
            return false;
        }

        const legalMoves = this.getAllLegalMoves(board, color, enPassantTarget);
        return legalMoves.length === 0;
    }

    /**
     * Checks for draw due to insufficient material according to standard rules:
     * - King vs King
     * - King & Knight vs King
     * - King & Bishop vs King
     * - King & Bishop vs King & Bishop (Bishops on same square color)
     */
    public static isInsufficientMaterial(board: Board): boolean {
        const pieces = board.findAllPieces();

        // Pawns, Rooks, and Queens provide sufficient winning material
        if (pieces.length > 4) return false;

        const pieceSymbols = pieces.map(p => p.piece.definition.symbol);

        if (pieceSymbols.some(s => s === 'P' || s === 'R' || s === 'Q')) {
            return false;
        }

        // King vs King
        if (pieces.length === 2) {
            return true;
        }

        // King & Minor Piece vs King
        if (pieces.length === 3) {
            const hasKnightOrBishop = pieceSymbols.some(s => s === 'N' || s === 'B');
            if (hasKnightOrBishop) return true;
        }

        // King & Bishop vs King & Bishop
        if (pieces.length === 4) {
            const whitePieces = pieces.filter(p => p.piece.color === 'w');
            const blackPieces = pieces.filter(p => p.piece.color === 'b');

            const whiteHasBishop = whitePieces.some(p => p.piece.definition.symbol === 'B');
            const blackHasBishop = blackPieces.some(p => p.piece.definition.symbol === 'B');

            if (whiteHasBishop && blackHasBishop) {
                const whiteBishopPos = whitePieces.find(p => p.piece.definition.symbol === 'B')!.pos;
                const blackBishopPos = blackPieces.find(p => p.piece.definition.symbol === 'B')!.pos;

                const whiteBishopSquareColor = (whiteBishopPos.x + whiteBishopPos.y) % 2;
                const blackBishopSquareColor = (blackBishopPos.x + blackBishopPos.y) % 2;

                // Draw if bishops are on same square colors
                if (whiteBishopSquareColor === blackBishopSquareColor) {
                    return true;
                }
            }
        }

        return false;
    }
}