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

class Breads extends egret.Sprite implements BreadInterface{
    
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
            tw.to( {y: brea.y + 50 }, 300 )
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

    public draw(face:egret.Sprite){
        this.drawBears(face);    
    }

    private drawBear(x:number,y:number,face:egret.Sprite):egret.Sprite{

        const shp:egret.Sprite = new egret.Sprite(); 
        console.log(x,y,this.faceX,this.faceY)

        shp.x = x;
        shp.y = y;
        shp.anchorOffsetX = x;
        shp.anchorOffsetY = y;        
        const breadAngle = Math.atan2(this.faceY * 0.5 - y,this.faceX - x) * 180 / Math.PI;
 
        shp.rotation = breadAngle - 90;
        // 测试查看点击范围
        // shp.graphics.lineStyle(2,0x000000);
        shp.graphics.beginFill(0x000000,0);
        shp.graphics.drawCircle(x,y - 5,20);
        shp.zIndex = 99;
        shp.graphics.endFill();
                       
        shp.touchEnabled = true;

        const line = new egret.Shape();
        line.x = x;
        line.y = y;
        line.anchorOffsetX = x;
        line.anchorOffsetY = y; 
        line.graphics.lineStyle( 4, 0x696969 );
        line.graphics.moveTo(x,y - 7)
        line.scaleY = 0;
        var tw = egret.Tween.get(line);
        tw.to( { scaleY:1 }, 300, egret.Ease.backInOut)
        line.graphics.lineTo(x,y)
        line.graphics.endFill();


        shp.addChild(line);
        shp.addEventListener(egret.TouchEvent.TOUCH_TAP,this.touchBear.bind(this,shp,face),shp)
        shp.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.touchBear.bind(this,shp,face),shp)
        
        return shp;
    }
    
    private touchBear = async (brea:egret.Sprite,face:egret.Sprite,event:egret.Event)=> {
        //  小于30个胡子 及时补充
        if( this.breas.length <= 30 ){
            // const timer = setTimeout(()=>{
            //     let i = 0;
            //     while(++i < 10){
            //         this.createBear(face);
            //     }
            //     clearTimeout(timer);
            // })
        }
        
        if( brea.parent ){
            this.touchBreadCb();
            // 清除胡子
            this.removeBear(brea).then(res=>{
                // 再重新创建一条新胡子
                this.createBear(face);
            });
            this.removeBear(brea)
            this.createBear(face);
        }
    }
    // https://zhuanlan.zhihu.com/p/447898464 在圆中均匀分布随机点
    // https://blog.csdn.net/u014028063/article/details/84314780
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