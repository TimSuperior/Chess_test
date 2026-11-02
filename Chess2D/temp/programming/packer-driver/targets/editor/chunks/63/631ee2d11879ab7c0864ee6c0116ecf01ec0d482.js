System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, PieceDefinition, PieceRegistry, _crd;

  function _reportPossibleCrUseOfIPieceDefinition(extras) {
    _reporterNs.report("IPieceDefinition", "db://assets/src/interfaces/IPieceDefinition", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPieceDefinition(extras) {
    _reporterNs.report("PieceDefinition", "db://assets/src/pieces/PieceDefinition", _context.meta, extras);
  }

  _export("PieceRegistry", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
    }, function (_unresolved_2) {
      PieceDefinition = _unresolved_2.PieceDefinition;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "ecfca5YPSxJI7hZ4YNEdq1O", "PieceRegistry", undefined);

      /**
       * Central registry managing piece definitions for the chess engine.
       * Serves as a global dictionary mapping FEN symbols ('P', 'N', 'R', etc.) 
       * and type names ('pawn', 'knight', etc.) to their movement rules.
       */
      _export("PieceRegistry", PieceRegistry = class PieceRegistry {
        /**
         * Initializes the registry with standard chess pieces (Pawn, Knight, Bishop, Rook, Queen, King).
         * Automatically invoked on first lookup if not manually triggered.
         */
        static initialize() {
          if (this.isInitialized) return;
          this.register((_crd && PieceDefinition === void 0 ? (_reportPossibleCrUseOfPieceDefinition({
            error: Error()
          }), PieceDefinition) : PieceDefinition).createPawn());
          this.register((_crd && PieceDefinition === void 0 ? (_reportPossibleCrUseOfPieceDefinition({
            error: Error()
          }), PieceDefinition) : PieceDefinition).createKnight());
          this.register((_crd && PieceDefinition === void 0 ? (_reportPossibleCrUseOfPieceDefinition({
            error: Error()
          }), PieceDefinition) : PieceDefinition).createBishop());
          this.register((_crd && PieceDefinition === void 0 ? (_reportPossibleCrUseOfPieceDefinition({
            error: Error()
          }), PieceDefinition) : PieceDefinition).createRook());
          this.register((_crd && PieceDefinition === void 0 ? (_reportPossibleCrUseOfPieceDefinition({
            error: Error()
          }), PieceDefinition) : PieceDefinition).createQueen());
          this.register((_crd && PieceDefinition === void 0 ? (_reportPossibleCrUseOfPieceDefinition({
            error: Error()
          }), PieceDefinition) : PieceDefinition).createKing());
          this.isInitialized = true;
        }
        /**
         * Registers a piece definition in the engine.
         * Overwrites any existing registration with the same symbol or type.
         * @param definition The piece definition object to register
         */


        static register(definition) {
          const symbolKey = definition.symbol.toUpperCase();
          const typeKey = definition.type.toLowerCase();
          this.symbolMap.set(symbolKey, definition);
          this.typeMap.set(typeKey, definition);
        }
        /**
         * Retrieves a piece definition by its FEN shorthand symbol (e.g., 'R', 'n', 'k').
         * Case-insensitive: both 'N' and 'n' return the Knight definition.
         */


        static getBySymbol(symbol) {
          this.ensureInitialized();
          return this.symbolMap.get(symbol.toUpperCase());
        }
        /**
         * Retrieves a piece definition by its type name (e.g., 'rook', 'knight', 'custom_dragon').
         */


        static getByType(type) {
          this.ensureInitialized();
          return this.typeMap.get(type.toLowerCase());
        }
        /**
         * Checks if a symbol is currently registered.
         */


        static hasSymbol(symbol) {
          this.ensureInitialized();
          return this.symbolMap.has(symbol.toUpperCase());
        }
        /**
         * Checks if a piece type identifier is currently registered.
         */


        static hasType(type) {
          this.ensureInitialized();
          return this.typeMap.has(type.toLowerCase());
        }
        /**
         * Returns an array of all registered piece definitions.
         */


        static getAll() {
          this.ensureInitialized();
          return Array.from(this.symbolMap.values());
        }
        /**
         * Resets and clears all registered piece definitions.
         * Useful for unit tests or reconfiguring custom game variants.
         */


        static clear() {
          this.symbolMap.clear();
          this.typeMap.clear();
          this.isInitialized = false;
        }
        /**
         * Internal guard ensuring standard pieces are registered before any query.
         */


        static ensureInitialized() {
          if (!this.isInitialized) {
            this.initialize();
          }
        }

      });

      PieceRegistry.symbolMap = new Map();
      PieceRegistry.typeMap = new Map();
      PieceRegistry.isInitialized = false;

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=631ee2d11879ab7c0864ee6c0116ecf01ec0d482.js.map