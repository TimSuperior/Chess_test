System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, PieceStateUtils, PieceRegistry, FENParser, _crd;

  function _reportPossibleCrUseOfIVector(extras) {
    _reporterNs.report("IVector", "db://assets/src/interfaces/IVector", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPieceColor(extras) {
    _reporterNs.report("PieceColor", "db://assets/src/interfaces/IPieceState", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPieceStateUtils(extras) {
    _reporterNs.report("PieceStateUtils", "db://assets/src/interfaces/IPieceState", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBoard(extras) {
    _reporterNs.report("Board", "db://assets/src/board/Board", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPieceRegistry(extras) {
    _reporterNs.report("PieceRegistry", "db://assets/src/pieces/PieceRegistry", _context.meta, extras);
  }

  _export("FENParser", void 0);

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

      _cclegacy._RF.push({}, "c6d210lsKVAC7gWDq4RYnP6", "FENParser", undefined);

      /**
       * Castling availability flags parsed from or serialized to FEN notation.
       */

      /**
       * Complete game state extracted from a parsed Forsyth-Edwards Notation (FEN) string.
       */

      /**
       * Utility parser for reading and exporting Forsyth-Edwards Notation (FEN) strings.
       * Supports standard chess states and custom piece symbols registered in PieceRegistry.
       */
      _export("FENParser", FENParser = class FENParser {
        // =========================================================================
        // FEN PARSING (IMPORT)
        // =========================================================================

        /**
         * Parses a FEN string and populates the provided Board instance with piece states.
         * @param fen FEN string to parse
         * @param board Board container instance to populate
         * @returns Extracted match parameters (activeTurn, castlingRights, enPassantTarget, halfmoveClock, fullmoveNumber)
         */
        static parse(fen, board) {
          var _tokens$, _tokens$2, _tokens$3, _tokens$4, _tokens$5;

          board.clear();
          (_crd && PieceRegistry === void 0 ? (_reportPossibleCrUseOfPieceRegistry({
            error: Error()
          }), PieceRegistry) : PieceRegistry).initialize();
          const tokens = fen.trim().split(/\s+/);

          if (tokens.length < 1) {
            throw new Error('Invalid FEN: String is empty.');
          }

          const placementStr = tokens[0];
          const activeTurnStr = (_tokens$ = tokens[1]) != null ? _tokens$ : 'w';
          const castlingStr = (_tokens$2 = tokens[2]) != null ? _tokens$2 : '-';
          const enPassantStr = (_tokens$3 = tokens[3]) != null ? _tokens$3 : '-';
          const halfmoveStr = (_tokens$4 = tokens[4]) != null ? _tokens$4 : '0';
          const fullmoveStr = (_tokens$5 = tokens[5]) != null ? _tokens$5 : '1'; // 1. Parse Piece Placement Grid

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
                const color = isWhite ? 'w' : 'b';
                const def = (_crd && PieceRegistry === void 0 ? (_reportPossibleCrUseOfPieceRegistry({
                  error: Error()
                }), PieceRegistry) : PieceRegistry).getBySymbol(symbol);

                if (!def) {
                  throw new Error(`Invalid FEN: Unregistered piece symbol '${char}' at row ${r}, col ${x}.`);
                }

                const pieceState = (_crd && PieceStateUtils === void 0 ? (_reportPossibleCrUseOfPieceStateUtils({
                  error: Error()
                }), PieceStateUtils) : PieceStateUtils).create(def, color); // Mark piece as moved if it is not on its default starting rank

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
          } // 2. Parse Active Player Turn


          const activeTurn = activeTurnStr.toLowerCase() === 'b' ? 'b' : 'w'; // 3. Parse Castling Rights

          const castlingRights = {
            whiteKingside: castlingStr.includes('K'),
            whiteQueenside: castlingStr.includes('Q'),
            blackKingside: castlingStr.includes('k'),
            blackQueenside: castlingStr.includes('q')
          }; // 4. Parse En Passant Target Square

          const enPassantTarget = enPassantStr !== '-' ? this.squareToPos(enPassantStr) : null; // 5. Parse Clocks

          const halfmoveClock = parseInt(halfmoveStr, 10) || 0;
          const fullmoveNumber = parseInt(fullmoveStr, 10) || 1;
          return {
            activeTurn,
            castlingRights,
            enPassantTarget,
            halfmoveClock,
            fullmoveNumber
          };
        } // =========================================================================
        // FEN GENERATION (EXPORT)
        // =========================================================================

        /**
         * Serializes a Board instance and game state parameters into a standard FEN string.
         * @param board Active board grid container
         * @param state Match parameters (activeTurn, castlingRights, enPassantTarget, halfmoveClock, fullmoveNumber)
         */


        static generate(board, state) {
          const parts = []; // 1. Piece Placement String

          const rows = [];

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

          parts.push(rows.join('/')); // 2. Active Player Turn

          parts.push(state.activeTurn); // 3. Castling Availability Flags

          let castlingStr = '';
          if (state.castlingRights.whiteKingside) castlingStr += 'K';
          if (state.castlingRights.whiteQueenside) castlingStr += 'Q';
          if (state.castlingRights.blackKingside) castlingStr += 'k';
          if (state.castlingRights.blackQueenside) castlingStr += 'q';
          parts.push(castlingStr.length > 0 ? castlingStr : '-'); // 4. En Passant Target Square

          parts.push(state.enPassantTarget ? this.posToSquare(state.enPassantTarget) : '-'); // 5. Halfmove Clock & Fullmove Number

          parts.push(state.halfmoveClock.toString());
          parts.push(state.fullmoveNumber.toString());
          return parts.join(' ');
        } // =========================================================================
        // COORDINATE CONVERSIONS
        // =========================================================================

        /**
         * Converts algebraic square string (e.g., "e4") to a 0-indexed IVector coordinate ({ x: 4, y: 3 }).
         */


        static squareToPos(square) {
          if (!square || square.length < 2) return null;
          const fileChar = square[0].toLowerCase();
          const rankStr = square.substring(1);
          const x = fileChar.charCodeAt(0) - 97; // 'a' -> 0

          const y = parseInt(rankStr, 10) - 1; // "1" -> 0

          if (isNaN(x) || isNaN(y) || x < 0 || y < 0) {
            return null;
          }

          return {
            x,
            y
          };
        }
        /**
         * Converts 0-indexed coordinate vector ({ x: 4, y: 3 }) to algebraic square string ("e4").
         */


        static posToSquare(pos) {
          const file = String.fromCharCode(97 + pos.x);
          const rank = (pos.y + 1).toString();
          return `${file}${rank}`;
        }

      });

      /** Standard chess initial position FEN string */
      FENParser.DEFAULT_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=8935f0d13ad84eabc177ea6d3ce4aabf45427e52.js.map