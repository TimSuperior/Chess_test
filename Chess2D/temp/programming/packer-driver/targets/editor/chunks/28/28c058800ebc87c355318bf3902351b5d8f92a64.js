System.register(["__unresolved_0", "cc"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, PieceDefinitionUtils, _crd;

  function _reportPossibleCrUseOfIVector(extras) {
    _reporterNs.report("IVector", "./IVector", _context.meta, extras);
  }

  _export("PieceDefinitionUtils", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "73babQvafRKVZI5LW6pnoiJ", "IPieceDefinition", undefined);
      /**
       * Defines the movement rules, physical properties, and metadata for a chess piece type.
       * Supports standard pieces (Pawn, Knight, Bishop, Rook, Queen, King) and custom variants.
       */


      /**
       * High-performance helper utilities for inspecting and resolving piece definitions.
       */
      _export("PieceDefinitionUtils", PieceDefinitionUtils = class PieceDefinitionUtils {
        /**
         * Resolves the maximum step count for raycasting during move calculations.
         * @param def The piece definition
         * @param boardMaxDimension Optional max board dimension (defaults to 8 for standard chess)
         */
        static getMaxSteps(def, boardMaxDimension = 8) {
          if (def.maxSteps !== undefined && def.maxSteps > 0) {
            return def.maxSteps;
          }

          return def.isSlider ? boardMaxDimension : 1;
        }
        /**
         * Validates that a piece definition contains all required movement properties.
         */


        static isValid(def) {
          return typeof def.type === 'string' && def.type.length > 0 && typeof def.symbol === 'string' && def.symbol.length > 0 && Array.isArray(def.directions) && def.directions.length > 0 && typeof def.isSlider === 'boolean';
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=28c058800ebc87c355318bf3902351b5d8f92a64.js.map