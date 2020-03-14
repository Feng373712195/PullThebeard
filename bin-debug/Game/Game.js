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
var GAME_TIME_SECOUND = 10;
var GAME_STORAGE_NAME = 'wuzefeng_game01_recode';
var Game = (function (_super) {
    __extends(Game, _super);
    function Game(stageW, stageH) {
        var _this = _super.call(this) || this;
        // 是否正在游戏
        _this.playing = true;
        // 倒计时时间
        _this.gameTime = GAME_TIME_SECOUND;
        // 已经开始过了
        _this.firstPlay = true;
        // 计时器
        _this.timer = null;
        _this.stageW = stageW;
        _this.stageH = stageH;
        return _this;
    }
    Game.prototype.draw = function () {
        var _this = this;
        // 游戏是否在进行中
        this.playing = true;
        var backMenuEvent = new egret.Event('backMenu');
        var restartEvent = new egret.Event('restart');
        var gameOverEvent = new egret.Event('gameOver');
        var resultView = this.drawResultView({
            backMenuCb: function () { return gameView.dispatchEvent(backMenuEvent); },
            restartCb: function () { return gameView.dispatchEvent(restartEvent); },
        });
        var gameView = new egret.Sprite();
        gameView.graphics.drawRect(0, 0, this.stageW, this.stageH);
        gameView.graphics.endFill();
        var face = new Face({ x: this.stageW / 2, y: this.stageH / 2, width: 0, height: 0 });
        var faceView = face.draw();
        // 返回
        var backBtn = new egret.TextField();
        backBtn.size = 30;
        backBtn.textColor = 0x000000;
        backBtn.text = 'back';
        gameView.addChild(backBtn);
        backBtn.y = 40;
        backBtn.x = 80;
        backBtn.touchEnabled = true;
        backBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            gameView.dispatchEvent(backMenuEvent);
        }, backBtn);
        // 游戏分数   
        var gameSecound = new egret.TextField();
        gameSecound.size = 60;
        gameSecound.text = GAME_TIME_SECOUND + '';
        gameSecound.textColor = 0x000000;
        gameView.addChild(gameSecound);
        gameSecound.y = this.stageH / 2 - 400;
        gameSecound.width = this.stageW;
        gameSecound.textAlign = egret.HorizontalAlign.CENTER;
        var gameTimeOut = function (emit) {
            _this.timer = setTimeout(function () {
                if (_this.gameTime !== 0) {
                    gameSecound.text = (--_this.gameTime) + '';
                    if (_this.gameTime === 0) {
                        emit();
                        return;
                    }
                    gameTimeOut(emit);
                }
            }, 1000);
        };
        var timeOutEmit = function () {
            _this.playing = false;
            gameView.dispatchEvent(gameOverEvent);
        };
        gameView.addEventListener('startGame', function () {
            if (_this.firstPlay) {
                gameTimeOut(timeOutEmit);
                _this.firstPlay = false;
                return;
            }
            gameView.dispatchEvent(restartEvent);
        }, gameView);
        // 剩余秒数         
        var score = 0;
        var scoreText = new egret.TextField();
        scoreText.size = 30;
        scoreText.textColor = 0x000000;
        scoreText.text = '得分：' + score;
        gameView.addChild(scoreText);
        scoreText.y = 40;
        scoreText.x = this.stageW - 200;
        faceView.addEventListener('touchBread', function () {
            if (_this.playing) {
                scoreText.text = '得分：' + (++score);
            }
        }, faceView);
        gameView.addEventListener('gameOver', function () {
            resultView.changeScore(score);
            gameView.addChild(resultView.view);
            // 记录数据
            var historyScore = egret.localStorage.getItem(GAME_STORAGE_NAME);
            if (historyScore) {
                if (Number(score) > Number(historyScore)) {
                    egret.localStorage.setItem(GAME_STORAGE_NAME, score + '');
                }
            }
            else {
                egret.localStorage.setItem(GAME_STORAGE_NAME, score + '');
            }
        }, gameView);
        gameView.addEventListener('restart', function () {
            clearTimeout(_this.timer);
            _this.gameTime = GAME_TIME_SECOUND;
            score = 0;
            scoreText.text = '得分：' + score;
            gameSecound.text = _this.gameTime + '';
            gameTimeOut(timeOutEmit);
            resultView.changeScore(0);
            _this.playing = true;
            if (resultView.view.parent) {
                resultView.view.parent.removeChild(resultView.view);
            }
        }, gameView);
        gameView.addChild(faceView);
        return gameView;
    };
    Game.prototype.drawResultView = function (_a) {
        var _this = this;
        var restartCb = _a.restartCb, backMenuCb = _a.backMenuCb;
        // 最终得分
        var resultMask = new egret.Sprite();
        resultMask.zIndex = 999;
        resultMask.graphics.beginFill(0x000000, 0.4);
        resultMask.graphics.drawRect(0, 0, this.stageW, this.stageH);
        resultMask.graphics.endFill();
        var resultView = new egret.Sprite();
        resultView.graphics.lineStyle(5, 0x000000);
        resultView.graphics.beginFill(0xffffff);
        resultView.graphics.drawRoundRect(0, 0, 500, 500, 20, 20);
        resultView.x = this.stageW / 2 - 500 / 2;
        resultView.y = this.stageH / 2 - 500 / 2;
        resultView.graphics.endFill();
        var resultTitle = new egret.TextField();
        resultTitle.textColor = 0x000000;
        resultTitle.size = 45;
        resultTitle.text = '时间到～';
        var gameResult = new egret.TextField();
        gameResult.textColor = 0x000000;
        gameResult.text = '你的得分是：';
        gameResult.size = 35;
        var restartBtn = new egret.TextField();
        restartBtn.text = '重新开始';
        restartBtn.size = 30;
        restartBtn.textColor = 0x000000;
        restartBtn.touchEnabled = true;
        var backMenu = new egret.TextField();
        backMenu.text = '返回菜单';
        backMenu.size = 30;
        backMenu.textColor = 0x000000;
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
        restartBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            restartCb && restartCb.bind(_this)();
        }, restartBtn);
        backMenu.width = 500;
        backMenu.y = 380;
        backMenu.textAlign = egret.HorizontalAlign.CENTER;
        backMenu.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            backMenuCb && backMenuCb.bind(_this)();
        }, backMenu);
        resultMask.addChild(resultView);
        return {
            view: resultMask,
            changeScore: function (score) {
                gameResult.text = '你的得分是：' + score;
            }
        };
    };
    return Game;
}(egret.Sprite));
__reflect(Game.prototype, "Game", ["GameInterface"]);
//# sourceMappingURL=Game.js.map