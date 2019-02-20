import { PlatformEvent } from "./platform-event";
import Ball from "./ball";

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

    
    side: number = 0;

    moving: boolean = false;
    x: number;
   
    maxPos: number;
    minPos: number;

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
        canvas.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd,this);
	    canvas.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel,this);
        canvas.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }
    onKeyUp(e: KeyboardEvent): any {
       
        if(e.keyCode == cc.macro.KEY.left || e.keyCode == cc.macro.KEY.right){
            this.side = 0;
        } 
    }

    onTouchStart(e: cc.Touch){
        this.x = this.node.x;
        this.moving = true;
    }

    onTouchEnd(e: cc.Touch){
        this.moving=false;
    }

    onTouchCancel(e: cc.Touch){
        this.moving=false;
    }

    onTouchMove(e: cc.Touch){
        if(!this.moving)return;
     
	    this.x += e.getDelta().x;
    }

    onKeyDown(e: KeyboardEvent): any {
        if(e.keyCode == cc.macro.KEY.left){
            this.side = -1;
        } else if( e.keyCode == cc.macro.KEY.right){
            this.side = 1;
        }
    }

    start () {

    }

    update (dt) {
        if(this.moving){
            this.updateByTouch();
            return;
        }
        this.updateByKeys();
    }

    setPosition(pos: number){
        let newPos = pos;
        if(newPos> this.maxPos){
            newPos = this.maxPos;
        }
        else if(newPos < this.minPos){
            newPos = this.minPos;
        }
        this.node.x = newPos;
        this.node.emit("moved", newPos);
    }

    updateByTouch() {
        this.setPosition(this.x);
    }

    updateByKeys(){
        if(this.side==0)return;
        this.setPosition(this.node.x + this.Delta * this.side);
    }

    onDestroy(){
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }
}
