var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        var _this = _super.call(this) || this;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    Main.prototype.onAddToStage = function () {
        this.drawGame();
    };
    Main.prototype.drawGame = function () {
        // 是否第一次进入游戏 第一次则不重制分数
        var menu = new Menu(this.stage.stageWidth, this.stage.stageHeight);
        var game = new Game(this.stage.stageWidth, this.stage.stageHeight);
        var menuView = menu.draw();
        var gameView = game.draw();
        var startGameEvent = new egret.Event('startGame');
        var changeHistoryEvent = new egret.Event('changeHistory');
        var stage = this;
        stage.addChild(menuView);
        // stage.addChild(gameView);
        var startView = new egret.Sprite();
        startView.graphics.drawRect(0, 0, this.stage.stageWidth, this.stage.stageHeight);
        var startText = new egret.TextField;
        startText.textColor = 0x000000;
        startText.text = 'START';
        startText.size = 50;
        startView.addChild(startText);
        startText.width = this.stage.stageWidth;
        startText.height = this.stage.stageHeight;
        startText.textAlign = egret.HorizontalAlign.CENTER;
        startText.verticalAlign = egret.VerticalAlign.MIDDLE;
        menuView.addEventListener('startGame', function () {
            stage.removeChild(menuView);
            stage.addChild(startView);
            var tw = egret.Tween.get(startText);
            tw.to({ size: 100 }, 500, egret.Ease.circIn)
                .wait(200)
                .call(function () {
                stage.removeChild(startView);
                gameView.dispatchEvent(startGameEvent);
                stage.addChild(gameView);
            })
                .to({ size: 50 }, 500, egret.Ease.circIn);
        }, menuView);
        gameView.addEventListener('gameOver', function () {
            console.log('game Over Event');
            // 修改游戏历史
            menuView.dispatchEvent(changeHistoryEvent);
        }, gameView);
        gameView.addEventListener('backMenu', function () {
            stage.removeChild(gameView);
            stage.addChild(menuView);
        }, gameView);
    };
    return Main;
}(egret.DisplayObjectContainer));
__reflect(Main.prototype, "Main");
//# sourceMappingURL=Main.js.map