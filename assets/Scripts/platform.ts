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

    @property
    Delta: number = 20;
    
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
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

    update (dt) {
        let delta = 0;
        if(this.left){
            delta = -this.Delta;
        } else if(this.right){
            delta = this.Delta;
        }else return;

        let pos = this.node.x + delta;
        let maxPos = this.node.parent.width/2 - this.node.width/2;
        let minPos = - this.node.parent.width/2 + this.node.width/2;

        if(pos> maxPos){
            pos = maxPos;
        }else if(pos< minPos){
            pos = minPos;
        }

        this.node.x = pos;
    }

    onDestroy(){
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }
}
