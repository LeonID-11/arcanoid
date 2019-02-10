// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Platform extends cc.Component {

    left: boolean = false;
    right: boolean = false;
    moving: boolean = false;
    x: number;
    maxPos:number;
    minPos:number;

    @property
    Delta: number = 20;
    
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.maxPos = this.node.parent.width/2 - this.node.width/2;
        this.minPos = - this.node.parent.width/2 + this.node.width/2;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        let canvas = this.node.parent;
        canvas.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        canvas.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        canvas.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        canvas.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }

    onTouchStart(e: cc.Touch){
        this.moving = true;
        this.x = this.node.x;
    }

    onTouchEnd(e: cc.Touch){
        this.moving = false;
    }

    onTouchCancel(e: cc.Touch){
        this.moving = false;
    }

    onTouchMove(e: cc.Touch){
        if(!this.moving)return;

        this.x += e.getDelta().x;
    }

    onKeyUp(e: KeyboardEvent): any {
        if(e.keyCode == cc.macro.KEY.left){
            this.left = false;
        } else if( e.keyCode == cc.macro.KEY.right){
            this.right = false;
        }
    }
    onKeyDown(e: KeyboardEvent): any {
        if(e.keyCode == cc.macro.KEY.left){
            this.left = true;
        } else if( e.keyCode == cc.macro.KEY.right){
            this.right = true;
        }
    }

    start () {

    }

    updateByKeys(){
        let delta = 0;
        if(this.left){
            delta = -this.Delta;
        } else if(this.right){
            delta = this.Delta;
        }else return;

        let pos = this.node.x + delta;
        

        if(pos> this.maxPos){
            pos =this.maxPos;
        }else if(pos< this.minPos){
            pos = this.minPos;
        }

        this.node.x = pos;
    }

    updateByTouch(){
        if(this.x > this.maxPos){
            this.x = this.maxPos;
        }else if(this.x < this.minPos){
            this.x = this.minPos;
        }
        this.node.x = this.x;
    }

    update (dt) {
        
        if(this.moving){
            this.updateByTouch();
            return;
        }

        this.updateByKeys();
        
    }

    onDestroy(){
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }
}
