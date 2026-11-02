System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, PieceStateUtils, MoveCalculator, SpecialRules, RuleValidator, _crd;

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

  function _reportPossibleCrUseOfBoard(extras) {
    _reporterNs.report("Board", "db://assets/src/board/Board", _context.meta, extras);
  }

  function _reportPossibleCrUseOfMoveCalculator(extras) {
    _reporterNs.report("MoveCalculator", "db://assets/src/rules/MoveCalculator", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSpecialRules(extras) {
    _reporterNs.report("SpecialRules", "db://assets/src/rules/SpecialRules", _context.meta, extras);
  }

  _export("RuleValidator", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
    }, function (_unresolved_2) {
      PieceStateUtils = _unresolved_2.PieceStateUtils;
    }, function (_unresolved_3) {
      MoveCalculator = _unresolved_3.MoveCalculator;
    }, function (_unresolved_4) {
      SpecialRules = _unresolved_4.SpecialRules;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "2ff796kTxBDHru+cD4nXLiC", "RuleValidator", undefined);

      /**
       * Validates moves against legal constraints (King safety / check rules),
       * and evaluates game end states (Checkmate, Stalemate, Insufficient Material).
       */
      _export("RuleValidator", RuleValidator = class RuleValidator {
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
        static getLegalMoves(board, fromX, fromY, activeTurn, enPassantTarget) {
          var piece = board.getPiece(fromX, fromY);

          if (!piece || piece.color !== activeTurn) {
            return [];
          }

          var fromPos = {
            x: fromX,
            y: fromY
          }; // 1. Get pseudo-legal moves (basic vector movement and captures)

          var pseudoMoves = (_crd && MoveCalculator === void 0 ? (_reportPossibleCrUseOfMoveCalculator({
            error: Error()
          }), MoveCalculator) : MoveCalculator).getPseudoLegalMoves(board, fromX, fromY, enPassantTarget); // 2. Append castling moves if piece is a King

          if (piece.definition.symbol === 'K') {
            var castlingMoves = (_crd && SpecialRules === void 0 ? (_reportPossibleCrUseOfSpecialRules({
              error: Error()
            }), SpecialRules) : SpecialRules).getCastlingMoves(board, fromPos, activeTurn);

            for (var i = 0; i < castlingMoves.length; i++) {
              pseudoMoves.push(castlingMoves[i]);
            }
          } // 3. Filter out moves that leave or place friendly King in check


          var legalMoves = [];

          for (var _i = 0; _i < pseudoMoves.length; _i++) {
            var move = pseudoMoves[_i];

            if (this.isMoveLegal(board, move, activeTurn)) {
              legalMoves.push(move);
            }
          }

          return legalMoves;
        }
        /**
         * Generates all strictly legal moves for all pieces belonging to a player color.
         */


        static getAllLegalMoves(board, color, enPassantTarget) {
          var legalMoves = [];
          var pieces = board.findAllPieces(color);

          for (var i = 0; i < pieces.length; i++) {
            var {
              pos
            } = pieces[i];
            var pieceMoves = this.getLegalMoves(board, pos.x, pos.y, color, enPassantTarget);

            for (var j = 0; j < pieceMoves.length; j++) {
              legalMoves.push(pieceMoves[j]);
            }
          }

          return legalMoves;
        }
        /**
         * Verifies if a single move is legal for the specified player color.
         */


        static isMoveLegal(board, move, color) {
          // Clone board state for non-destructive simulation
          var simulatedBoard = board.clone(); // Execute special/normal move mechanics on simulation board

          (_crd && SpecialRules === void 0 ? (_reportPossibleCrUseOfSpecialRules({
            error: Error()
          }), SpecialRules) : SpecialRules).executeSpecialMove(simulatedBoard, move); // Verify friendly King is not under attack after move

          return !this.isInCheck(simulatedBoard, color);
        } // =========================================================================
        // GAME STATE & THREAT EVALUATION
        // =========================================================================

        /**
         * Checks if the King of the specified player color is currently under attack (in check).
         */


        static isInCheck(board, color) {
          var kingPos = board.findKing(color); // If no King exists (e.g., custom variant without kings), King cannot be in check

          if (!kingPos) return false;
          var enemyColor = (_crd && PieceStateUtils === void 0 ? (_reportPossibleCrUseOfPieceStateUtils({
            error: Error()
          }), PieceStateUtils) : PieceStateUtils).getOppositeColor(color);
          return (_crd && MoveCalculator === void 0 ? (_reportPossibleCrUseOfMoveCalculator({
            error: Error()
          }), MoveCalculator) : MoveCalculator).isSquareAttacked(board, kingPos, enemyColor);
        }
        /**
         * Checks if player color is in Checkmate (In check with 0 legal moves remaining).
         */


        static isCheckmate(board, color, enPassantTarget) {
          if (!this.isInCheck(board, color)) {
            return false;
          }

          var legalMoves = this.getAllLegalMoves(board, color, enPassantTarget);
          return legalMoves.length === 0;
        }
        /**
         * Checks if player color is in Stalemate (Not in check, but 0 legal moves remaining).
         */


        static isStalemate(board, color, enPassantTarget) {
          if (this.isInCheck(board, color)) {
            return false;
          }

          var legalMoves = this.getAllLegalMoves(board, color, enPassantTarget);
          return legalMoves.length === 0;
        }
        /**
         * Checks for draw due to insufficient material according to standard rules:
         * - King vs King
         * - King & Knight vs King
         * - King & Bishop vs King
         * - King & Bishop vs King & Bishop (Bishops on same square color)
         */


        static isInsufficientMaterial(board) {
          var pieces = board.findAllPieces(); // Pawns, Rooks, and Queens provide sufficient winning material

          if (pieces.length > 4) return false;
          var pieceSymbols = pieces.map(p => p.piece.definition.symbol);

          if (pieceSymbols.some(s => s === 'P' || s === 'R' || s === 'Q')) {
            return false;
          } // King vs King


          if (pieces.length === 2) {
            return true;
          } // King & Minor Piece vs King


          if (pieces.length === 3) {
            var hasKnightOrBishop = pieceSymbols.some(s => s === 'N' || s === 'B');
            if (hasKnightOrBishop) return true;
          } // King & Bishop vs King & Bishop


          if (pieces.length === 4) {
            var whitePieces = pieces.filter(p => p.piece.color === 'w');
            var blackPieces = pieces.filter(p => p.piece.color === 'b');
            var whiteHasBishop = whitePieces.some(p => p.piece.definition.symbol === 'B');
            var blackHasBishop = blackPieces.some(p => p.piece.definition.symbol === 'B');

            if (whiteHasBishop && blackHasBishop) {
              var whiteBishopPos = whitePieces.find(p => p.piece.definition.symbol === 'B').pos;
              var blackBishopPos = blackPieces.find(p => p.piece.definition.symbol === 'B').pos;
              var whiteBishopSquareColor = (whiteBishopPos.x + whiteBishopPos.y) % 2;
              var blackBishopSquareColor = (blackBishopPos.x + blackBishopPos.y) % 2; // Draw if bishops are on same square colors

              if (whiteBishopSquareColor === blackBishopSquareColor) {
                return true;
              }
            }
          }

          return false;
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=b71a17bb916b7883aca79797c21696e98bb18466.js.map