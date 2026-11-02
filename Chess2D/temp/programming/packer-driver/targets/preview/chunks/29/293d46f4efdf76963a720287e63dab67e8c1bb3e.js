System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, PieceStateUtils, MoveUtils, MoveCalculator, PieceRegistry, SpecialRules, _crd;

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

  function _reportPossibleCrUseOfMoveCalculator(extras) {
    _reporterNs.report("MoveCalculator", "db://assets/src/rules/MoveCalculator", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPieceRegistry(extras) {
    _reporterNs.report("PieceRegistry", "db://assets/src/pieces/PieceRegistry", _context.meta, extras);
  }

  _export("SpecialRules", void 0);

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
      MoveCalculator = _unresolved_4.MoveCalculator;
    }, function (_unresolved_5) {
      PieceRegistry = _unresolved_5.PieceRegistry;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "529efYPEaRGTbO5tpoEAsQD", "SpecialRules", undefined);

      /**
       * Handles special chess rule mechanics: Castling, En Passant, and Pawn Promotion.
       * Executes board state modifications for non-standard move payloads.
       */
      _export("SpecialRules", SpecialRules = class SpecialRules {
        // =========================================================================
        // CASTLING VALIDATION
        // =========================================================================

        /**
         * Calculates valid Kingside and Queenside castling moves for a King at kingPos.
         * Validates that neither King nor Rook has moved, path is clear, and King does not pass through check.
         */
        static getCastlingMoves(board, kingPos, color) {
          var moves = [];
          var king = board.getPieceAt(kingPos); // 1. Basic King validation

          if (!king || king.definition.symbol !== 'K' || king.color !== color || king.hasMoved) {
            return moves;
          }

          var enemyColor = (_crd && PieceStateUtils === void 0 ? (_reportPossibleCrUseOfPieceStateUtils({
            error: Error()
          }), PieceStateUtils) : PieceStateUtils).getOppositeColor(color); // 2. King cannot castle out of check

          if ((_crd && MoveCalculator === void 0 ? (_reportPossibleCrUseOfMoveCalculator({
            error: Error()
          }), MoveCalculator) : MoveCalculator).isSquareAttacked(board, kingPos, enemyColor)) {
            return moves;
          }

          var rank = kingPos.y; // ---------------------------------------------------------------------
          // KINGSIDE CASTLING (Short Castling)
          // ---------------------------------------------------------------------

          var kingsideRookPos = {
            x: board.width - 1,
            y: rank
          };
          var kingsideRook = board.getPieceAt(kingsideRookPos);

          if (kingsideRook && kingsideRook.definition.symbol === 'R' && !kingsideRook.hasMoved) {
            var passThroughSquare = {
              x: kingPos.x + 1,
              y: rank
            };
            var destinationSquare = {
              x: kingPos.x + 2,
              y: rank
            }; // Path must be clear of pieces

            var isPathClear = board.getPieceAt(passThroughSquare) === null && board.getPieceAt(destinationSquare) === null;

            if (isPathClear) {
              // King cannot pass through or land on an attacked square
              var isPathSafe = !(_crd && MoveCalculator === void 0 ? (_reportPossibleCrUseOfMoveCalculator({
                error: Error()
              }), MoveCalculator) : MoveCalculator).isSquareAttacked(board, passThroughSquare, enemyColor) && !(_crd && MoveCalculator === void 0 ? (_reportPossibleCrUseOfMoveCalculator({
                error: Error()
              }), MoveCalculator) : MoveCalculator).isSquareAttacked(board, destinationSquare, enemyColor);

              if (isPathSafe) {
                moves.push((_crd && MoveUtils === void 0 ? (_reportPossibleCrUseOfMoveUtils({
                  error: Error()
                }), MoveUtils) : MoveUtils).create(kingPos, destinationSquare, king, 'castling_kingside'));
              }
            }
          } // ---------------------------------------------------------------------
          // QUEENSIDE CASTLING (Long Castling)
          // ---------------------------------------------------------------------


          var queensideRookPos = {
            x: 0,
            y: rank
          };
          var queensideRook = board.getPieceAt(queensideRookPos);

          if (queensideRook && queensideRook.definition.symbol === 'R' && !queensideRook.hasMoved) {
            var knightSquare = {
              x: kingPos.x - 1,
              y: rank
            };
            var _destinationSquare = {
              x: kingPos.x - 2,
              y: rank
            };
            var bFileSquare = {
              x: kingPos.x - 3,
              y: rank
            }; // Square adjacent to Rook
            // Path between King and Rook must be empty

            var _isPathClear = board.getPieceAt(knightSquare) === null && board.getPieceAt(_destinationSquare) === null && (board.isValidPos(bFileSquare) ? board.getPieceAt(bFileSquare) === null : true);

            if (_isPathClear) {
              // King cannot pass through or land on an attacked square
              var _isPathSafe = !(_crd && MoveCalculator === void 0 ? (_reportPossibleCrUseOfMoveCalculator({
                error: Error()
              }), MoveCalculator) : MoveCalculator).isSquareAttacked(board, knightSquare, enemyColor) && !(_crd && MoveCalculator === void 0 ? (_reportPossibleCrUseOfMoveCalculator({
                error: Error()
              }), MoveCalculator) : MoveCalculator).isSquareAttacked(board, _destinationSquare, enemyColor);

              if (_isPathSafe) {
                moves.push((_crd && MoveUtils === void 0 ? (_reportPossibleCrUseOfMoveUtils({
                  error: Error()
                }), MoveUtils) : MoveUtils).create(kingPos, _destinationSquare, king, 'castling_queenside'));
              }
            }
          }

          return moves;
        } // =========================================================================
        // EN PASSANT HELPERS
        // =========================================================================

        /**
         * Determines if a completed move created an active En Passant target square.
         * @returns The skipped square vector if a double-step pawn move occurred, otherwise null.
         */


        static getEnPassantTarget(lastMove) {
          if (!lastMove || lastMove.moveType !== 'double_step') {
            return null;
          }

          return {
            x: lastMove.from.x,
            y: (lastMove.from.y + lastMove.to.y) / 2
          };
        } // =========================================================================
        // SPECIAL MOVE EXECUTION
        // =========================================================================

        /**
         * Executes special move mechanics directly on the board instance.
         * Moves secondary pieces (e.g., Castling Rooks) and removes off-square captures (En Passant).
         */


        static executeSpecialMove(board, move) {
          var rank = move.from.y;

          switch (move.moveType) {
            case 'castling_kingside':
              {
                // Move King to (x=6)
                board.movePiece(move.from.x, move.from.y, move.to.x, move.to.y);
                move.piece.hasMoved = true;
                move.piece.moveCount++; // Move Rook from h-file (x=7) to f-file (x=5)

                var rookFromX = board.width - 1;
                var rookToX = move.to.x - 1;
                var rook = board.getPiece(rookFromX, rank);

                if (rook) {
                  board.movePiece(rookFromX, rank, rookToX, rank);
                  rook.hasMoved = true;
                  rook.moveCount++;
                }

                break;
              }

            case 'castling_queenside':
              {
                // Move King to (x=2)
                board.movePiece(move.from.x, move.from.y, move.to.x, move.to.y);
                move.piece.hasMoved = true;
                move.piece.moveCount++; // Move Rook from a-file (x=0) to d-file (x=3)

                var _rookFromX = 0;

                var _rookToX = move.to.x + 1;

                var _rook = board.getPiece(_rookFromX, rank);

                if (_rook) {
                  board.movePiece(_rookFromX, rank, _rookToX, rank);
                  _rook.hasMoved = true;
                  _rook.moveCount++;
                }

                break;
              }

            case 'en_passant':
              {
                // Move attacking pawn to empty target square
                board.movePiece(move.from.x, move.from.y, move.to.x, move.to.y);
                move.piece.hasMoved = true;
                move.piece.moveCount++; // Remove captured pawn sitting adjacent on the starting rank

                var capturedPawnSquare = {
                  x: move.to.x,
                  y: move.from.y
                };
                board.removePieceAt(capturedPawnSquare);
                break;
              }

            case 'promotion':
              {
                // Move pawn to promotion rank
                board.movePiece(move.from.x, move.from.y, move.to.x, move.to.y); // Promote pawn to target piece definition (Defaults to Queen 'Q')

                var promoSymbol = move.promotedToSymbol || 'Q';
                var promoDef = (_crd && PieceRegistry === void 0 ? (_reportPossibleCrUseOfPieceRegistry({
                  error: Error()
                }), PieceRegistry) : PieceRegistry).getBySymbol(promoSymbol) || (_crd && PieceRegistry === void 0 ? (_reportPossibleCrUseOfPieceRegistry({
                  error: Error()
                }), PieceRegistry) : PieceRegistry).getBySymbol('Q');
                var promotedPiece = (_crd && PieceStateUtils === void 0 ? (_reportPossibleCrUseOfPieceStateUtils({
                  error: Error()
                }), PieceStateUtils) : PieceStateUtils).create(promoDef, move.piece.color, move.piece.id);
                promotedPiece.hasMoved = true;
                promotedPiece.moveCount = move.piece.moveCount + 1;
                board.setPieceAt(move.to, promotedPiece);
                break;
              }

            case 'normal':
            case 'double_step':
            default:
              {
                board.movePiece(move.from.x, move.from.y, move.to.x, move.to.y);
                move.piece.hasMoved = true;
                move.piece.moveCount++;
                break;
              }
          }
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=293d46f4efdf76963a720287e63dab67e8c1bb3e.js.map