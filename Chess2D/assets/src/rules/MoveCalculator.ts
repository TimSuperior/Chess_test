import { IVector, VectorUtils } from 'db://assets/src/interfaces/IVector';
import { IPieceState, PieceColor } from 'db://assets/src/interfaces/IPieceState';
import { IMove, MoveType, MoveUtils } from 'db://assets/src/interfaces/IMove';
import { Board } from 'db://assets/src/board/Board';

/**
 * High-performance move generator and attack evaluator.
 * Handles vector raycasting, leaping pieces, pawn mechanics, and spatial attack queries.
 */
export class MoveCalculator {

    // =========================================================================
    // PSEUDO-LEGAL MOVE GENERATION
    // =========================================================================

    /**
     * Generates all pseudo-legal moves for a piece at the specified coordinate.
     * Pseudo-legal moves adhere to physical board paths and captures, but do not yet
     * filter out moves that leave the friendly King in check.
     * 
     * @param board The active spatial board container
     * @param fromX Starting X coordinate
     * @param fromY Starting Y coordinate
     * @param enPassantTarget Optional coordinate of an active en passant target square
     */
    public static getPseudoLegalMoves(
        board: Board,
        fromX: number,
        fromY: number,
        enPassantTarget?: IVector | null
    ): IMove[] {
        const piece = board.getPiece(fromX, fromY);
        if (!piece) return [];

        const fromPos: IVector = { x: fromX, y: fromY };

        // 1. Special Pawn Handler
        if (piece.definition.type === 'pawn') {
            return this.getPawnMoves(board, fromPos, piece, enPassantTarget);
        }

        // 2. Generic Vector-Based Handler (Rook, Bishop, Knight, Queen, King, Custom Pieces)
        return this.getGenericPieceMoves(board, fromPos, piece);
    }

    /**
     * Returns an array of target coordinate vectors representing all pseudo-legal destination squares.
     */
    public static getPseudoLegalTargets(
        board: Board,
        fromX: number,
        fromY: number,
        enPassantTarget?: IVector | null
    ): IVector[] {
        const moves = this.getPseudoLegalMoves(board, fromX, fromY, enPassantTarget);
        return moves.map(m => m.to);
    }

    /**
     * Generates all pseudo-legal moves for all pieces belonging to a player color.
     */
    public static getAllPseudoLegalMoves(
        board: Board,
        color: PieceColor,
        enPassantTarget?: IVector | null
    ): IMove[] {
        const moves: IMove[] = [];
        const pieces = board.findAllPieces(color);

        for (let i = 0; i < pieces.length; i++) {
            const { pos } = pieces[i];
            const pieceMoves = this.getPseudoLegalMoves(board, pos.x, pos.y, enPassantTarget);
            for (let j = 0; j < pieceMoves.length; j++) {
                moves.push(pieceMoves[j]);
            }
        }

        return moves;
    }

    // =========================================================================
    // ATTACK & THREAT EVALUATION
    // =========================================================================

    /**
     * Checks if a target square is attacked by any enemy piece of the specified attacker color.
     * Used for check detection, castling path validation, and king safety.
     * 
     * @param board The active board container
     * @param targetPos Square coordinate to evaluate
     * @param attackerColor Player color launching attacks
     */
    public static isSquareAttacked(board: Board, targetPos: IVector, attackerColor: PieceColor): boolean {
        const attackerPieces = board.findAllPieces(attackerColor);

        for (let i = 0; i < attackerPieces.length; i++) {
            const { pos, piece } = attackerPieces[i];

            // Pawns attack diagonally regardless of whether an enemy piece is present
            if (piece.definition.type === 'pawn') {
                const forwardY = piece.color === 'w' ? 1 : -1;
                const leftAttack: IVector = { x: pos.x - 1, y: pos.y + forwardY };
                const rightAttack: IVector = { x: pos.x + 1, y: pos.y + forwardY };

                if (VectorUtils.equals(leftAttack, targetPos) || VectorUtils.equals(rightAttack, targetPos)) {
                    return true;
                }
                continue;
            }

            // Standard / Custom piece attacks
            const moves = this.getGenericPieceMoves(board, pos, piece);
            for (let j = 0; j < moves.length; j++) {
                if (VectorUtils.equals(moves[j].to, targetPos)) {
                    return true;
                }
            }
        }

        return false;
    }

    // =========================================================================
    // PRIVATE VECTOR IMPLEMENTATIONS
    // =========================================================================

    /**
     * Vector generator for non-pawn pieces.
     * Uses raycasting for sliders and single-step calculation for leapers.
     */
    private static getGenericPieceMoves(
        board: Board,
        from: IVector,
        piece: IPieceState
    ): IMove[] {
        const moves: IMove[] = [];
        const def = piece.definition;
        const directions = def.directions;
        const maxSteps = def.maxSteps || (def.isSlider ? Math.max(board.width, board.height) : 1);

        for (let i = 0; i < directions.length; i++) {
            const dir = directions[i];
            let step = 1;

            while (step <= maxSteps) {
                const to: IVector = {
                    x: from.x + dir.x * step,
                    y: from.y + dir.y * step
                };

                if (!board.isValidPos(to)) {
                    break; // Out of board bounds
                }

                const targetPiece = board.getPieceAt(to);

                if (targetPiece === null) {
                    // Empty square move
                    moves.push(MoveUtils.create(from, to, piece, 'normal'));
                } else {
                    if (targetPiece.color !== piece.color) {
                        // Enemy capture move
                        moves.push(MoveUtils.create(from, to, piece, 'normal', targetPiece));
                    }
                    // Path blocked by piece (friendly or enemy)
                    if (!def.canJump) {
                        break;
                    }
                }

                if (!def.isSlider && !def.canJump) {
                    break;
                }

                step++;
            }
        }

        return moves;
    }

    /**
     * Special move generator for pawns (Forward step, Double step, Diagonal captures, En Passant, Promotion).
     */
    private static getPawnMoves(
        board: Board,
        from: IVector,
        piece: IPieceState,
        enPassantTarget?: IVector | null
    ): IMove[] {
        const moves: IMove[] = [];
        const forwardY = piece.color === 'w' ? 1 : -1;
        const promotionRank = piece.color === 'w' ? board.height - 1 : 0;
        const startRank = piece.color === 'w' ? 1 : board.height - 2;

        // 1. One-step forward move
        const oneStep: IVector = { x: from.x, y: from.y + forwardY };
        if (board.isValidPos(oneStep) && board.getPieceAt(oneStep) === null) {
            const isPromotion = oneStep.y === promotionRank;
            const moveType: MoveType = isPromotion ? 'promotion' : 'normal';

            moves.push(MoveUtils.create(
                from,
                oneStep,
                piece,
                moveType,
                null,
                isPromotion ? 'Q' : undefined
            ));

            // 2. Two-step initial forward move
            const isAtStartRank = from.y === startRank;
            if (isAtStartRank && !piece.hasMoved) {
                const twoStep: IVector = { x: from.x, y: from.y + forwardY * 2 };
                if (board.isValidPos(twoStep) && board.getPieceAt(twoStep) === null) {
                    moves.push(MoveUtils.create(from, twoStep, piece, 'double_step'));
                }
            }
        }

        // 3. Diagonal captures & En Passant
        const captureOffsets: IVector[] = [{ x: -1, y: forwardY }, { x: 1, y: forwardY }];

        for (let i = 0; i < captureOffsets.length; i++) {
            const offset = captureOffsets[i];
            const targetPos: IVector = { x: from.x + offset.x, y: from.y + offset.y };

            if (!board.isValidPos(targetPos)) continue;

            const targetPiece = board.getPieceAt(targetPos);

            // Regular Diagonal Capture
            if (targetPiece !== null && targetPiece.color !== piece.color) {
                const isPromotion = targetPos.y === promotionRank;
                const moveType: MoveType = isPromotion ? 'promotion' : 'normal';

                moves.push(MoveUtils.create(
                    from,
                    targetPos,
                    piece,
                    moveType,
                    targetPiece,
                    isPromotion ? 'Q' : undefined
                ));
            }
            // En Passant Capture
            else if (targetPiece === null && enPassantTarget && VectorUtils.equals(targetPos, enPassantTarget)) {
                const capturedPawnSquare: IVector = { x: targetPos.x, y: from.y };
                const capturedPawn = board.getPieceAt(capturedPawnSquare);

                if (capturedPawn && capturedPawn.color !== piece.color) {
                    moves.push(MoveUtils.create(
                        from,
                        targetPos,
                        piece,
                        'en_passant',
                        capturedPawn
                    ));
                }
            }
        }

        return moves;
    }
}