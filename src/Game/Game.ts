const GAME_TIME_SECOUND = 10;
const GAME_STORAGE_NAME = 'wuzefeng_game01_recode'

interface GameInterface {
    stageW:number,
    stageH:number,
    playing:boolean,
    gameTime:number,
    firstPlay:boolean,
    timer:number
}

interface DarwResultViewReturn {
    view:egret.Sprite,
    changeScore:(score:number)=>void
}

class Game extends egret.Sprite implements GameInterface {
    
    stageW:number;
    stageH:number;
    // 是否正在游戏
    playing:boolean = true;
    // 倒计时时间
    gameTime:number = GAME_TIME_SECOUND
    // 已经开始过了
    firstPlay:boolean = true;
    // 计时器
    timer:number = null;
    
    constructor(stageW,stageH){
        super();
        this.stageW = stageW;
        this.stageH = stageH;
    }

    draw(){
        
        // 游戏是否在进行中
        this.playing = true;
        const backMenuEvent = new egret.Event('backMenu');
        const restartEvent = new egret.Event('restart');
        const gameOverEvent = new egret.Event('gameOver');

        const resultView = this.drawResultView({
            backMenuCb:()=> gameView.dispatchEvent(backMenuEvent),
            restartCb:()=> gameView.dispatchEvent(restartEvent),
        })

        const gameView:egret.Sprite = new egret.Sprite();
        gameView.graphics.drawRect(0,0,this.stageW,this.stageH);
        gameView.graphics.endFill();

        const face = new Face({ x:this.stageW/2,y:this.stageH/2,width:0,height:0 });
        const faceView = face.draw();

        // 返回
        const backBtn :egret.TextField = new egret.TextField();
        backBtn.size = 30;
        backBtn.textColor = 0x000000;
        backBtn.text = 'back';
        gameView.addChild(backBtn);
        backBtn.y = 40;
        backBtn.x = 80;
        backBtn.touchEnabled = true;

        backBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
            gameView.dispatchEvent(backMenuEvent);
        },backBtn)

        // 游戏分数   
        const gameSecound:egret.TextField = new egret.TextField();
        gameSecound.size = 60;
        gameSecound.text = GAME_TIME_SECOUND + '';
        gameSecound.textColor = 0x000000;
        gameView.addChild(gameSecound);
        
        gameSecound.y = this.stageH/2 - 400;
        gameSecound.width = this.stageW;
        gameSecound.textAlign = egret.HorizontalAlign.CENTER;

        const gameTimeOut = (emit:()=>any) =>{
            this.timer = setTimeout(()=>{
                if(this.gameTime !== 0){
                    gameSecound.text = (--this.gameTime) + '';
                    if( this.gameTime === 0 ){
                         emit();
                         return;
                    }
                    gameTimeOut(emit)
                }
            },1000)
        }
        
        const timeOutEmit = ()=>{
            this.playing = false;
            gameView.dispatchEvent(gameOverEvent);
        }

        gameView.addEventListener('startGame',()=>{
            if( this.firstPlay ){
                gameTimeOut(timeOutEmit);
                this.firstPlay = false;
                return;
            }
            gameView.dispatchEvent(restartEvent);
        },gameView);
        
        // 剩余秒数         
        let score:number = 0;
        const scoreText :egret.TextField = new egret.TextField();
        scoreText.size = 30;
        scoreText.textColor = 0x000000;
        scoreText.text = '得分：' + score;
        gameView.addChild(scoreText );
        scoreText.y = 40;
        scoreText.x = this.stageW - 200;

        faceView.addEventListener('touchBread',()=>{
            if( this.playing ){
                scoreText.text = '得分：' + (++score)
            }
        },faceView);

        gameView.addEventListener('gameOver',()=>{
            resultView.changeScore(score);
            gameView.addChild(resultView.view);

            // 记录数据
            const historyScore = egret.localStorage.getItem(GAME_STORAGE_NAME);
            if( historyScore ){
                if( Number(score) > Number(historyScore) ){
                    egret.localStorage.setItem(GAME_STORAGE_NAME,score + '');
                }
            }else{
                egret.localStorage.setItem(GAME_STORAGE_NAME,score + '');
            }
            
        },gameView)

        gameView.addEventListener('restart',()=>{
            clearTimeout(this.timer);
            this.gameTime = GAME_TIME_SECOUND;
            score = 0;
            scoreText.text = '得分：' + score;
            gameSecound.text = this.gameTime + '';
            gameTimeOut(timeOutEmit);
            resultView.changeScore(0);
            this.playing = true;
            if( resultView.view.parent ){
                resultView.view.parent.removeChild(resultView.view);
            }
        },gameView);

        gameView.addChild(faceView);

        return gameView;
    }
    
    drawResultView({ restartCb,backMenuCb }):DarwResultViewReturn{

        // 最终得分
        const resultMask:egret.Sprite = new egret.Sprite();
        resultMask.zIndex = 999;
        resultMask.graphics.beginFill(0x000000,0.4);
        resultMask.graphics.drawRect(0,0,this.stageW,this.stageH);
        resultMask.graphics.endFill();
        
        const resultView:egret.Sprite = new egret.Sprite(); 
        resultView.graphics.lineStyle(5,0x000000);
        resultView.graphics.beginFill(0xffffff);
        resultView.graphics.drawRoundRect(0,0,500,500,20,20);
        resultView.x = this.stageW/2 - 500/2;
        resultView.y = this.stageH/2 - 500/2;
        resultView.graphics.endFill();


        const resultTitle:egret.TextField = new egret.TextField();
        resultTitle.textColor = 0x000000
        resultTitle.size = 45;
        resultTitle.text = '时间到～'
        const gameResult:egret.TextField = new egret.TextField();
        gameResult.textColor = 0x000000
        gameResult.text = '你的得分是：';
        gameResult.size = 35;

        const restartBtn:egret.TextField = new egret.TextField();
        restartBtn.text = '重新开始'
        restartBtn.size = 30;
        restartBtn.textColor = 0x000000
        restartBtn.touchEnabled = true;
        const backMenu:egret.TextField = new egret.TextField();
        backMenu.text = '返回菜单'
        backMenu.size = 30;
        backMenu.textColor = 0x000000
        backMenu.touchEnabled = true;

        resultView.addChild(restartBtn);
        resultView.addChild(backMenu);
        resultView.addChild(resultTitle);
        resultView.addChild(gameResult);

        resultTitle.width = 500;
        resultTitle.y = 40;
        resultTitle.textAlign = egret.HorizontalAlign.CENTER;

        gameResult.width = 500;
        gameResult.y = 120;
        gameResult.textAlign = egret.HorizontalAlign.CENTER;

        restartBtn.width = 500;
        restartBtn.y = 300;
        restartBtn.textAlign = egret.HorizontalAlign.CENTER;

        restartBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
            restartCb && restartCb.bind(this)();
        },restartBtn)

        backMenu.width = 500;
        backMenu.y = 380;
        backMenu.textAlign = egret.HorizontalAlign.CENTER;

        backMenu.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
            backMenuCb && backMenuCb.bind(this)();
        },backMenu)

        resultMask.addChild(resultView);

        return {
            view:resultMask,
            changeScore:(score)=>{
                gameResult.text = '你的得分是：' + score
            }
        }
    }
}