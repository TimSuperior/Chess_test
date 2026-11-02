System.register(["__unresolved_0", "cc"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Button, Sprite, SpriteFrame, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _crd, ccclass, property, PromotionDialog;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfPieceColor(extras) {
    _reporterNs.report("PieceColor", "db://assets/src/interfaces/IPieceState", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Node = _cc.Node;
      Button = _cc.Button;
      Sprite = _cc.Sprite;
      SpriteFrame = _cc.SpriteFrame;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "cab22VgE4lJE54Vyym3PoT2", "PromotionDialog", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Button', 'Sprite', 'SpriteFrame']);

      ({
        ccclass,
        property
      } = _decorator);

      /**
       * Cocos Creator UI Modal for handling pawn promotion choices.
       * Dynamically switches button sprite textures based on the active player's color.
       */
      _export("PromotionDialog", PromotionDialog = (_dec = ccclass('PromotionDialog'), _dec2 = property({
        type: Node,
        doc: 'Queen Selection Button Node'
      }), _dec3 = property({
        type: Node,
        doc: 'Rook Selection Button Node'
      }), _dec4 = property({
        type: Node,
        doc: 'Bishop Selection Button Node'
      }), _dec5 = property({
        type: Node,
        doc: 'Knight Selection Button Node'
      }), _dec6 = property({
        type: SpriteFrame,
        doc: 'White Queen Icon'
      }), _dec7 = property({
        type: SpriteFrame,
        doc: 'White Rook Icon'
      }), _dec8 = property({
        type: SpriteFrame,
        doc: 'White Bishop Icon'
      }), _dec9 = property({
        type: SpriteFrame,
        doc: 'White Knight Icon'
      }), _dec10 = property({
        type: SpriteFrame,
        doc: 'Black Queen Icon'
      }), _dec11 = property({
        type: SpriteFrame,
        doc: 'Black Rook Icon'
      }), _dec12 = property({
        type: SpriteFrame,
        doc: 'Black Bishop Icon'
      }), _dec13 = property({
        type: SpriteFrame,
        doc: 'Black Knight Icon'
      }), _dec(_class = (_class2 = class PromotionDialog extends Component {
        constructor(...args) {
          super(...args);

          // Button Node References
          _initializerDefineProperty(this, "btnQueen", _descriptor, this);

          _initializerDefineProperty(this, "btnRook", _descriptor2, this);

          _initializerDefineProperty(this, "btnBishop", _descriptor3, this);

          _initializerDefineProperty(this, "btnKnight", _descriptor4, this);

          // White Piece Sprite Frames
          _initializerDefineProperty(this, "wQueen", _descriptor5, this);

          _initializerDefineProperty(this, "wRook", _descriptor6, this);

          _initializerDefineProperty(this, "wBishop", _descriptor7, this);

          _initializerDefineProperty(this, "wKnight", _descriptor8, this);

          // Black Piece Sprite Frames
          _initializerDefineProperty(this, "bQueen", _descriptor9, this);

          _initializerDefineProperty(this, "bRook", _descriptor10, this);

          _initializerDefineProperty(this, "bBishop", _descriptor11, this);

          _initializerDefineProperty(this, "bKnight", _descriptor12, this);

          this.resolveCallback = null;
        }

        onLoad() {
          var _this$btnQueen, _this$btnRook, _this$btnBishop, _this$btnKnight;

          // Register click listeners for each button
          (_this$btnQueen = this.btnQueen) == null || _this$btnQueen.on(Button.EventType.CLICK, () => this.select('Q'), this);
          (_this$btnRook = this.btnRook) == null || _this$btnRook.on(Button.EventType.CLICK, () => this.select('R'), this);
          (_this$btnBishop = this.btnBishop) == null || _this$btnBishop.on(Button.EventType.CLICK, () => this.select('B'), this);
          (_this$btnKnight = this.btnKnight) == null || _this$btnKnight.on(Button.EventType.CLICK, () => this.select('N'), this); // Hide dialog on initialization

          this.node.active = false;
        }
        /**
         * Displays the promotion modal, updates icons to match player color,
         * and returns a Promise resolving to the selected promotion piece symbol.
         * 
         * @param color Color of the promoting player ('w' or 'b')
         */


        show(color = 'w') {
          this.updateIcons(color);
          this.node.active = true;
          return new Promise(resolve => {
            this.resolveCallback = resolve;
          });
        }
        /**
         * Dynamically swaps sprite frames on button nodes to match White or Black icons.
         */


        updateIcons(color) {
          const isWhite = color === 'w';
          this.setButtonSprite(this.btnQueen, isWhite ? this.wQueen : this.bQueen);
          this.setButtonSprite(this.btnRook, isWhite ? this.wRook : this.bRook);
          this.setButtonSprite(this.btnBishop, isWhite ? this.wBishop : this.bBishop);
          this.setButtonSprite(this.btnKnight, isWhite ? this.wKnight : this.bKnight);
        }
        /**
         * Applies a SpriteFrame to the Sprite component on a given button node.
         */


        setButtonSprite(btnNode, frame) {
          if (!btnNode || !frame) return;
          const sprite = btnNode.getComponent(Sprite);

          if (sprite) {
            sprite.spriteFrame = frame;
          }
        }
        /**
         * Resolves the active Promise with the player's choice and hides the modal.
         */


        select(choice) {
          this.node.active = false;

          if (this.resolveCallback) {
            this.resolveCallback(choice);
            this.resolveCallback = null;
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "btnQueen", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "btnRook", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "btnBishop", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "btnKnight", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "wQueen", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "wRook", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "wBishop", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "wKnight", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "bQueen", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "bRook", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "bBishop", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "bKnight", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=f68c7001f42293e3ec95988f3ab46dbe4a5b4901.js.map