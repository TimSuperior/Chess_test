System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, PieceStateUtils, MoveUtils, Board, SpecialRules, RuleValidator, FENParser, PieceRegistry, ChessEngine, _crd;

  function _reportPossibleCrUseOfIVector(extras) {
    _reporterNs.report("IVector", "db://assets/src/interfaces/IVector", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPieceColor(extras) {
    _reporterNs.report("PieceColor", "db://assets/src/interfaces/IPieceState", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPieceStateUtils(extras) {
    _reporterNs.report("PieceStateUtils", "db://assets/src/interfaces/IPieceState", _context.meta, extras);
  }

  function _reportPossibleCrUseOfIMove(extras) {
    _reporterNs.report("IMove", "db://assets/src/interfaces/IMove", _context.meta, extras);
  }

  function _reportPossibleCrUseOfMoveUtils(extras) {
    _reporterNs.report("MoveUtils", "db://assets/src/interfaces/IMove", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBoard(extras) {
    _reporterNs.report("Board", "db://assets/src/board/Board", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSpecialRules(extras) {
    _reporterNs.report("SpecialRules", "db://assets/src/rules/SpecialRules", _context.meta, extras);
  }

  function _reportPossibleCrUseOfRuleValidator(extras) {
    _reporterNs.report("RuleValidator", "db://assets/src/rules/RuleValidator", _context.meta, extras);
  }

  function _reportPossibleCrUseOfFENParser(extras) {
    _reporterNs.report("FENParser", "db://assets/src/core/FENParser", _context.meta, extras);
  }

  function _reportPossibleCrUseOfICastlingRights(extras) {
    _reporterNs.report("ICastlingRights", "db://assets/src/core/FENParser", _context.meta, extras);
  }

  function _reportPossibleCrUseOfIFENParsedState(extras) {
    _reporterNs.report("IFENParsedState", "db://assets/src/core/FENParser", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPieceRegistry(extras) {
    _reporterNs.report("PieceRegistry", "db://assets/src/pieces/PieceRegistry", _context.meta, extras);
  }

  _export("ChessEngine", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
    }, function (_unresolved_2) {
      PieceStateUtils = _unresolved_2.PieceStateUtils;
    }, function (_unresolved_3) {
      MoveUtils = _unresolved_3.MoveUtils;
    }, function (_unresolved_4) {
      Board = _unresolved_4.Board;
    }, function (_unresolved_5) {
      SpecialRules = _unresolved_5.SpecialRules;
    }, function (_unresolved_6) {
      RuleValidator = _unresolved_6.RuleValidator;
    }, function (_unresolved_7) {
      FENParser = _unresolved_7.FENParser;
    }, function (_unresolved_8) {
      PieceRegistry = _unresolved_8.PieceRegistry;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "b82d43wp0VOn7RM8q49JKqO", "ChessEngine", undefined);

      /**
       * Represents the current status of the chess match.
       */

      /**
       * State snapshot for undo/redo history tracking.
       */

      /**
       * Main orchestrator and facade for the chess engine.
       * Controls turn cycles, move execution, game status evaluation, and state undo history.
       */
      _export("ChessEngine", ChessEngine = class ChessEngine {
        /**
         * Initializes a new ChessEngine instance.
         * @param width Board width (default: 8)
         * @param height Board height (default: 8)
         */
        constructor(width = 8, height = 8) {
          this.board = void 0;
          this.activeTurn = 'w';
          this.castlingRights = void 0;
          this.enPassantTarget = null;
          this.halfmoveClock = 0;
          this.fullmoveNumber = 1;
          this.gameStatus = 'active';
          this.winner = null;

          /** Stack containing historical moves and board snapshots for undo capabilities */
          this.historyStack = [];
          (_crd && PieceRegistry === void 0 ? (_reportPossibleCrUseOfPieceRegistry({
            error: Error()
          }), PieceRegistry) : PieceRegistry).initialize();
          this.board = new (_crd && Board === void 0 ? (_reportPossibleCrUseOfBoard({
            error: Error()
          }), Board) : Board)(width, height);
          this.castlingRights = this.getDefaultCastlingRights();
          this.startNewGame();
        } // =========================================================================
        // GAME LIFECYCLE MANAGEMENT
        // =========================================================================

        /**
         * Starts a new game using the standard initial layout or an optional starting FEN string.
         */


        startNewGame(fen = (_crd && FENParser === void 0 ? (_reportPossibleCrUseOfFENParser({
          error: Error()
        }), FENParser) : FENParser).DEFAULT_FEN) {
          this.historyStack = [];
          this.gameStatus = 'active';
          this.winner = null;

          if (fen === (_crd && FENParser === void 0 ? (_reportPossibleCrUseOfFENParser({
            error: Error()
          }), FENParser) : FENParser).DEFAULT_FEN) {
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


        loadFEN(fen) {
          const parsedState = (_crd && FENParser === void 0 ? (_reportPossibleCrUseOfFENParser({
            error: Error()
          }), FENParser) : FENParser).parse(fen, this.board);
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


        getFEN() {
          return (_crd && FENParser === void 0 ? (_reportPossibleCrUseOfFENParser({
            error: Error()
          }), FENParser) : FENParser).generate(this.board, {
            activeTurn: this.activeTurn,
            castlingRights: this.castlingRights,
            enPassantTarget: this.enPassantTarget,
            halfmoveClock: this.halfmoveClock,
            fullmoveNumber: this.fullmoveNumber
          });
        } // =========================================================================
        // MOVE EXECUTION & QUERYING
        // =========================================================================

        /**
         * Gets all strictly legal moves for a piece at (x, y).
         */


        getLegalMoves(x, y) {
          if (this.gameStatus !== 'active') return [];
          return (_crd && RuleValidator === void 0 ? (_reportPossibleCrUseOfRuleValidator({
            error: Error()
          }), RuleValidator) : RuleValidator).getLegalMoves(this.board, x, y, this.activeTurn, this.enPassantTarget);
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


        makeMove(fromX, fromY, toX, toY, promotionSymbol) {
          if (this.gameStatus !== 'active') return false;
          const legalMoves = this.getLegalMoves(fromX, fromY);
          const selectedMove = legalMoves.find(m => m.to.x === toX && m.to.y === toY);
          if (!selectedMove) return false; // Apply promotion symbol if specified

          let finalMove = selectedMove;

          if (selectedMove.moveType === 'promotion' && promotionSymbol) {
            finalMove = (_crd && MoveUtils === void 0 ? (_reportPossibleCrUseOfMoveUtils({
              error: Error()
            }), MoveUtils) : MoveUtils).create(selectedMove.from, selectedMove.to, selectedMove.piece, 'promotion', selectedMove.capturedPiece, promotionSymbol.toUpperCase());
          } // Save current snapshot before mutating state


          this.saveSnapshot(finalMove); // Execute board mutations (handles regular moves, castling, en passant, promotion)

          (_crd && SpecialRules === void 0 ? (_reportPossibleCrUseOfSpecialRules({
            error: Error()
          }), SpecialRules) : SpecialRules).executeSpecialMove(this.board, finalMove); // Update halfmove clock (resets on pawn advance or piece capture)

          const isPawnMove = finalMove.piece.definition.type === 'pawn';
          const isCapture = finalMove.capturedPiece !== null && finalMove.capturedPiece !== undefined;

          if (isPawnMove || isCapture) {
            this.halfmoveClock = 0;
          } else {
            this.halfmoveClock++;
          } // Update fullmove counter after Black completes turn


          if (this.activeTurn === 'b') {
            this.fullmoveNumber++;
          } // Update castling availability flags


          this.updateCastlingRights(finalMove); // Calculate new en passant target square

          this.enPassantTarget = (_crd && SpecialRules === void 0 ? (_reportPossibleCrUseOfSpecialRules({
            error: Error()
          }), SpecialRules) : SpecialRules).getEnPassantTarget(finalMove); // Switch active turn player

          this.activeTurn = (_crd && PieceStateUtils === void 0 ? (_reportPossibleCrUseOfPieceStateUtils({
            error: Error()
          }), PieceStateUtils) : PieceStateUtils).getOppositeColor(this.activeTurn); // Evaluate game status (Checkmate, Stalemate, Draws)

          this.updateGameStatus();
          return true;
        }
        /**
         * Reverts the board and engine parameters to the state prior to the last executed move.
         * @returns True if undo was successful; false if history is empty.
         */


        undoMove() {
          if (this.historyStack.length === 0) return false;
          const snapshot = this.historyStack.pop();
          this.board = snapshot.board;
          this.activeTurn = snapshot.activeTurn;
          this.castlingRights = { ...snapshot.castlingRights
          };
          this.enPassantTarget = snapshot.enPassantTarget ? { ...snapshot.enPassantTarget
          } : null;
          this.halfmoveClock = snapshot.halfmoveClock;
          this.fullmoveNumber = snapshot.fullmoveNumber;
          this.gameStatus = snapshot.gameStatus;
          this.winner = snapshot.winner;
          return true;
        } // =========================================================================
        // STATE EVALUATION & INTERNAL HELPERS
        // =========================================================================

        /**
         * Checks if the active turn player's King is currently in check.
         */


        isCheck() {
          return (_crd && RuleValidator === void 0 ? (_reportPossibleCrUseOfRuleValidator({
            error: Error()
          }), RuleValidator) : RuleValidator).isInCheck(this.board, this.activeTurn);
        }
        /**
         * Returns the complete history list of executed moves.
         */


        getMoveHistory() {
          return this.historyStack.map(s => s.executedMove);
        }
        /**
         * Evaluates current board conditions and updates game status flags.
         */


        updateGameStatus() {
          const isCheck = (_crd && RuleValidator === void 0 ? (_reportPossibleCrUseOfRuleValidator({
            error: Error()
          }), RuleValidator) : RuleValidator).isInCheck(this.board, this.activeTurn);
          const legalMoves = (_crd && RuleValidator === void 0 ? (_reportPossibleCrUseOfRuleValidator({
            error: Error()
          }), RuleValidator) : RuleValidator).getAllLegalMoves(this.board, this.activeTurn, this.enPassantTarget);

          if (legalMoves.length === 0) {
            if (isCheck) {
              this.gameStatus = 'checkmate';
              this.winner = (_crd && PieceStateUtils === void 0 ? (_reportPossibleCrUseOfPieceStateUtils({
                error: Error()
              }), PieceStateUtils) : PieceStateUtils).getOppositeColor(this.activeTurn);
            } else {
              this.gameStatus = 'stalemate';
              this.winner = null;
            }

            return;
          }

          if (this.halfmoveClock >= 100) {
            // 50 full moves without pawn move or capture
            this.gameStatus = 'draw_50_move_rule';
            this.winner = null;
            return;
          }

          if ((_crd && RuleValidator === void 0 ? (_reportPossibleCrUseOfRuleValidator({
            error: Error()
          }), RuleValidator) : RuleValidator).isInsufficientMaterial(this.board)) {
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


        updateCastlingRights(move) {
          const symbol = move.piece.definition.symbol;
          const color = move.piece.color; // King move disables all castling rights for that player

          if (symbol === 'K') {
            if (color === 'w') {
              this.castlingRights.whiteKingside = false;
              this.castlingRights.whiteQueenside = false;
            } else {
              this.castlingRights.blackKingside = false;
              this.castlingRights.blackQueenside = false;
            }
          } // Rook move disables specific wing castling right


          if (symbol === 'R') {
            if (color === 'w') {
              if (move.from.x === 7 && move.from.y === 0) this.castlingRights.whiteKingside = false;
              if (move.from.x === 0 && move.from.y === 0) this.castlingRights.whiteQueenside = false;
            } else {
              if (move.from.x === 7 && move.from.y === 7) this.castlingRights.blackKingside = false;
              if (move.from.x === 0 && move.from.y === 7) this.castlingRights.blackQueenside = false;
            }
          } // Capture of a Rook disables that specific wing castling right for the opponent


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


        saveSnapshot(executedMove) {
          this.historyStack.push({
            board: this.board.clone(),
            activeTurn: this.activeTurn,
            castlingRights: { ...this.castlingRights
            },
            enPassantTarget: this.enPassantTarget ? { ...this.enPassantTarget
            } : null,
            halfmoveClock: this.halfmoveClock,
            fullmoveNumber: this.fullmoveNumber,
            gameStatus: this.gameStatus,
            winner: this.winner,
            executedMove: (_crd && MoveUtils === void 0 ? (_reportPossibleCrUseOfMoveUtils({
              error: Error()
            }), MoveUtils) : MoveUtils).clone(executedMove)
          });
        }
        /** Returns default castling rights container */


        getDefaultCastlingRights() {
          return {
            whiteKingside: true,
            whiteQueenside: true,
            blackKingside: true,
            blackQueenside: true
          };
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=b63811ea2157e0f2c56a3747a11a43c46a2611f2.js.map