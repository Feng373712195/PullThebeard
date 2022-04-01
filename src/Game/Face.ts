

interface FaceInterface{
    faceX:number,
    faceY:number
}

interface FaceParamsInterface<T>{
    x:T,
    y:T,
    width:T,
    height:T
}


class Face extends egret.Sprite implements FaceInterface{
    
    faceX:number = 0;
    faceY:number = 0;

    constructor(faceParmas:FaceParamsInterface<number>){
        super();

        this.faceX = faceParmas.x;
        this.faceY = faceParmas.y;

    }

    public draw():egret.Sprite{
        const face = this.drawFace();
        const openMouth = this.drawOpenMouth();

        this.openMouthAction = this.openMouthAction.bind(this,face,openMouth)
        const touchBreadEvent = new egret.Event('touchBread');
        // 在脸上画胡子
        
        const bread = new Breads({ faceX:this.faceX,faceY:this.faceY,touchBreadCb:()=>{
            face.dispatchEvent(touchBreadEvent);
            this.openMouthAction()
        } });

        this.drawBeardSkin(face);
        this.drawFaceLine(face);
        this.drawEyes(face);
        this.drawMouth(face);
        bread.draw(face);
        
        face.touchEnabled = true;
        
        return face;
    }
    
    private drawEyes(face:egret.Sprite){

        for(let i = 0; i < 2; i++){
            const eyebrow:egret.Sprite = new egret.Sprite();
            const eyeball:egret.Sprite = new egret.Sprite();

            // drawing the eyebrow to the face
            eyebrow.graphics.lineStyle(4,0x000000);
            eyebrow.graphics.drawArc(this.faceX - 75/2 + (i * 150/2),this.faceY - 200,10,0,Math.PI,false);
            
            eyebrow.graphics.endFill();
            face.addChild(eyebrow);

            // drawing the eyeball to the face
            eyeball.graphics.beginFill(0x000000);
            // x faceWitdh - 眼距/2 + (i * 眼距)
            eyeball.graphics.drawCircle(this.faceX - 75 + (i * 150),this.faceY - 150,12);
            eyeball.graphics.endFill();
            face.addChild(eyeball);
        }
    }

    private drawMouth(face:egret.Sprite) {
        const mouth:egret.Sprite = new egret.Sprite();
        mouth.graphics.lineStyle(4,0x000000);
        mouth.graphics.drawArc(this.faceX, this.faceY - 100,20,0,Math.PI,true);
        mouth.graphics.endFill();
        face.addChild(mouth);
    }

    private drawFaceLine(face:egret.Sprite){
        const faceLine:egret.Sprite = new egret.Sprite()
        faceLine.graphics.lineStyle(4,0xFFA500);
        faceLine.graphics.drawCircle(this.faceX,this.faceY,250);
        faceLine.graphics.endFill(); 
        face.addChild(faceLine);
    }

    private drawBeardSkin(face:egret.Sprite){
        const otherBearSkin:egret.Sprite = new egret.Sprite();
        otherBearSkin.graphics.beginFill(0xf5f5f5);
        otherBearSkin.graphics.drawArc(this.faceX,this.faceY * 2,250,0,Math.PI,true);
        otherBearSkin.graphics.endFill();
        otherBearSkin.scaleY = 0.5;
        face.addChild(otherBearSkin);

        const beardSkin:egret.Sprite = new egret.Sprite();
        beardSkin.graphics.beginFill(0xf5f5f5);
        beardSkin.graphics.drawArc(this.faceX,this.faceY,250,0,Math.PI,false);
        beardSkin.graphics.endFill();
        face.addChild(beardSkin);
    }

    private drawOpenMouth():egret.Sprite{
        const openMouth:egret.Sprite = new egret.Sprite();
        openMouth.graphics.lineStyle(4,0x000000);
        openMouth.graphics.beginFill(0xff00000);
        openMouth.graphics.drawCircle(this.faceX, this.faceY - 100,20);
        openMouth.graphics.endFill();
        return openMouth;
    }
    
    private drawFace():egret.Sprite{
        const face:egret.Sprite = new egret.Sprite();
        face.graphics.beginFill(0xFFEFD5);
        face.graphics.drawCircle(this.faceX,this.faceY,250);
        face.touchEnabled = true;

        return face;
    }

    private openMouthAction(face?:egret.Sprite,adder?:egret.Sprite){
        face.addChild(adder);
        const timer = setTimeout(()=>{
            if(adder.parent){
                adder.parent.removeChild(adder);
            }
            clearTimeout(timer);
        },300)
    }

}