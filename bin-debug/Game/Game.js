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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var GAME_TIME_SECOUND = 15;
var GAME_STORAGE_NAME = 'gameScoreRecode';
var PLAYNAME_STORAGE_NAME = 'playerName';
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
        _this.expressionScore = 0;
        _this.useTime = 0;
        _this.stageW = stageW;
        _this.stageH = stageH;
        return _this;
    }
    Game.prototype.draw = function () {
        var _this = this;
        // 游戏是否在进行中
        this.playing = false;
        var backMenuEvent = new egret.Event('backMenu');
        var restartEvent = new egret.Event('restart');
        var gameOverEvent = new egret.Event('gameOver');
        var resultView = this.drawResultView({
            backMenuCb: function () { return gameView.dispatchEvent(backMenuEvent); },
            restartCb: function () { return gameView.dispatchEvent(restartEvent); },
        });
        var intoRankView = this.drawIntoRankView();
        var gameView = new egret.Sprite();
        gameView.graphics.drawRect(0, 0, this.stageW, this.stageH);
        gameView.graphics.endFill();
        var face = new Face({ x: this.stageW / 2, y: this.stageH / 2, width: 0, height: 0 });
        var faceView = face.draw();
        // 返回
        var backBtn = new egret.TextField();
        backBtn.size = 30;
        backBtn.textColor = 0x000000;
        backBtn.text = '返回';
        gameView.addChild(backBtn);
        backBtn.y = 40;
        backBtn.x = 80;
        backBtn.touchEnabled = true;
        backBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            SoundManager.getInstance().playButtonSound();
            clearTimeout(_this.timer);
            _this.playing = false;
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
                    ++_this.useTime;
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
        // 剩余秒数         
        var score = 0;
        var scoreText = new egret.TextField();
        scoreText.size = 30;
        scoreText.textColor = 0x000000;
        scoreText.text = '得分：' + score;
        scoreText.y = 40;
        scoreText.x = this.stageW - 200;
        gameView.addChild(scoreText);
        var reset = function () {
            _this.expressionScore = 0;
            _this.useTime = 0;
            faceView.touchChildren = true;
            faceView.touchEnabled = true;
            backBtn.touchEnabled = true;
            clearTimeout(_this.timer);
            _this.gameTime = GAME_TIME_SECOUND;
            score = 0;
            scoreText.text = '得分：' + score;
            gameSecound.text = _this.gameTime + '';
            resultView.changeScore(0);
            if (resultView.view.parent) {
                resultView.view.parent.removeChild(resultView.view);
            }
            _this.playing = true;
            gameTimeOut(timeOutEmit);
        };
        var perfectText = this.showText(gameView, 'PERFECT', 0xCC00FF, 0xCC99FF);
        var goodText = this.showText(gameView, 'GOOD', 0xFA8072, 0xFFA500);
        var niceText = this.showText(gameView, 'NICE', 0x00BFFF, 0x87CEFA);
        var touchBread = function (event) {
            if (!_this.playing)
                return;
            var reward = 0;
            var needClearExpressionScore = false;
            _this.expressionScore += event.data;
            if (_this.useTime === 1) {
                if (_this.expressionScore >= 50) {
                    reward = 20;
                    SoundManager.getInstance().playLongShoutSound();
                    face.shyness();
                    face.openMouthAction();
                    _this.shakeView(gameView);
                    perfectText.show();
                }
                else if (_this.expressionScore >= 40) {
                    reward = 15;
                    SoundManager.getInstance().playShoutSound();
                    face.openMouthAction();
                    _this.shakeView(gameView);
                    goodText.show();
                }
                else if (_this.expressionScore >= 30) {
                    reward = 10;
                    SoundManager.getInstance().playNiceSound();
                    face.openMouthAction();
                    niceText.show();
                }
                // console.log(this.expressionScore);
                _this.expressionScore = 0;
                _this.useTime = 0;
            }
            score += event.data;
            scoreText.text = '得分：' + (score + reward);
        };
        intoRankView.view.addEventListener('finish', function (event) {
            gameView.removeChild(intoRankView.view);
            resultView.changeScore(event.data);
            gameView.addChild(resultView.view);
        }, intoRankView);
        gameView.addEventListener('startGame', reset, gameView);
        gameView.addEventListener('restart', reset, gameView);
        faceView.addEventListener('touchBread', touchBread, faceView);
        gameView.addEventListener('gameOver', function () { return __awaiter(_this, void 0, void 0, function () {
            var rank, historyScore;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.expressionScore = 0;
                        this.useTime = 0;
                        faceView.touchChildren = false;
                        faceView.touchEnabled = false;
                        backBtn.touchEnabled = false;
                        rank = -1;
                        if (!(score !== 0 && !IS_LOCAL)) return [3 /*break*/, 2];
                        Loading.getInstance().show();
                        return [4 /*yield*/, this.checkScoreIntoRank(score)];
                    case 1:
                        rank = _a.sent();
                        Loading.getInstance().hide();
                        _a.label = 2;
                    case 2:
                        if (rank !== -1) {
                            SoundManager.getInstance().playWoWSound();
                            intoRankView.changeScore(score);
                            intoRankView.changeRank(rank);
                            gameView.addChild(intoRankView.view);
                        }
                        else {
                            resultView.changeScore(score);
                            gameView.addChild(resultView.view);
                        }
                        historyScore = egret.localStorage.getItem(GAME_STORAGE_NAME);
                        if (historyScore) {
                            if (Number(score) > Number(historyScore)) {
                                egret.localStorage.setItem(GAME_STORAGE_NAME, score + '');
                            }
                        }
                        else {
                            egret.localStorage.setItem(GAME_STORAGE_NAME, score + '');
                        }
                        return [2 /*return*/];
                }
            });
        }); }, gameView);
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
            SoundManager.getInstance().playButtonSound();
            restartCb && restartCb.bind(_this)();
        }, restartBtn);
        backMenu.width = 500;
        backMenu.y = 380;
        backMenu.textAlign = egret.HorizontalAlign.CENTER;
        backMenu.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            SoundManager.getInstance().playButtonSound();
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
    Game.prototype.drawIntoRankView = function () {
        var _this = this;
        var _score = 0;
        // 最终得分
        var mask = new egret.Sprite();
        mask.zIndex = 999;
        mask.graphics.beginFill(0x000000, 0.4);
        mask.graphics.drawRect(0, 0, this.stageW, this.stageH);
        mask.graphics.endFill();
        var view = new egret.Sprite();
        view.graphics.lineStyle(5, 0x000000);
        view.graphics.beginFill(0xffffff);
        view.graphics.drawRoundRect(0, 0, 500, 500, 20, 20);
        view.x = this.stageW / 2 - 500 / 2;
        view.y = this.stageH / 2 - 500 / 2;
        view.graphics.endFill();
        var img = new eui.Image();
        img.source = "resource/assets/cd.png";
        img.width = 1028;
        img.height = 856;
        img.x = -300;
        img.y = 130;
        mask.addChild(img);
        var title = new egret.TextField();
        title.textColor = 0x000000;
        title.size = 35;
        title.text = '你的成绩进入排行榜啦～';
        title.width = 500;
        title.y = 40;
        title.textAlign = egret.HorizontalAlign.CENTER;
        view.addChild(title);
        var tips = new egret.TextField();
        tips.textColor = 0x000000;
        tips.size = 24;
        tips.width = 400;
        tips.y = 120;
        tips.x = 50;
        tips.lineSpacing = 10;
        tips.textAlign = egret.HorizontalAlign.CENTER;
        view.addChild(tips);
        var inputTips = new egret.TextField();
        inputTips.textColor = 0x000000;
        inputTips.text = '请在下面输入框输入你的名称';
        inputTips.size = 18;
        inputTips.width = 300;
        inputTips.y = 230;
        inputTips.x = 100;
        inputTips.textAlign = egret.HorizontalAlign.CENTER;
        view.addChild(inputTips);
        var input = new eui.TextInput();
        var exml = "<e:Skin class=\"skins.TextInputSkin\" minHeight=\"40\" minWidth=\"300\" states=\"normal,disabled,normalWithPrompt,disabledWithPrompt\" xmlns:e=\"http://ns.egret.com/eui\">\n            <e:Rect height=\"100%\" width=\"100%\" strokeColor=\"0x000000\" strokeWeight=\"2\" fillColor=\"0xffffff\"/>\n            <e:EditableText id=\"textDisplay\" verticalCenter=\"0\" left=\"10\" right=\"10\" textColor=\"0x000000\" textColor.disabled=\"0xff0000\" width=\"100%\" height=\"24\" size=\"20\" />\n            <e:Label id=\"promptDisplay\" verticalCenter=\"0\" left=\"10\" right=\"10\" textColor=\"0xa9a9a9\" width=\"100%\" height=\"24\" size=\"20\" touchEnabled=\"false\" includeIn=\"normalWithPrompt,disabledWithPrompt\"/>\n        </e:Skin>";
        input.skinName = exml;
        input.prompt = "请输入昵称";
        input.y = 260;
        input.x = 50;
        input.width = 400;
        input.height = 50;
        view.addChild(input);
        var validateTips = new egret.TextField();
        validateTips.textColor = 0xFF0000;
        validateTips.text = '请在上面输入框输入你的名称';
        validateTips.size = 18;
        validateTips.width = 300;
        validateTips.y = 320;
        validateTips.x = 100;
        validateTips.textAlign = egret.HorizontalAlign.CENTER;
        validateTips.alpha = 0;
        view.addChild(validateTips);
        var sureBtn = new egret.TextField();
        sureBtn.text = '确定';
        sureBtn.size = 24;
        sureBtn.touchEnabled = true;
        sureBtn.textColor = 0x000000;
        sureBtn.width = 100;
        sureBtn.y = 400;
        sureBtn.x = 100;
        sureBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () { return __awaiter(_this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!input.text) {
                            validateTips.alpha = 1;
                            return [2 /*return*/];
                        }
                        else {
                            validateTips.alpha = 0;
                        }
                        ;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, , 3, 4]);
                        Loading.getInstance().show();
                        return [4 /*yield*/, Http.PostRequest('/api/rank', { playerName: input.text, score: _score })];
                    case 2:
                        res = _a.sent();
                        localStorage.setItem(PLAYNAME_STORAGE_NAME, input.text);
                        Loading.getInstance().hide();
                        return [3 /*break*/, 4];
                    case 3:
                        SoundManager.getInstance().playButtonSound();
                        mask.dispatchEvent(new egret.Event('finish', false, false, _score));
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        }); }, sureBtn);
        view.addChild(sureBtn);
        var cancleBtn = new egret.TextField();
        cancleBtn.text = '取消';
        cancleBtn.size = 24;
        cancleBtn.touchEnabled = true;
        cancleBtn.textColor = 0x000000;
        cancleBtn.width = 100;
        cancleBtn.y = 400;
        cancleBtn.x = 350;
        cancleBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            SoundManager.getInstance().playButtonSound();
            mask.dispatchEvent(new egret.Event('finish', false, false, _score));
        }, cancleBtn);
        view.addChild(cancleBtn);
        mask.addChild(view);
        return {
            view: mask,
            changeRank: function (rank) {
                validateTips.alpha = 0;
                if (localStorage.getItem(PLAYNAME_STORAGE_NAME)) {
                    input.text = localStorage.getItem(PLAYNAME_STORAGE_NAME);
                }
                ;
                tips.textFlow = [
                    { text: "恭喜你进入排行榜第", style: { "textColor": 0x000000, "size": 24 } },
                    { text: " " + rank + " ", style: { "textColor": 0xFF4d4F, "size": 30, bold: true } },
                    { text: "名，留下你的", style: { "textColor": 0x000000, "size": 24 } },
                    { text: "「掘金昵称」", style: { "textColor": 0x007fff, "size": 24, bold: true } },
                    { text: "让更多人来挑战你吧", style: { "textColor": 0x000000, "size": 24 } },
                ];
            },
            changeScore: function (score) {
                _score = score;
            }
        };
    };
    Game.prototype.shakeView = function (view) {
        egret.Tween.get(view)
            .to({ x: -8 }, 50, egret.Ease.cubicInOut)
            .to({ x: 8 }, 50, egret.Ease.cubicInOut)
            .to({ x: -8 }, 50, egret.Ease.cubicInOut)
            .to({ x: 0 }, 50, egret.Ease.cubicInOut);
    };
    Game.prototype.showText = function (view, str, color, strokeColor) {
        var _this = this;
        var text = new egret.TextField;
        text.y = this.stageH * 0.28;
        text.width = this.stageW;
        text.height = 50;
        text.textAlign = egret.HorizontalAlign.CENTER;
        text.verticalAlign = egret.VerticalAlign.MIDDLE;
        text.textColor = color;
        text.text = str;
        text.size = 50;
        text.strokeColor = strokeColor;
        text.stroke = 4;
        text.alpha = 0;
        text.zIndex = 99;
        var show = function () {
            view.addChild(text);
            egret.Tween.get(text)
                .to({ alpha: 1, y: _this.stageH * 0.25 }, 300)
                .wait(200)
                .to({ alpha: 0, y: _this.stageH * 0.23 }, 300)
                .call(function () {
                text.y = _this.stageH * 0.28;
                view.removeChild(text);
            });
        };
        return { show: show };
    };
    Game.prototype.checkScoreIntoRank = function (score) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Http.PostRequest('/api/check-score', { score: score })];
                    case 1:
                        res = _a.sent();
                        if (res.success) {
                            return [2 /*return*/, res.data.rank];
                        }
                        return [2 /*return*/, -1];
                }
            });
        });
    };
    return Game;
}(egret.Sprite));
__reflect(Game.prototype, "Game", ["GameInterface"]);
