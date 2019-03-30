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
  
    
    
    isMoving : boolean = false;
    speed: number = 1000;

    isTapped: boolean = false;
    tapTime: number;

    @property(cc.Node)
    platform: cc.Node = null;

    

    body: cc.RigidBody;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        this.node.parent.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.platform.on('moved', this.onPlatformMoved, this);
        this.body = this.node.getComponent(cc.RigidBody);
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
               this.runBall();
           }
           else {
               this.tapTime = time;
           }
       }
       
    }

    runBall(){
        this.isMoving = true;
        this.body.linearVelocity=cc.v2(500,1000);
        
    }

    onKeyDown(e: KeyboardEvent): any {
        if((e.keyCode == cc.macro.KEY.enter || e.keyCode == cc.macro.KEY.space) && !this.isMoving){
            this.runBall();
        }
    }

    start () {

    }

    

    resetBall(){
        this.body.linearVelocity = cc.v2(0,0)
        this.isMoving = false;
        this.node.runAction(cc.moveTo(0, this.platform.x, -870));
    }

    onBeginContact(contact: cc.PhysicsContact, self: cc.PhysicsCollider, other: cc.PhysicsCollider) {
        if(other.node.name=="bottom"){
            this.resetBall();
        }
     }

    onPlatformMoved(pos: number): any {
        if(!this.isMoving){
            this.node.x = pos;
        }
    }

    update(){
        if(!this.isMoving){
            this.node.y = -870;
        }
    }
}