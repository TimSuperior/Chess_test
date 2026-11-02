System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, PieceStateUtils, PieceRegistry, Board, _crd;

  function _reportPossibleCrUseOfIVector(extras) {
    _reporterNs.report("IVector", "db://assets/src/interfaces/IVector", _context.meta, extras);
  }

  function _reportPossibleCrUseOfIPieceState(extras) {
    _reporterNs.report("IPieceState", "db://assets/src/interfaces/IPieceState", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPieceColor(extras) {
    _reporterNs.report("PieceColor", "db://assets/src/interfaces/IPieceState", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPieceStateUtils(extras) {
    _reporterNs.report("PieceStateUtils", "db://assets/src/interfaces/IPieceState", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPieceRegistry(extras) {
    _reporterNs.report("PieceRegistry", "db://assets/src/pieces/PieceRegistry", _context.meta, extras);
  }

  _export("Board", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
    }, function (_unresolved_2) {
      PieceStateUtils = _unresolved_2.PieceStateUtils;
    }, function (_unresolved_3) {
      PieceRegistry = _unresolved_3.PieceRegistry;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "4ae1cdj69dPWoSWHhUqo+k6", "Board", undefined);

      /**
       * Spatial grid container representing the chessboard state.
       * Uses a flat 1D array internally for O(1) lookups, cache locality, and maximum memory performance.
       */
      _export("Board", Board = class Board {
        /**
         * Instantiates a new board grid.
         * @param width Grid width (defaults to 8 for standard chess)
         * @param height Grid height (defaults to 8 for standard chess)
         */
        constructor(width, height) {
          if (width === void 0) {
            width = 8;
          }

          if (height === void 0) {
            height = 8;
          }

          this.width = void 0;
          this.height = void 0;
          this.grid = void 0;
          this.width = width;
          this.height = height;
          this.grid = new Array(width * height).fill(null);
        } // =========================================================================
        // SPATIAL CONVERSIONS & BOUNDS CHECKING
        // =========================================================================

        /** Converts 2D grid coordinates (x, y) to flat 1D array index */


        toIndex(x, y) {
          return y * this.width + x;
        }
        /** Converts a flat 1D array index back to a 2D coordinate vector */


        toCoords(index) {
          return {
            x: index % this.width,
            y: Math.floor(index / this.width)
          };
        }
        /** Checks if x, y coordinates fall within valid board boundaries */


        isValidSquare(x, y) {
          return x >= 0 && x < this.width && y >= 0 && y < this.height;
        }
        /** Checks if a vector coordinate falls within valid board boundaries */


        isValidPos(pos) {
          return this.isValidSquare(pos.x, pos.y);
        } // =========================================================================
        // PIECE ACCESS & MANIPULATION
        // =========================================================================

        /** Returns piece state at (x, y) or null if empty / out of bounds */


        getPiece(x, y) {
          if (!this.isValidSquare(x, y)) return null;
          return this.grid[this.toIndex(x, y)];
        }
        /** Returns piece state at vector coordinate or null if empty / out of bounds */


        getPieceAt(pos) {
          return this.getPiece(pos.x, pos.y);
        }
        /** Sets or clears a piece state at (x, y) */


        setPiece(x, y, piece) {
          if (this.isValidSquare(x, y)) {
            this.grid[this.toIndex(x, y)] = piece;
          }
        }
        /** Sets or clears a piece state at vector coordinate */


        setPieceAt(pos, piece) {
          this.setPiece(pos.x, pos.y, piece);
        }
        /** Removes and returns piece at (x, y) */


        removePiece(x, y) {
          var existing = this.getPiece(x, y);
          this.setPiece(x, y, null);
          return existing;
        }
        /** Removes and returns piece at vector coordinate */


        removePieceAt(pos) {
          return this.removePiece(pos.x, pos.y);
        }
        /**
         * Moves a piece directly from one coordinate to another on the grid.
         * @returns The captured piece state if a piece was captured, or null.
         */


        movePiece(fromX, fromY, toX, toY) {
          var piece = this.getPiece(fromX, fromY);
          if (!piece) return null;
          var captured = this.getPiece(toX, toY);
          this.setPiece(toX, toY, piece);
          this.setPiece(fromX, fromY, null);
          return captured;
        }
        /** Clears all squares on the board */


        clear() {
          this.grid.fill(null);
        } // =========================================================================
        // SEARCH & UTILITY METHODS
        // =========================================================================

        /**
         * Creates a deep clone of the board and all contained piece states.
         * Crucial for move simulation, check validation, and AI search trees.
         */


        clone() {
          var newBoard = new Board(this.width, this.height);

          for (var i = 0; i < this.grid.length; i++) {
            var piece = this.grid[i];

            if (piece) {
              newBoard.grid[i] = (_crd && PieceStateUtils === void 0 ? (_reportPossibleCrUseOfPieceStateUtils({
                error: Error()
              }), PieceStateUtils) : PieceStateUtils).clone(piece);
            }
          }

          return newBoard;
        }
        /** Finds and returns all pieces matching an optional color filter */


        findAllPieces(color) {
          var results = [];

          for (var i = 0; i < this.grid.length; i++) {
            var piece = this.grid[i];

            if (piece && (color === undefined || piece.color === color)) {
              results.push({
                pos: this.toCoords(i),
                piece
              });
            }
          }

          return results;
        }
        /**
         * Finds the coordinate of the King for a given player color.
         */


        findKing(color) {
          for (var i = 0; i < this.grid.length; i++) {
            var piece = this.grid[i];

            if (piece && piece.color === color && piece.definition.symbol === 'K') {
              return this.toCoords(i);
            }
          }

          return null;
        } // =========================================================================
        // INITIALIZATION & PRESETS
        // =========================================================================

        /**
         * Populates the board with standard 8x8 initial chess positions.
         */


        setupStandardBoard() {
          this.clear();
          (_crd && PieceRegistry === void 0 ? (_reportPossibleCrUseOfPieceRegistry({
            error: Error()
          }), PieceRegistry) : PieceRegistry).initialize();
          var pawnDef = (_crd && PieceRegistry === void 0 ? (_reportPossibleCrUseOfPieceRegistry({
            error: Error()
          }), PieceRegistry) : PieceRegistry).getBySymbol('P');
          var rookDef = (_crd && PieceRegistry === void 0 ? (_reportPossibleCrUseOfPieceRegistry({
            error: Error()
          }), PieceRegistry) : PieceRegistry).getBySymbol('R');
          var knightDef = (_crd && PieceRegistry === void 0 ? (_reportPossibleCrUseOfPieceRegistry({
            error: Error()
          }), PieceRegistry) : PieceRegistry).getBySymbol('N');
          var bishopDef = (_crd && PieceRegistry === void 0 ? (_reportPossibleCrUseOfPieceRegistry({
            error: Error()
          }), PieceRegistry) : PieceRegistry).getBySymbol('B');
          var queenDef = (_crd && PieceRegistry === void 0 ? (_reportPossibleCrUseOfPieceRegistry({
            error: Error()
          }), PieceRegistry) : PieceRegistry).getBySymbol('Q');
          var kingDef = (_crd && PieceRegistry === void 0 ? (_reportPossibleCrUseOfPieceRegistry({
            error: Error()
          }), PieceRegistry) : PieceRegistry).getBySymbol('K');
          var backRankOrder = [rookDef, knightDef, bishopDef, queenDef, kingDef, bishopDef, knightDef, rookDef]; // 1. Setup White Pieces (Rank 1 & 2 / y = 0 & y = 1)

          for (var x = 0; x < 8; x++) {
            this.setPiece(x, 0, (_crd && PieceStateUtils === void 0 ? (_reportPossibleCrUseOfPieceStateUtils({
              error: Error()
            }), PieceStateUtils) : PieceStateUtils).create(backRankOrder[x], 'w'));
            this.setPiece(x, 1, (_crd && PieceStateUtils === void 0 ? (_reportPossibleCrUseOfPieceStateUtils({
              error: Error()
            }), PieceStateUtils) : PieceStateUtils).create(pawnDef, 'w'));
          } // 2. Setup Black Pieces (Rank 7 & 8 / y = 6 & y = 7)


          for (var _x = 0; _x < 8; _x++) {
            this.setPiece(_x, 6, (_crd && PieceStateUtils === void 0 ? (_reportPossibleCrUseOfPieceStateUtils({
              error: Error()
            }), PieceStateUtils) : PieceStateUtils).create(pawnDef, 'b'));
            this.setPiece(_x, 7, (_crd && PieceStateUtils === void 0 ? (_reportPossibleCrUseOfPieceStateUtils({
              error: Error()
            }), PieceStateUtils) : PieceStateUtils).create(backRankOrder[_x], 'b'));
          }
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=ba9ef3f47a5bee11ac0a5ac5b2bf4bf969272ff6.js.map