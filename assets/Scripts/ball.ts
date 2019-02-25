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
  
    
    vector: cc.Vec2 = new cc.Vec2(1,2);
    isMoving : boolean = false;
    speed: number = 1000;

    isTapped: boolean = false;
    tapTime: number;

    @property(cc.Node)
    platform: cc.Node = null;

    @property(cc.Node)
    topWall: cc.Node = null;

    @property(cc.Node)
    leftWall: cc.Node = null;

    @property(cc.Node)
    rightWall: cc.Node = null;

    @property(cc.Node)
    bottom: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        this.node.parent.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.platform.on('moved', this.onPlatformMoved, this);
    }


    onTouchStart(e: cc.Event.EventTouch): any {
       if(this.isMoving || e.getTouches().length !=1)return;
       
       let time = new Date().getTime();
       if(!this.isTapped){
           this.isTapped = true;
           this.tapTime = time;
       } else {
           let timeDelta = time - this.tapTime;
           if(timeDelta < 400){
               //double tap
               this.isTapped = false;
               this.isMoving= true;
           }
           else {
               this.tapTime = time;
           }
       }
       
    }
    onKeyDown(e: KeyboardEvent): any {
        if((e.keyCode == cc.macro.KEY.enter || e.keyCode == cc.macro.KEY.space) && !this.isMoving){
            this.isMoving = true;
        }
    }

    start () {

    }

    resetBall(){
        this.isMoving = false;
        this.node.y = -870;
        this.vector = new cc.Vec2(1,2);
        this.node.x = this.platform.x;
    }

    onCollisionEnter(other: cc.Collider , self: cc.Collider) {
       
        switch(other.node){
            case this.leftWall:
            case this.rightWall:
                this.vector.x = -this.vector.x;
                break;
            case this.topWall: 
            case this.platform:
                this.vector.y = -this.vector.y;
                break;
            case this.bottom:
                this.resetBall();
                break;
        }
    }

    onPlatformMoved(pos: number): any {
        if(!this.isMoving){
            this.node.x = pos;
        }
    }

    update (dt) {
        if(this.isMoving){
            this.node.x += this.vector.x * dt * this.speed;
            this.node.y += this.vector.y * dt * this.speed;
        }
    }
}
