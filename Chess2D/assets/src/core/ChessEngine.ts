import { IVector, VectorUtils } from 'db://assets/src/interfaces/IVector';
import { IPieceState, PieceColor, PieceStateUtils } from 'db://assets/src/interfaces/IPieceState';
import { IMove, MoveUtils } from 'db://assets/src/interfaces/IMove';
import { Board } from 'db://assets/src/board/Board';
import { MoveCalculator } from 'db://assets/src/rules/MoveCalculator';
import { SpecialRules } from 'db://assets/src/rules/SpecialRules';
import { RuleValidator } from 'db://assets/src/rules/RuleValidator';
import { FENParser, ICastlingRights, IFENParsedState } from 'db://assets/src/core/FENParser';
import { PieceRegistry } from 'db://assets/src/pieces/PieceRegistry';

/**
 * Represents the current status of the chess match.
 */
export type GameStatus =
    | 'active'
    | 'checkmate'
    | 'stalemate'
    | 'draw_insufficient_material'
    | 'draw_50_move_rule';

/**
 * State snapshot for undo/redo history tracking.
 */
export interface IEngineSnapshot {
    board: Board;
    activeTurn: PieceColor;
    castlingRights: ICastlingRights;
    enPassantTarget: IVector | null;
    halfmoveClock: number;
    fullmoveNumber: number;
    gameStatus: GameStatus;
    winner: PieceColor | null;
    executedMove: IMove;
}

/**
 * Main orchestrator and facade for the chess engine.
 * Controls turn cycles, move execution, game status evaluation, and state undo history.
 */
export class ChessEngine {
    public board: Board;
    public activeTurn: PieceColor = 'w';
    public castlingRights: ICastlingRights;
    public enPassantTarget: IVector | null = null;
    public halfmoveClock = 0;
    public fullmoveNumber = 1;
    public gameStatus: GameStatus = 'active';
    public winner: PieceColor | null = null;

    /** Stack containing historical moves and board snapshots for undo capabilities */
    private historyStack: IEngineSnapshot[] = [];

    /**
     * Initializes a new ChessEngine instance.
     * @param width Board width (default: 8)
     * @param height Board height (default: 8)
     */
    constructor(width = 8, height = 8) {
        PieceRegistry.initialize();
        this.board = new Board(width, height);
        this.castlingRights = this.getDefaultCastlingRights();
        this.startNewGame();
    }

    // =========================================================================
    // GAME LIFECYCLE MANAGEMENT
    // =========================================================================

    /**
     * Starts a new game using the standard initial layout or an optional starting FEN string.
     */
    public startNewGame(fen: string = FENParser.DEFAULT_FEN): void {
        this.historyStack = [];
        this.gameStatus = 'active';
        this.winner = null;

        if (fen === FENParser.DEFAULT_FEN) {
            this.board.setupStandardBoard();
            this.activeTurn = 'w';
            this.castlingRights = this.getDefaultCastlingRights();
            this.enPassantTarget = null;
            this.halfmoveClock = 0;
            this.fullmoveNumber = 1;
        } else {
            this.loadFEN(fen);
        }
    }

    /**
     * Loads board position and match metadata from a FEN string.
     */
    public loadFEN(fen: string): void {
        const parsedState: IFENParsedState = FENParser.parse(fen, this.board);
        this.activeTurn = parsedState.activeTurn;
        this.castlingRights = parsedState.castlingRights;
        this.enPassantTarget = parsedState.enPassantTarget;
        this.halfmoveClock = parsedState.halfmoveClock;
        this.fullmoveNumber = parsedState.fullmoveNumber;
        this.updateGameStatus();
    }

    /**
     * Exports current match state into a standard FEN string.
     */
    public getFEN(): string {
        return FENParser.generate(this.board, {
            activeTurn: this.activeTurn,
            castlingRights: this.castlingRights,
            enPassantTarget: this.enPassantTarget,
            halfmoveClock: this.halfmoveClock,
            fullmoveNumber: this.fullmoveNumber
        });
    }

    // =========================================================================
    // MOVE EXECUTION & QUERYING
    // =========================================================================

    /**
     * Gets all strictly legal moves for a piece at (x, y).
     */
    public getLegalMoves(x: number, y: number): IMove[] {
        if (this.gameStatus !== 'active') return [];
        return RuleValidator.getLegalMoves(this.board, x, y, this.activeTurn, this.enPassantTarget);
    }

    /**
     * Attempts to execute a move from (fromX, fromY) to (toX, toY).
     * @param fromX Starting column
     * @param fromY Starting row
     * @param toX Target column
     * @param toY Target row
     * @param promotionSymbol Optional piece symbol for pawn promotion ('Q', 'R', 'B', 'N')
     * @returns True if the move was valid and executed; false otherwise.
     */
    public makeMove(
        fromX: number,
        fromY: number,
        toX: number,
        toY: number,
        promotionSymbol?: string
    ): boolean {
        if (this.gameStatus !== 'active') return false;

        const legalMoves = this.getLegalMoves(fromX, fromY);
        const selectedMove = legalMoves.find(m => m.to.x === toX && m.to.y === toY);

        if (!selectedMove) return false;

        // Apply promotion symbol if specified
        let finalMove = selectedMove;
        if (selectedMove.moveType === 'promotion' && promotionSymbol) {
            finalMove = MoveUtils.create(
                selectedMove.from,
                selectedMove.to,
                selectedMove.piece,
                'promotion',
                selectedMove.capturedPiece,
                promotionSymbol.toUpperCase()
            );
        }

        // Save current snapshot before mutating state
        this.saveSnapshot(finalMove);

        // Execute board mutations (handles regular moves, castling, en passant, promotion)
        SpecialRules.executeSpecialMove(this.board, finalMove);

        // Update halfmove clock (resets on pawn advance or piece capture)
        const isPawnMove = finalMove.piece.definition.type === 'pawn';
        const isCapture = finalMove.capturedPiece !== null && finalMove.capturedPiece !== undefined;

        if (isPawnMove || isCapture) {
            this.halfmoveClock = 0;
        } else {
            this.halfmoveClock++;
        }

        // Update fullmove counter after Black completes turn
        if (this.activeTurn === 'b') {
            this.fullmoveNumber++;
        }

        // Update castling availability flags
        this.updateCastlingRights(finalMove);

        // Calculate new en passant target square
        this.enPassantTarget = SpecialRules.getEnPassantTarget(finalMove);

        // Switch active turn player
        this.activeTurn = PieceStateUtils.getOppositeColor(this.activeTurn);

        // Evaluate game status (Checkmate, Stalemate, Draws)
        this.updateGameStatus();

        return true;
    }

    /**
     * Reverts the board and engine parameters to the state prior to the last executed move.
     * @returns True if undo was successful; false if history is empty.
     */
    public undoMove(): boolean {
        if (this.historyStack.length === 0) return false;

        const snapshot = this.historyStack.pop()!;
        this.board = snapshot.board;
        this.activeTurn = snapshot.activeTurn;
        this.castlingRights = { ...snapshot.castlingRights };
        this.enPassantTarget = snapshot.enPassantTarget ? { ...snapshot.enPassantTarget } : null;
        this.halfmoveClock = snapshot.halfmoveClock;
        this.fullmoveNumber = snapshot.fullmoveNumber;
        this.gameStatus = snapshot.gameStatus;
        this.winner = snapshot.winner;

        return true;
    }

    // =========================================================================
    // STATE EVALUATION & INTERNAL HELPERS
    // =========================================================================

    /**
     * Checks if the active turn player's King is currently in check.
     */
    public isCheck(): boolean {
        return RuleValidator.isInCheck(this.board, this.activeTurn);
    }

    /**
     * Returns the complete history list of executed moves.
     */
    public getMoveHistory(): IMove[] {
        return this.historyStack.map(s => s.executedMove);
    }

    /**
     * Evaluates current board conditions and updates game status flags.
     */
    private updateGameStatus(): void {
        const isCheck = RuleValidator.isInCheck(this.board, this.activeTurn);
        const legalMoves = RuleValidator.getAllLegalMoves(this.board, this.activeTurn, this.enPassantTarget);

        if (legalMoves.length === 0) {
            if (isCheck) {
                this.gameStatus = 'checkmate';
                this.winner = PieceStateUtils.getOppositeColor(this.activeTurn);
            } else {
                this.gameStatus = 'stalemate';
                this.winner = null;
            }
            return;
        }

        if (this.halfmoveClock >= 100) { // 50 full moves without pawn move or capture
            this.gameStatus = 'draw_50_move_rule';
            this.winner = null;
            return;
        }

        if (RuleValidator.isInsufficientMaterial(this.board)) {
            this.gameStatus = 'draw_insufficient_material';
            this.winner = null;
            return;
        }

        this.gameStatus = 'active';
        this.winner = null;
    }

    /**
     * Updates castling rights when Kings or Rooks move or get captured.
     */
    private updateCastlingRights(move: IMove): void {
        const symbol = move.piece.definition.symbol;
        const color = move.piece.color;

        // King move disables all castling rights for that player
        if (symbol === 'K') {
            if (color === 'w') {
                this.castlingRights.whiteKingside = false;
                this.castlingRights.whiteQueenside = false;
            } else {
                this.castlingRights.blackKingside = false;
                this.castlingRights.blackQueenside = false;
            }
        }

        // Rook move disables specific wing castling right
        if (symbol === 'R') {
            if (color === 'w') {
                if (move.from.x === 7 && move.from.y === 0) this.castlingRights.whiteKingside = false;
                if (move.from.x === 0 && move.from.y === 0) this.castlingRights.whiteQueenside = false;
            } else {
                if (move.from.x === 7 && move.from.y === 7) this.castlingRights.blackKingside = false;
                if (move.from.x === 0 && move.from.y === 7) this.castlingRights.blackQueenside = false;
            }
        }

        // Capture of a Rook disables that specific wing castling right for the opponent
        if (move.capturedPiece && move.capturedPiece.definition.symbol === 'R') {
            const capPos = move.to;
            if (capPos.x === 7 && capPos.y === 0) this.castlingRights.whiteKingside = false;
            if (capPos.x === 0 && capPos.y === 0) this.castlingRights.whiteQueenside = false;
            if (capPos.x === 7 && capPos.y === 7) this.castlingRights.blackKingside = false;
            if (capPos.x === 0 && capPos.y === 7) this.castlingRights.blackQueenside = false;
        }
    }

    /**
     * Pushes a deep-cloned engine state snapshot onto the history stack.
     */
    private saveSnapshot(executedMove: IMove): void {
        this.historyStack.push({
            board: this.board.clone(),
            activeTurn: this.activeTurn,
            castlingRights: { ...this.castlingRights },
            enPassantTarget: this.enPassantTarget ? { ...this.enPassantTarget } : null,
            halfmoveClock: this.halfmoveClock,
            fullmoveNumber: this.fullmoveNumber,
            gameStatus: this.gameStatus,
            winner: this.winner,
            executedMove: MoveUtils.clone(executedMove)
        });
    }

    /** Returns default castling rights container */
    private getDefaultCastlingRights(): ICastlingRights {
        return {
            whiteKingside: true,
            whiteQueenside: true,
            blackKingside: true,
            blackQueenside: true
        };
    }
}