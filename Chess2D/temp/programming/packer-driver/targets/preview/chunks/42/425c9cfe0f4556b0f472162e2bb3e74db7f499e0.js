System.register(["__unresolved_0", "cc"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, PieceDefinition, _crd;

  function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

  function _reportPossibleCrUseOfIVector(extras) {
    _reporterNs.report("IVector", "db://assets/src/interfaces/IVector", _context.meta, extras);
  }

  function _reportPossibleCrUseOfIPieceDefinition(extras) {
    _reporterNs.report("IPieceDefinition", "db://assets/src/interfaces/IPieceDefinition", _context.meta, extras);
  }

  _export("PieceDefinition", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "490bdlCGbVOkJe0Jypw0WMV", "PieceDefinition", undefined);
      /**
       * Configuration options payload for instantiating a PieceDefinition.
       */


      /**
       * Concrete implementation of IPieceDefinition.
       * Represents immutable piece movement rules, vectors, and metadata.
       */
      _export("PieceDefinition", PieceDefinition = class PieceDefinition {
        constructor(config) {
          var _config$value, _config$canJump;

          this.type = void 0;
          this.symbol = void 0;
          this.directions = void 0;
          this.isSlider = void 0;
          this.maxSteps = void 0;
          this.value = void 0;
          this.canJump = void 0;
          this.customData = void 0;
          this.type = config.type;
          this.symbol = config.symbol.toUpperCase();
          this.directions = Object.freeze([...config.directions]);
          this.isSlider = config.isSlider;
          this.maxSteps = config.maxSteps;
          this.value = (_config$value = config.value) != null ? _config$value : 0;
          this.canJump = (_config$canJump = config.canJump) != null ? _config$canJump : false;
          this.customData = config.customData ? Object.freeze(_extends({}, config.customData)) : undefined;
        } // =========================================================================
        // STANDARD CHESS PRESETS (Factory Methods)
        // =========================================================================

        /** Creates a standard Pawn definition */


        static createPawn() {
          return new PieceDefinition({
            type: 'pawn',
            symbol: 'P',
            // Forward steps + diagonal attack vectors (resolved by MoveCalculator / engine rules)
            directions: [{
              x: 0,
              y: 1
            }, // White forward / Black forward direction
            {
              x: 1,
              y: 1
            }, // Right capture vector
            {
              x: -1,
              y: 1
            } // Left capture vector
            ],
            isSlider: false,
            maxSteps: 1,
            value: 1,
            canJump: false
          });
        }
        /** Creates a standard Knight definition */


        static createKnight() {
          return new PieceDefinition({
            type: 'knight',
            symbol: 'N',
            directions: [{
              x: 1,
              y: 2
            }, {
              x: 2,
              y: 1
            }, {
              x: -1,
              y: 2
            }, {
              x: -2,
              y: 1
            }, {
              x: 1,
              y: -2
            }, {
              x: 2,
              y: -1
            }, {
              x: -1,
              y: -2
            }, {
              x: -2,
              y: -1
            }],
            isSlider: false,
            maxSteps: 1,
            value: 3,
            canJump: true
          });
        }
        /** Creates a standard Bishop definition */


        static createBishop() {
          return new PieceDefinition({
            type: 'bishop',
            symbol: 'B',
            directions: [{
              x: 1,
              y: 1
            }, {
              x: -1,
              y: 1
            }, {
              x: 1,
              y: -1
            }, {
              x: -1,
              y: -1
            }],
            isSlider: true,
            value: 3,
            canJump: false
          });
        }
        /** Creates a standard Rook definition */


        static createRook() {
          return new PieceDefinition({
            type: 'rook',
            symbol: 'R',
            directions: [{
              x: 1,
              y: 0
            }, {
              x: -1,
              y: 0
            }, {
              x: 0,
              y: 1
            }, {
              x: 0,
              y: -1
            }],
            isSlider: true,
            value: 5,
            canJump: false
          });
        }
        /** Creates a standard Queen definition */


        static createQueen() {
          return new PieceDefinition({
            type: 'queen',
            symbol: 'Q',
            directions: [{
              x: 1,
              y: 0
            }, {
              x: -1,
              y: 0
            }, {
              x: 0,
              y: 1
            }, {
              x: 0,
              y: -1
            }, {
              x: 1,
              y: 1
            }, {
              x: -1,
              y: 1
            }, {
              x: 1,
              y: -1
            }, {
              x: -1,
              y: -1
            }],
            isSlider: true,
            value: 9,
            canJump: false
          });
        }
        /** Creates a standard King definition */


        static createKing() {
          return new PieceDefinition({
            type: 'king',
            symbol: 'K',
            directions: [{
              x: 1,
              y: 0
            }, {
              x: -1,
              y: 0
            }, {
              x: 0,
              y: 1
            }, {
              x: 0,
              y: -1
            }, {
              x: 1,
              y: 1
            }, {
              x: -1,
              y: 1
            }, {
              x: 1,
              y: -1
            }, {
              x: -1,
              y: -1
            }],
            isSlider: false,
            maxSteps: 1,
            value: 1000,
            canJump: false
          });
        }
        /**
         * Helper to create custom variant pieces (e.g., Dragon, Archbishop, Assassin).
         */


        static createCustom(config) {
          return new PieceDefinition(config);
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=425c9cfe0f4556b0f472162e2bb3e74db7f499e0.js.map