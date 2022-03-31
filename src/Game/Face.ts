

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
        
        const bread = new Bread({ faceX:this.faceX,faceY:this.faceY,touchBreadCb:()=>{
            face.dispatchEvent(touchBreadEvent);
            this.openMouthAction()
        } });
        bread.draw(face);

        this.drawFaceLine(face);
        this.drawEyes(face);
        this.drawMouth(face);

        face.touchEnabled = true;
        
        return face;
    }
    
    private drawEyes(face:egret.Sprite){

        for(let i = 0; i < 2; i++){
            const eyebrow:egret.Sprite = new egret.Sprite();
            const eyeball:egret.Sprite = new egret.Sprite();

            // drawing the eyebrow to the face
            eyebrow.graphics.lineStyle(2,0x000000);
            eyebrow.graphics.drawArc(this.faceX - 75/2 + (i * 150/2),this.faceY - 200,10,0,Math.PI,false);
            
            eyebrow.graphics.endFill();
            face.addChild(eyebrow);

            // drawing the eyeball to the face
            eyeball.graphics.beginFill(0x000000);
            // x faceWitdh - 眼距/2 + (i * 眼距)
            eyeball.graphics.drawCircle(this.faceX - 75 + (i * 150),this.faceY - 150,10);
            eyeball.graphics.endFill();
            face.addChild(eyeball);
        }
    }

    private drawMouth(face:egret.Sprite) {
        const mouth:egret.Sprite = new egret.Sprite();
        mouth.graphics.lineStyle(2,0x000000);
        mouth.graphics.drawArc(this.faceX, this.faceY - 100,20,0,Math.PI,true);
        mouth.graphics.endFill();
        face.addChild(mouth);
    }

    private drawFaceLine(face:egret.Sprite){
        const faceLine:egret.Sprite = new egret.Sprite()
        faceLine.graphics.lineStyle(2,0x000000);
        faceLine.graphics.drawCircle(this.faceX,this.faceY,250);
        faceLine.graphics.endFill(); 
        face.addChild(faceLine);
    }

    private drawOpenMouth():egret.Sprite{
        const openMouth:egret.Sprite = new egret.Sprite();
        openMouth.graphics.lineStyle(2,0x000000);
        openMouth.graphics.beginFill(0xff00000);
        openMouth.graphics.drawCircle(this.faceX, this.faceY - 100,20);
        openMouth.graphics.endFill();
        return openMouth;
    }
    
    private drawFace():egret.Sprite{
        const face:egret.Sprite = new egret.Sprite();
        // face.sortableChildren = true;
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