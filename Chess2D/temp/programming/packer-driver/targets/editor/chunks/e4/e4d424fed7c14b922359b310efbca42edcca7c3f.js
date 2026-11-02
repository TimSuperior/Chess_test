System.register(["__unresolved_0", "cc"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, MoveUtils, _crd;

  function _reportPossibleCrUseOfIVector(extras) {
    _reporterNs.report("IVector", "./IVector", _context.meta, extras);
  }

  function _reportPossibleCrUseOfIPieceState(extras) {
    _reporterNs.report("IPieceState", "./IPieceState", _context.meta, extras);
  }

  _export("MoveUtils", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "b64a5Z5uc5JDZseSE14Avpv", "IMove", undefined);
      /**
       * Categorizes the type of move for standard chess rule execution and custom variant triggers.
       */

      /**
       * Represents a complete move payload and historical record within the chess engine.
       * Contains execution coordinates, participating piece states, move type flags, and undo data.
       */


      /**
       * High-performance factory and notation utilities for move instances.
       */
      _export("MoveUtils", MoveUtils = class MoveUtils {
        /**
         * Creates a standardized immutable move object.
         */
        static create(from, to, piece, moveType = 'normal', capturedPiece = null, promotedToSymbol, customData) {
          return {
            from,
            to,
            piece,
            capturedPiece,
            moveType,
            promotedToSymbol,
            customData: customData ? Object.freeze({ ...customData
            }) : undefined
          };
        }
        /**
         * Creates a clone of a move instance. Useful for undo stacks and board simulation checks.
         */


        static clone(move) {
          return {
            from: {
              x: move.from.x,
              y: move.from.y
            },
            to: {
              x: move.to.x,
              y: move.to.y
            },
            piece: move.piece,
            capturedPiece: move.capturedPiece,
            moveType: move.moveType,
            promotedToSymbol: move.promotedToSymbol,
            customData: move.customData ? { ...move.customData
            } : undefined
          };
        }
        /**
         * Checks if two moves share the exact same origin and destination squares.
         */


        static equals(a, b) {
          return a.from.x === b.from.x && a.from.y === b.from.y && a.to.x === b.to.x && a.to.y === b.to.y;
        }
        /**
         * Converts a 0-indexed grid coordinate to standard algebraic notation (e.g., x=4, y=3 -> "e4").
         */


        static toSquareName(pos) {
          const file = String.fromCharCode(97 + pos.x); // 0 -> 'a', 1 -> 'b', etc.

          const rank = (pos.y + 1).toString(); // 0 -> '1', 1 -> '2', etc.

          return `${file}${rank}`;
        }
        /**
         * Formats a move into simple coordinate notation (e.g., "e2e4" or "e7e8q").
         */


        static toSimpleNotation(move) {
          const fromStr = MoveUtils.toSquareName(move.from);
          const toStr = MoveUtils.toSquareName(move.to);
          const promoStr = move.promotedToSymbol ? move.promotedToSymbol.toLowerCase() : '';
          return `${fromStr}${toStr}${promoStr}`;
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=e4d424fed7c14b922359b310efbca42edcca7c3f.js.map