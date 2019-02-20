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
export default class Ball extends cc.Component {
  
    
    vector: cc.Vec2 = new cc.Vec2(0,1);
    isMoving : boolean = false;
    speed: number = 2000;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    }
    onKeyDown(e: KeyboardEvent): any {
        if((e.keyCode == cc.macro.KEY.enter || e.keyCode == cc.macro.KEY.space) && !this.isMoving){
            this.isMoving = true;
        }
    }

    start () {

    }

    onPlatformMoved(pos: number): any {
        if(!this.isMoving){
            this.node.x = pos;
        }
    }

    update (dt) {
        if(this.isMoving){
            this.node.x += this.vector.x * dt * this.speed;
            this.node.y += this.vector.y * dt*this.speed;
        }
    }
}
