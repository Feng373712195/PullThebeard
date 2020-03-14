const BREAS_NUM = 40;
const BREAS_Y = 30;

interface BreadInterface{
    faceX:number,
    faceY:number,
    breas:Array<egret.Sprite>,
    touchBreadCb:()=>void
}

interface BreadParamsInterface<T>{
    faceX:T,
    faceY:T,
    touchBreadCb?:()=>void
}

class Bread extends egret.Sprite implements BreadInterface{
    
    faceX:number = 0;
    faceY:number = 0;
    breas:Array<egret.Sprite> = [];
    touchBreadCb:()=>void = function(){};
    
    constructor(breadParmas:BreadParamsInterface<number>){
        super();

        this.faceX = breadParmas.faceX;
        this.faceY = breadParmas.faceY;
        if( this.touchBreadCb ){
            this.touchBreadCb = breadParmas.touchBreadCb
        }
    }

    private removeBear = (brea:egret.Sprite):Promise<undefined> => {
        return new Promise((resolve)=>{
            brea.touchEnabled = false;
            var tw = egret.Tween.get( brea );
            tw.to( {y:50}, 500 )
            .call( () => {
                const breaIndex = this.breas.indexOf(brea);
                // 清除动画
                egret.Tween.removeTweens(brea);
                // 清除监听事件
                brea.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.touchBear,brea);
                brea.removeEventListener(egret.TouchEvent.TOUCH_MOVE,this.touchBear,brea);
                // 从画布上消失
                brea.parent.removeChild(brea);
                // 从数组中清除
                this.breas.splice(breaIndex,1);
                // 通知回收
                brea = null;
                resolve();
            });
        })
    }

    private touchBear = async (brea:egret.Sprite,face:egret.Sprite,event:egret.Event)=> {
        //  小于30个胡子 及时补充
        if( this.breas.length <= 30 ){
            
            const timer = setTimeout(()=>{
                let i = 0;
                while(++i < 10){
                    this.createBear(face);
                }
                clearTimeout(timer);
            })
        }
        if( brea.parent ){
            this.touchBreadCb();
            // 清除胡子
            await this.removeBear(brea);
            // 再重新创建一条新胡子
            this.createBear(face);
        }
    }

    public draw(face:egret.Sprite){

        const otherBearSkin:egret.Sprite = new egret.Sprite();
        otherBearSkin.graphics.beginFill(0xf5f5f5);
        otherBearSkin.graphics.drawArc(this.faceX,this.faceY * 2,250,0,Math.PI,true);
        otherBearSkin.graphics.endFill();
        otherBearSkin.scaleY = 0.5;
        face.addChild(otherBearSkin);

        const beardSkin:egret.Sprite = new egret.Sprite();
        beardSkin.graphics.beginFill(0xf5f5f5);
        beardSkin.graphics.drawArc(this.faceX,this.faceY - 2,250,0,Math.PI,false);
        beardSkin.graphics.endFill();
        this.drawBears(beardSkin);
        
        face.addChild(beardSkin);
        
    }

    private randPoint(r:number,centerX:number,centerY:number,tryCount:number = 0):Array<number>{
           let theta = 2 * Math.PI * Math.random();
           let len = Math.sqrt(Math.random()) * r;
           let x = centerX + len * Math.cos(theta); 
           let y = centerY + len * Math.sin(theta);
           // y值太大 重新绘制 重新绘制次数为3次 都为失败则不绘制
           if( y < this.faceY - BREAS_Y && tryCount != 3 ){
               return this.randPoint(r,centerX,centerY,++tryCount)
           }
           return [x,y];
    }


    private drawBear(x:number,y:number,face:egret.Sprite):egret.Sprite{

        const shp:egret.Sprite = new egret.Sprite();
        // 测试查看点击范围
        // shp.graphics.lineStyle(2,0x000000);
        shp.graphics.beginFill(0x000000,0);
        shp.graphics.drawCircle(x >= this.faceX ?  x - 20 : x - 10,y - 25,50)

        const line = new egret.Shape();
        
        line.graphics.lineStyle( 2, 0x000000 );
        line.graphics.moveTo(x,y)
        line.graphics.lineTo(x >= this.faceX ?  x - 10 : x + 10 ,y - 20 );
        line.graphics.endFill();
        shp.zIndex = 99;
        shp.addChild(line);
        shp.graphics.endFill();
        shp.touchEnabled = true;
        shp.addEventListener(egret.TouchEvent.TOUCH_TAP,this.touchBear.bind(this,shp,face),shp)
        shp.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.touchBear.bind(this,shp,face),shp)
        
        return shp;
    }

    private createBear(face:egret.Sprite){
        const [x,y] = this.randPoint(250,this.faceX,this.faceY);
        if( y > this.faceY - BREAS_Y ){
            const brea = this.drawBear(x,y,face);
            this.breas.push(brea);
            face.addChild(brea);
        }
    }

    private drawBears(face:egret.Sprite){
        let count = 0;
        for( let i = 0; i < BREAS_NUM ; i ++ ){
            this.createBear(face);
        }
    }
    

}