import { _decorator, Component, Node, Button, Sprite, SpriteFrame } from 'cc';
import { PieceColor } from 'db://assets/src/interfaces/IPieceState';

const { ccclass, property } = _decorator;

export type PromotionChoice = 'Q' | 'R' | 'B' | 'N';

/**
 * Cocos Creator UI Modal for handling pawn promotion choices.
 * Dynamically switches button sprite textures based on the active player's color.
 */
@ccclass('PromotionDialog')
export class PromotionDialog extends Component {

    // Button Node References
    @property({ type: Node, doc: 'Queen Selection Button Node' })
    public btnQueen: Node = null!;

    @property({ type: Node, doc: 'Rook Selection Button Node' })
    public btnRook: Node = null!;

    @property({ type: Node, doc: 'Bishop Selection Button Node' })
    public btnBishop: Node = null!;

    @property({ type: Node, doc: 'Knight Selection Button Node' })
    public btnKnight: Node = null!;

    // White Piece Sprite Frames
    @property({ type: SpriteFrame, doc: 'White Queen Icon' })
    public wQueen: SpriteFrame = null!;

    @property({ type: SpriteFrame, doc: 'White Rook Icon' })
    public wRook: SpriteFrame = null!;

    @property({ type: SpriteFrame, doc: 'White Bishop Icon' })
    public wBishop: SpriteFrame = null!;

    @property({ type: SpriteFrame, doc: 'White Knight Icon' })
    public wKnight: SpriteFrame = null!;

    // Black Piece Sprite Frames
    @property({ type: SpriteFrame, doc: 'Black Queen Icon' })
    public bQueen: SpriteFrame = null!;

    @property({ type: SpriteFrame, doc: 'Black Rook Icon' })
    public bRook: SpriteFrame = null!;

    @property({ type: SpriteFrame, doc: 'Black Bishop Icon' })
    public bBishop: SpriteFrame = null!;

    @property({ type: SpriteFrame, doc: 'Black Knight Icon' })
    public bKnight: SpriteFrame = null!;

    private resolveCallback: ((choice: PromotionChoice) => void) | null = null;

    protected onLoad(): void {
        // Register click listeners for each button
        this.btnQueen?.on(Button.EventType.CLICK, () => this.select('Q'), this);
        this.btnRook?.on(Button.EventType.CLICK, () => this.select('R'), this);
        this.btnBishop?.on(Button.EventType.CLICK, () => this.select('B'), this);
        this.btnKnight?.on(Button.EventType.CLICK, () => this.select('N'), this);

        // Hide dialog on initialization
        this.node.active = false;
    }

    /**
     * Displays the promotion modal, updates icons to match player color,
     * and returns a Promise resolving to the selected promotion piece symbol.
     * 
     * @param color Color of the promoting player ('w' or 'b')
     */
    public show(color: PieceColor = 'w'): Promise<PromotionChoice> {
        this.updateIcons(color);
        this.node.active = true;

        return new Promise<PromotionChoice>((resolve) => {
            this.resolveCallback = resolve;
        });
    }

    /**
     * Dynamically swaps sprite frames on button nodes to match White or Black icons.
     */
    private updateIcons(color: PieceColor): void {
        const isWhite = color === 'w';

        this.setButtonSprite(this.btnQueen, isWhite ? this.wQueen : this.bQueen);
        this.setButtonSprite(this.btnRook, isWhite ? this.wRook : this.bRook);
        this.setButtonSprite(this.btnBishop, isWhite ? this.wBishop : this.bBishop);
        this.setButtonSprite(this.btnKnight, isWhite ? this.wKnight : this.bKnight);
    }

    /**
     * Applies a SpriteFrame to the Sprite component on a given button node.
     */
    private setButtonSprite(btnNode: Node, frame: SpriteFrame): void {
        if (!btnNode || !frame) return;

        const sprite = btnNode.getComponent(Sprite);
        if (sprite) {
            sprite.spriteFrame = frame;
        }
    }

    /**
     * Resolves the active Promise with the player's choice and hides the modal.
     */
    private select(choice: PromotionChoice): void {
        this.node.active = false;

        if (this.resolveCallback) {
            this.resolveCallback(choice);
            this.resolveCallback = null;
        }
    }
}