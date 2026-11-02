import { IVector, VectorUtils } from 'db://assets/src/interfaces/IVector';
import { IPieceState, PieceColor, PieceStateUtils } from 'db://assets/src/interfaces/IPieceState';
import { IMove, MoveType, MoveUtils } from 'db://assets/src/interfaces/IMove';
import { Board } from 'db://assets/src/board/Board';
import { MoveCalculator } from 'db://assets/src/rules/MoveCalculator';
import { PieceRegistry } from 'db://assets/src/pieces/PieceRegistry';

/**
 * Handles special chess rule mechanics: Castling, En Passant, and Pawn Promotion.
 * Executes board state modifications for non-standard move payloads.
 */
export class SpecialRules {

    // =========================================================================
    // CASTLING VALIDATION
    // =========================================================================

    /**
     * Calculates valid Kingside and Queenside castling moves for a King at kingPos.
     * Validates that neither King nor Rook has moved, path is clear, and King does not pass through check.
     */
    public static getCastlingMoves(board: Board, kingPos: IVector, color: PieceColor): IMove[] {
        const moves: IMove[] = [];
        const king = board.getPieceAt(kingPos);

        // 1. Basic King validation
        if (!king || king.definition.symbol !== 'K' || king.color !== color || king.hasMoved) {
            return moves;
        }

        const enemyColor: PieceColor = PieceStateUtils.getOppositeColor(color);

        // 2. King cannot castle out of check
        if (MoveCalculator.isSquareAttacked(board, kingPos, enemyColor)) {
            return moves;
        }

        const rank = kingPos.y;

        // ---------------------------------------------------------------------
        // KINGSIDE CASTLING (Short Castling)
        // ---------------------------------------------------------------------
        const kingsideRookPos: IVector = { x: board.width - 1, y: rank };
        const kingsideRook = board.getPieceAt(kingsideRookPos);

        if (kingsideRook && kingsideRook.definition.symbol === 'R' && !kingsideRook.hasMoved) {
            const passThroughSquare: IVector = { x: kingPos.x + 1, y: rank };
            const destinationSquare: IVector = { x: kingPos.x + 2, y: rank };

            // Path must be clear of pieces
            const isPathClear = 
                board.getPieceAt(passThroughSquare) === null && 
                board.getPieceAt(destinationSquare) === null;

            if (isPathClear) {
                // King cannot pass through or land on an attacked square
                const isPathSafe = 
                    !MoveCalculator.isSquareAttacked(board, passThroughSquare, enemyColor) &&
                    !MoveCalculator.isSquareAttacked(board, destinationSquare, enemyColor);

                if (isPathSafe) {
                    moves.push(MoveUtils.create(kingPos, destinationSquare, king, 'castling_kingside'));
                }
            }
        }

        // ---------------------------------------------------------------------
        // QUEENSIDE CASTLING (Long Castling)
        // ---------------------------------------------------------------------
        const queensideRookPos: IVector = { x: 0, y: rank };
        const queensideRook = board.getPieceAt(queensideRookPos);

        if (queensideRook && queensideRook.definition.symbol === 'R' && !queensideRook.hasMoved) {
            const knightSquare: IVector = { x: kingPos.x - 1, y: rank };
            const destinationSquare: IVector = { x: kingPos.x - 2, y: rank };
            const bFileSquare: IVector = { x: kingPos.x - 3, y: rank }; // Square adjacent to Rook

            // Path between King and Rook must be empty
            const isPathClear = 
                board.getPieceAt(knightSquare) === null && 
                board.getPieceAt(destinationSquare) === null &&
                (board.isValidPos(bFileSquare) ? board.getPieceAt(bFileSquare) === null : true);

            if (isPathClear) {
                // King cannot pass through or land on an attacked square
                const isPathSafe = 
                    !MoveCalculator.isSquareAttacked(board, knightSquare, enemyColor) &&
                    !MoveCalculator.isSquareAttacked(board, destinationSquare, enemyColor);

                if (isPathSafe) {
                    moves.push(MoveUtils.create(kingPos, destinationSquare, king, 'castling_queenside'));
                }
            }
        }

        return moves;
    }

    // =========================================================================
    // EN PASSANT HELPERS
    // =========================================================================

    /**
     * Determines if a completed move created an active En Passant target square.
     * @returns The skipped square vector if a double-step pawn move occurred, otherwise null.
     */
    public static getEnPassantTarget(lastMove: IMove | null): IVector | null {
        if (!lastMove || lastMove.moveType !== 'double_step') {
            return null;
        }

        return {
            x: lastMove.from.x,
            y: (lastMove.from.y + lastMove.to.y) / 2
        };
    }

    // =========================================================================
    // SPECIAL MOVE EXECUTION
    // =========================================================================

    /**
     * Executes special move mechanics directly on the board instance.
     * Moves secondary pieces (e.g., Castling Rooks) and removes off-square captures (En Passant).
     */
    public static executeSpecialMove(board: Board, move: IMove): void {
        const rank = move.from.y;

        switch (move.moveType) {
            case 'castling_kingside': {
                // Move King to (x=6)
                board.movePiece(move.from.x, move.from.y, move.to.x, move.to.y);
                move.piece.hasMoved = true;
                move.piece.moveCount++;

                // Move Rook from h-file (x=7) to f-file (x=5)
                const rookFromX = board.width - 1;
                const rookToX = move.to.x - 1;
                const rook = board.getPiece(rookFromX, rank);
                if (rook) {
                    board.movePiece(rookFromX, rank, rookToX, rank);
                    rook.hasMoved = true;
                    rook.moveCount++;
                }
                break;
            }

            case 'castling_queenside': {
                // Move King to (x=2)
                board.movePiece(move.from.x, move.from.y, move.to.x, move.to.y);
                move.piece.hasMoved = true;
                move.piece.moveCount++;

                // Move Rook from a-file (x=0) to d-file (x=3)
                const rookFromX = 0;
                const rookToX = move.to.x + 1;
                const rook = board.getPiece(rookFromX, rank);
                if (rook) {
                    board.movePiece(rookFromX, rank, rookToX, rank);
                    rook.hasMoved = true;
                    rook.moveCount++;
                }
                break;
            }

            case 'en_passant': {
                // Move attacking pawn to empty target square
                board.movePiece(move.from.x, move.from.y, move.to.x, move.to.y);
                move.piece.hasMoved = true;
                move.piece.moveCount++;

                // Remove captured pawn sitting adjacent on the starting rank
                const capturedPawnSquare: IVector = { x: move.to.x, y: move.from.y };
                board.removePieceAt(capturedPawnSquare);
                break;
            }

            case 'promotion': {
                // Move pawn to promotion rank
                board.movePiece(move.from.x, move.from.y, move.to.x, move.to.y);

                // Promote pawn to target piece definition (Defaults to Queen 'Q')
                const promoSymbol = move.promotedToSymbol || 'Q';
                const promoDef = PieceRegistry.getBySymbol(promoSymbol) || PieceRegistry.getBySymbol('Q')!;
                const promotedPiece = PieceStateUtils.create(promoDef, move.piece.color, move.piece.id);
                promotedPiece.hasMoved = true;
                promotedPiece.moveCount = move.piece.moveCount + 1;

                board.setPieceAt(move.to, promotedPiece);
                break;
            }

            case 'normal':
            case 'double_step':
            default: {
                board.movePiece(move.from.x, move.from.y, move.to.x, move.to.y);
                move.piece.hasMoved = true;
                move.piece.moveCount++;
                break;
            }
        }
    }
}