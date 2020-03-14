class Main extends egret.DisplayObjectContainer{
    constructor(){
        super();

        this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
    }

    private onAddToStage():void{
        this.drawGame();
    }

    private drawGame():void{
        // 是否第一次进入游戏 第一次则不重制分数
        const menu:Menu = new Menu(this.stage.stageWidth,this.stage.stageHeight);
        const game:Game =  new Game(this.stage.stageWidth,this.stage.stageHeight);

        const menuView:egret.Sprite = menu.draw();
        const gameView:egret.Sprite = game.draw();

        const startGameEvent = new egret.Event('startGame');
        const changeHistoryEvent = new egret.Event('changeHistory')

        const stage = this;
        stage.addChild(menuView);
        // stage.addChild(gameView);
        
        const startView:egret.Sprite = new egret.Sprite()
        startView.graphics.drawRect(0,0,this.stage.stageWidth,this.stage.stageHeight);
        const startText:egret.TextField = new egret.TextField;
        startText.textColor = 0x000000;
        startText.text = 'START'
        startText.size = 50;
        startView.addChild(startText);

        startText.width = this.stage.stageWidth;
        startText.height = this.stage.stageHeight;
        startText.textAlign = egret.HorizontalAlign.CENTER;
        startText.verticalAlign = egret.VerticalAlign.MIDDLE;


        menuView.addEventListener('startGame',function(){
            stage.removeChild(menuView);
            stage.addChild(startView);
            const tw = egret.Tween.get(startText);
            tw.to({ size:100 },500,egret.Ease.circIn)
            .wait(200)
            .call(()=>{
                stage.removeChild(startView);
                gameView.dispatchEvent(startGameEvent);
                stage.addChild(gameView);
            })
            .to({ size:50 },500,egret.Ease.circIn)
        },menuView);

        gameView.addEventListener('gameOver',function(){
            console.log('game Over Event')
            // 修改游戏历史
            menuView.dispatchEvent(changeHistoryEvent);
        },gameView)

        gameView.addEventListener('backMenu',function(){
            stage.removeChild(gameView);
            stage.addChild(menuView);
        },gameView);

    }
}