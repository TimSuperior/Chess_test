System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, UITransform, Vec3, Color, Graphics, Sprite, SpriteFrame, Label, tween, ChessEngine, PromotionDialog, _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _crd, ccclass, property, BoardController;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfChessEngine(extras) {
    _reporterNs.report("ChessEngine", "db://assets/src/core/ChessEngine", _context.meta, extras);
  }

  function _reportPossibleCrUseOfIVector(extras) {
    _reporterNs.report("IVector", "db://assets/src/interfaces/IVector", _context.meta, extras);
  }

  function _reportPossibleCrUseOfIMove(extras) {
    _reporterNs.report("IMove", "db://assets/src/interfaces/IMove", _context.meta, extras);
  }

  function _reportPossibleCrUseOfIPieceState(extras) {
    _reporterNs.report("IPieceState", "db://assets/src/interfaces/IPieceState", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPromotionDialog(extras) {
    _reporterNs.report("PromotionDialog", "db://assets/src/ui/PromotionDialog", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPromotionChoice(extras) {
    _reporterNs.report("PromotionChoice", "db://assets/src/ui/PromotionDialog", _context.meta, extras);
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
      UITransform = _cc.UITransform;
      Vec3 = _cc.Vec3;
      Color = _cc.Color;
      Graphics = _cc.Graphics;
      Sprite = _cc.Sprite;
      SpriteFrame = _cc.SpriteFrame;
      Label = _cc.Label;
      tween = _cc.tween;
    }, function (_unresolved_2) {
      ChessEngine = _unresolved_2.ChessEngine;
    }, function (_unresolved_3) {
      PromotionDialog = _unresolved_3.PromotionDialog;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "b361e5U3IFDh4vjZtvDnQQ5", "BoardController", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'UITransform', 'EventTouch', 'Vec3', 'Vec2', 'Color', 'Graphics', 'Sprite', 'SpriteFrame', 'Label', 'tween']);

      ({
        ccclass,
        property
      } = _decorator);
      /**
       * Cocos Creator 2D UI Controller for Chess.
       * Connects ChessEngine state updates to visual Cocos Creator Nodes and handles player touch input.
       */

      _export("BoardController", BoardController = (_dec = ccclass('BoardController'), _dec2 = property({
        type: Node,
        doc: 'Reference to the 640x640 Board node inside Canvas'
      }), _dec3 = property({
        type: _crd && PromotionDialog === void 0 ? (_reportPossibleCrUseOfPromotionDialog({
          error: Error()
        }), PromotionDialog) : PromotionDialog,
        doc: 'Reference to the Promotion Dialog Modal'
      }), _dec4 = property({
        type: [SpriteFrame],
        doc: 'Optional array of 12 piece sprites (Order: wP, wN, wB, wR, wQ, wK, bP, bN, bB, bR, bQ, bK)'
      }), _dec(_class = (_class2 = class BoardController extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "boardNode", _descriptor, this);

          _initializerDefineProperty(this, "promotionDialog", _descriptor2, this);

          _initializerDefineProperty(this, "pieceSprites", _descriptor3, this);

          // Core engine instance
          this.engine = void 0;
          // Interaction State
          this.selectedPos = null;
          this.activeLegalMoves = [];
          // Visual Node Mapping
          this.pieceNodesMap = new Map();
          this.highlightNode = null;
          this.graphicsLayer = void 0;
        }

        // =========================================================================
        // COCOS LIFECYCLE
        // =========================================================================
        onLoad() {
          if (!this.boardNode) {
            this.boardNode = this.node;
          } // 1. Initialize Chess Engine


          this.engine = new (_crd && ChessEngine === void 0 ? (_reportPossibleCrUseOfChessEngine({
            error: Error()
          }), ChessEngine) : ChessEngine)(8, 8); // 2. Setup Graphics Layer for Highlights and Grid Overlay

          this.setupGraphicsLayer(); // 3. Register Touch Listener on Board Node

          this.boardNode.on(Node.EventType.TOUCH_END, this.onBoardTouch, this); // 4. Draw Initial Board UI

          this.refreshBoardUI();
        }

        onDestroy() {
          if (this.boardNode) {
            this.boardNode.off(Node.EventType.TOUCH_END, this.onBoardTouch, this);
          }
        } // =========================================================================
        // USER INPUT HANDLING
        // =========================================================================

        /**
         * Touch handler mapped to board click/tap coordinates.
         */


        async onBoardTouch(event) {
          if (this.engine.gameStatus !== 'active') {
            console.log(`Game is over (${this.engine.gameStatus}). Restart to play again.`);
            return;
          }

          const touchPos = event.getUILocation();
          const gridPos = this.touchToGridPos(touchPos);
          if (!gridPos) return; // ---------------------------------------------------------------------
          // Case A: A piece is already selected -> Try to execute move
          // ---------------------------------------------------------------------

          if (this.selectedPos) {
            const targetMove = this.activeLegalMoves.find(m => m.to.x === gridPos.x && m.to.y === gridPos.y);

            if (targetMove) {
              let promoChoice = undefined; // Intercept promotion moves and prompt the player

              if (targetMove.moveType === 'promotion') {
                if (this.promotionDialog) {
                  promoChoice = await this.promotionDialog.show(targetMove.piece.color);
                } else {
                  promoChoice = 'Q'; // Fallback default
                }
              } // Execute move in engine


              const success = this.engine.makeMove(this.selectedPos.x, this.selectedPos.y, gridPos.x, gridPos.y, promoChoice);

              if (success) {
                this.clearSelection();
                this.refreshBoardUI();
                this.checkGameStatusAlert();
                return;
              }
            } // If user clicked another friendly piece, switch selection to that piece


            const clickedPiece = this.engine.board.getPieceAt(gridPos);

            if (clickedPiece && clickedPiece.color === this.engine.activeTurn) {
              this.selectSquare(gridPos);
              return;
            } // Clicked an invalid/empty square -> Clear selection


            this.clearSelection();
            this.drawHighlights();
            return;
          } // ---------------------------------------------------------------------
          // Case B: No selection -> Try selecting piece at touched square
          // ---------------------------------------------------------------------


          const clickedPiece = this.engine.board.getPieceAt(gridPos);

          if (clickedPiece && clickedPiece.color === this.engine.activeTurn) {
            this.selectSquare(gridPos);
          }
        }
        /**
         * Selects a square, queries legal moves from the engine, and updates highlights.
         */


        selectSquare(pos) {
          this.selectedPos = pos;
          this.activeLegalMoves = this.engine.getLegalMoves(pos.x, pos.y);
          this.drawHighlights();
        }
        /** Clears active selection and legal move highlights */


        clearSelection() {
          this.selectedPos = null;
          this.activeLegalMoves = [];
          this.drawHighlights();
        } // =========================================================================
        // VISUAL RENDERING & NODE MANAGEMENT
        // =========================================================================

        /**
         * Synchronizes all Cocos Creator visual piece nodes with engine board state.
         */


        refreshBoardUI() {
          const activePieces = this.engine.board.findAllPieces();
          const activePieceIds = new Set(); // 1. Update or create visual nodes for all active engine pieces

          for (let i = 0; i < activePieces.length; i++) {
            const {
              pos,
              piece
            } = activePieces[i];
            activePieceIds.add(piece.id);
            let pieceNode = this.pieceNodesMap.get(piece.id);

            if (!pieceNode) {
              // Instantiate new Piece Node
              pieceNode = this.createPieceNode(piece);
              this.boardNode.addChild(pieceNode);
              this.pieceNodesMap.set(piece.id, pieceNode); // Set initial position immediately without animation

              pieceNode.setPosition(this.gridToLocalPos(pos.x, pos.y));
            } else {
              // Smoothly animate existing piece node to new grid coordinate
              const targetPos = this.gridToLocalPos(pos.x, pos.y);
              tween(pieceNode).to(0.15, {
                position: targetPos
              }).start();
            }
          } // 2. Remove captured piece nodes from screen


          this.pieceNodesMap.forEach((node, id) => {
            if (!activePieceIds.has(id)) {
              node.removeFromParent();
              node.destroy();
              this.pieceNodesMap.delete(id);
            }
          });
        }
        /**
         * Draws selection box and target square indicator dots on the Graphics layer.
         */


        drawHighlights() {
          if (!this.graphicsLayer) return;
          this.graphicsLayer.clear();
          const uiTransform = this.boardNode.getComponent(UITransform);
          const boardWidth = uiTransform ? uiTransform.width : 640;
          const boardHeight = uiTransform ? uiTransform.height : 640;
          const tileSizeX = boardWidth / this.engine.board.width;
          const tileSizeY = boardHeight / this.engine.board.height; // 1. Highlight Selected Square

          if (this.selectedPos) {
            const localPos = this.gridToLocalPos(this.selectedPos.x, this.selectedPos.y);
            this.graphicsLayer.fillColor = new Color(255, 235, 59, 120); // Semi-transparent yellow

            this.graphicsLayer.rect(localPos.x - tileSizeX / 2, localPos.y - tileSizeY / 2, tileSizeX, tileSizeY);
            this.graphicsLayer.fill();
          } // 2. Highlight Target Legal Moves


          for (let i = 0; i < this.activeLegalMoves.length; i++) {
            const move = this.activeLegalMoves[i];
            const localPos = this.gridToLocalPos(move.to.x, move.to.y);

            if (move.capturedPiece) {
              // Capture target ring
              this.graphicsLayer.strokeColor = new Color(244, 67, 54, 200); // Red outline

              this.graphicsLayer.lineWidth = 6;
              this.graphicsLayer.rect(localPos.x - tileSizeX / 2 + 3, localPos.y - tileSizeY / 2 + 3, tileSizeX - 6, tileSizeY - 6);
              this.graphicsLayer.stroke();
            } else {
              // Normal target dot
              this.graphicsLayer.fillColor = new Color(76, 175, 80, 180); // Green dot

              this.graphicsLayer.circle(localPos.x, localPos.y, tileSizeX * 0.18);
              this.graphicsLayer.fill();
            }
          }
        } // =========================================================================
        // NODE FACTORY & COORDINATE CONVERSIONS
        // =========================================================================

        /**
         * Creates a visual piece Node containing a Sprite component (or text Label fallback).
         */


        createPieceNode(piece) {
          const node = new Node(`Piece_${piece.id}`);
          const uiTransform = node.addComponent(UITransform);
          const spriteFrame = this.getSpriteFrameForPiece(piece);

          if (spriteFrame) {
            const sprite = node.addComponent(Sprite); // 1. Assign sprite frame first

            sprite.spriteFrame = spriteFrame; // 2. Enable CUSTOM size mode so Cocos respects UITransform

            sprite.sizeMode = Sprite.SizeMode.CUSTOM; // 3. Set content size AFTER assigning spriteFrame

            const boardTransform = this.boardNode.getComponent(UITransform);
            const tileSize = boardTransform ? boardTransform.width / 8 : 80;
            uiTransform.setContentSize(tileSize, tileSize);
          } else {
            // Fallback: Text Label if no sprite textures are assigned
            const label = node.addComponent(Label);
            const colorSymbol = piece.color === 'w' ? 'W' : 'B';
            label.string = `${colorSymbol}${piece.definition.symbol}`;
            label.fontSize = 32;
            label.color = piece.color === 'w' ? new Color(255, 255, 255) : new Color(30, 30, 30);
          }

          return node;
        }
        /**
         * Converts world touch coordinate to 0-indexed grid coordinate ({ x: 0..7, y: 0..7 }).
         */


        touchToGridPos(touchPosWorld) {
          const uiTransform = this.boardNode.getComponent(UITransform);
          if (!uiTransform) return null;
          const localPos = uiTransform.convertToNodeSpaceAR(new Vec3(touchPosWorld.x, touchPosWorld.y, 0));
          const boardWidth = uiTransform.width;
          const boardHeight = uiTransform.height;
          const tileSizeX = boardWidth / this.engine.board.width;
          const tileSizeY = boardHeight / this.engine.board.height;
          const gridX = Math.floor((localPos.x + boardWidth / 2) / tileSizeX);
          const gridY = Math.floor((localPos.y + boardHeight / 2) / tileSizeY);

          if (this.engine.board.isValidSquare(gridX, gridY)) {
            return {
              x: gridX,
              y: gridY
            };
          }

          return null;
        }
        /**
         * Converts 0-indexed grid coordinate to local position relative to Board Node anchor (0.5, 0.5).
         */


        gridToLocalPos(x, y) {
          const uiTransform = this.boardNode.getComponent(UITransform);
          const boardWidth = uiTransform ? uiTransform.width : 640;
          const boardHeight = uiTransform ? uiTransform.height : 640;
          const tileSizeX = boardWidth / this.engine.board.width;
          const tileSizeY = boardHeight / this.engine.board.height;
          const localX = (x + 0.5) * tileSizeX - boardWidth / 2;
          const localY = (y + 0.5) * tileSizeY - boardHeight / 2;
          return new Vec3(localX, localY, 0);
        }
        /**
         * Resolves matching SpriteFrame asset for a piece from the pieceSprites array.
         */


        getSpriteFrameForPiece(piece) {
          var _this$pieceSprites;

          if (!this.pieceSprites || this.pieceSprites.length < 12) {
            return null;
          }

          const symbolOrder = ['P', 'N', 'B', 'R', 'Q', 'K'];
          const index = symbolOrder.indexOf(piece.definition.symbol);
          if (index === -1) return null;
          const offset = piece.color === 'w' ? 0 : 6;
          return (_this$pieceSprites = this.pieceSprites[offset + index]) != null ? _this$pieceSprites : null;
        }
        /** Sets up Graphics node layer for rendering move targets and highlights */


        setupGraphicsLayer() {
          this.highlightNode = new Node('GraphicsHighlightLayer');
          this.boardNode.addChild(this.highlightNode);
          const uiTransform = this.highlightNode.addComponent(UITransform);
          const boardTransform = this.boardNode.getComponent(UITransform);

          if (boardTransform) {
            uiTransform.setContentSize(boardTransform.width, boardTransform.height);
          }

          this.graphicsLayer = this.highlightNode.addComponent(Graphics);
        }
        /** Logs game end notifications when Checkmate or Draw occurs */


        checkGameStatusAlert() {
          const status = this.engine.gameStatus;

          if (status === 'checkmate') {
            const winnerName = this.engine.winner === 'w' ? 'White' : 'Black';
            console.log(`CHECKMATE! ${winnerName} wins the match!`);
          } else if (status !== 'active') {
            console.log(`GAME DRAW: ${status}`);
          }
        } // =========================================================================
        // PUBLIC API FOR BOT COMMANDS / RESTART BUTTONS
        // =========================================================================

        /** Restarts the game match */


        restartGame() {
          this.engine.startNewGame();
          this.clearSelection();
          this.refreshBoardUI();
        }
        /** Undoes the last executed turn */


        undo() {
          const success = this.engine.undoMove();

          if (success) {
            this.clearSelection();
            this.refreshBoardUI();
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "boardNode", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "promotionDialog", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "pieceSprites", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=61af1f0de65f0c2db75f5e5fd9a6e0f9bb9be0d6.js.map