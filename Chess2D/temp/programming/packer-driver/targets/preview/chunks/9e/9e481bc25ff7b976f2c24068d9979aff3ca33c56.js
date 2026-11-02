System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, VectorUtils, _crd;

  _export("VectorUtils", void 0);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "bd0beju4WdOu6KK7q1dWsYR", "IVector", undefined);
      /**
       * Represents a 2D relative direction vector or coordinate pair on the chessboard.
       * Used for move directions, piece vectors, and grid offsets.
       */


      /**
       * High-performance utility class for vector calculations.
       * Avoids unnecessary object allocations during move generation loops.
       */
      _export("VectorUtils", VectorUtils = class VectorUtils {
        /**
         * Creates an immutable vector interface instance.
         */
        static create(x, y) {
          return {
            x,
            y
          };
        }
        /**
         * Adds two vectors together (e.g., currentPosition + directionVector).
         */


        static add(a, b) {
          return {
            x: a.x + b.x,
            y: a.y + b.y
          };
        }
        /**
         * Subtracts vector B from vector A.
         */


        static subtract(a, b) {
          return {
            x: a.x - b.x,
            y: a.y - b.y
          };
        }
        /**
         * Scales a vector by a scalar step multiplier.
         */


        static scale(v, factor) {
          return {
            x: v.x * factor,
            y: v.y * factor
          };
        }
        /**
         * Checks if two vectors share the same coordinates.
         */


        static equals(a, b) {
          return a.x === b.x && a.y === b.y;
        }
        /**
         * Returns true if the vector represents zero displacement (0, 0).
         */


        static isZero(v) {
          return v.x === 0 && v.y === 0;
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=9e481bc25ff7b976f2c24068d9979aff3ca33c56.js.map