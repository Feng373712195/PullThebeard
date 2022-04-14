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
// 300
// 100
var BREAS_NUM = 100;
var MIN_BREAS_NUM = Math.floor(BREAS_NUM * 0.8);
var BREAS_Y = 50;
// 设置p2.js 和 egret 二者距离的度量转换比例
// p2.js 单位MKS（米 千克 秒）egret是像素px
// 可理解为p2.js的一米长度是egret中屏幕的50px
var factor = 50;
var Beards = (function (_super) {
    __extends(Beards, _super);
    function Beards(beardParmas) {
        var _this = _super.call(this) || this;
        _this.faceX = 0;
        _this.faceY = 0;
        _this.beards = [];
        // 胡子对象池
        _this.beardsPool = [];
        _this.touchBreadCb = function () { };
        _this.removeBeard = function (beardItem) {
            var beardIndex = -1;
            beardItem.drop = true;
            var beard = beardItem.shape;
            beard.$touchEnabled = false;
            // 600ms 为给胡子掉落的动画时间
            return new Promise(function (resolve) {
                var timer = setTimeout(function () {
                    var beardIndex = _this.beards.indexOf(beardItem);
                    // 停止掉落动画计算
                    beardItem.drop = false;
                    // 清除动画
                    egret.Tween.removeTweens(beardItem.line);
                    // 胡子从画布上消失
                    beardItem.shape.parent.removeChild(beardItem.shape);
                    // 从胡子数组中移除
                    _this.beards.splice(beardIndex, 1);
                    // 加入胡子对象池
                    _this.beardsPool.push(beardItem);
                    clearTimeout(timer);
                    resolve();
                }, 600);
            });
        };
        _this.touchBeard = function (beardItem, face, event) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            var nearBeards, verticalDirection, horizontalDirection, timer_1;
            return __generator(this, function (_a) {
                nearBeards = this.findClosestBeards(event.$stageX, event.$stageY);
                verticalDirection = event.$stageY > Beards.touchPositionRecrod.y ? -1 : 1;
                horizontalDirection = event.$stageX > Beards.touchPositionRecrod.x ? 1 : -1;
                Beards.touchPositionRecrod = { x: event.$stageX, y: event.$stageY };
                this.touchBreadCb(nearBeards.length);
                nearBeards.forEach(function (beard) {
                    beard.body.applyForceLocal([0.1 * horizontalDirection, 0.1 * verticalDirection], [beardItem.shape.x / factor, beardItem.shape.y / factor]);
                    // 清除胡子
                    _this.removeBeard(beard)
                        .then(function () {
                        // 再重新创建一条新胡子
                        _this.createBear(face, true);
                    });
                });
                //  小于胡子的最小数量时及时补充
                if (this.beards.length < (BREAS_NUM * 0.9)) {
                    timer_1 = setTimeout(function () {
                        // 每次只补充10条
                        var i = 0;
                        while (++i < BREAS_NUM - _this.beards.length)
                            _this.createBear(face);
                        clearTimeout(timer_1);
                    });
                }
                return [2 /*return*/];
            });
        }); };
        _this.faceX = beardParmas.faceX;
        _this.faceY = beardParmas.faceY;
        if (_this.touchBreadCb) {
            _this.touchBreadCb = beardParmas.touchBreadCb;
        }
        _this.word = new p2.World({ gravity: [0, 0.01] });
        _this.word.sleepMode = p2.World.BODY_SLEEPING;
        _this.addEventListener(egret.Event.ENTER_FRAME, _this.Update, _this);
        return _this;
    }
    Beards.prototype.Update = function () {
        this.word.step(2.5);
        this.beards.filter(function (i) { return i.drop; }).forEach(function (i) {
            // console.log(i.shape.x , i.shape.y , i.body.position[0] * factor , i.body.position[1] * factor);
            if (Math.floor(i.shape.x) !== Math.floor(i.body.position[0] * factor))
                i.shape.x = i.body.position[0] * factor;
            if (Math.floor(i.shape.y) !== Math.floor(i.body.position[1] * factor))
                i.shape.y = i.body.position[1] * factor;
        });
    };
    Beards.prototype.draw = function (face) {
        this.drawBeards(face);
        face.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchStart, face);
    };
    Beards.prototype.drawBeard = function (x, y, face) {
        var boxShape = new p2.Box({ radius: 20 / factor });
        var boxBody = new p2.Body({
            mass: 1,
            position: [x / factor, y / factor],
            collisionResponse: false,
            ccdIterations: false
        });
        boxBody.addShape(boxShape);
        var shp = new egret.Sprite();
        shp.x = x;
        shp.y = y;
        shp.anchorOffsetX = x;
        shp.anchorOffsetY = y;
        var beardAngle = Math.atan2(this.faceY * 0.5 - y, this.faceX - x) * 180 / Math.PI;
        shp.rotation = beardAngle - 90;
        // 测试查看点击范围
        // shp.graphics.lineStyle(2,0x000000);
        shp.graphics.beginFill(0x000000, 0);
        shp.graphics.drawCircle(x, y - 8, 40);
        shp.graphics.endFill();
        shp.touchEnabled = true;
        var line = new egret.Shape();
        line.x = x;
        line.y = y;
        line.anchorOffsetX = x;
        line.anchorOffsetY = y;
        // 0x696969
        line.graphics.lineStyle(2, 0x000000);
        var lineExtlong = (y / 100) > 5.5 ? Math.floor((y / 100) * 0.5) : 0;
        line.graphics.moveTo(x, y - (5 + lineExtlong));
        line.graphics.lineTo(x, y);
        line.graphics.endFill();
        line.scaleY = 0;
        var tw = egret.Tween.get(line);
        tw.to({ scaleY: 1 }, 300, egret.Ease.backInOut);
        shp.addChild(line);
        this.word.addBody(boxBody);
        boxBody.displays = [shp];
        var beardItem = { shape: shp, line: line, body: boxBody, drop: false, };
        shp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchBeard.bind(this, beardItem, face), shp, true);
        shp.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchBeard.bind(this, beardItem, face), shp, true);
        return beardItem;
    };
    Beards.prototype.reDrawBear = function (x, y, face) {
        var beard = this.beardsPool.pop();
        beard.body.position[0] = x / factor;
        beard.body.position[1] = y / factor;
        beard.shape.graphics.clear();
        beard.shape.touchEnabled = true;
        beard.shape.x = x;
        beard.shape.y = y;
        beard.shape.$anchorOffsetX = x;
        beard.shape.$anchorOffsetY = y;
        var beardAngle = Math.atan2(this.faceY * 0.5 - y, this.faceX - x) * 180 / Math.PI;
        beard.shape.rotation = beardAngle - 90;
        beard.shape.graphics.clear();
        // beard.shape.graphics.lineStyle( 2, 0x000000 );
        beard.shape.graphics.beginFill(0x000000, 0);
        beard.shape.graphics.drawCircle(x, y - 8, 40);
        beard.shape.graphics.endFill();
        beard.line.$alpha = 1;
        beard.line.graphics.clear();
        beard.line.x = x;
        beard.line.y = y;
        beard.line.anchorOffsetX = x;
        beard.line.anchorOffsetY = y;
        // 0x696969
        beard.line.graphics.lineStyle(2, 0x000000);
        var lineExtlong = (y / 100) > 5.5 ? Math.floor((y / 100) * 0.5) : 0;
        beard.line.graphics.moveTo(x, y - (5 + lineExtlong));
        beard.line.graphics.lineTo(x, y);
        beard.line.graphics.endFill();
        beard.line.scaleY = 0;
        var tw = egret.Tween.get(beard.line);
        tw.to({ scaleY: 1 }, 300, egret.Ease.backInOut);
        beard.shape.addChild(beard.line);
        return beard;
    };
    Beards.prototype.findClosestBeards = function (x, y) {
        var nearBeards = this.beards.filter(function (beard) {
            if (beard.drop)
                return false;
            var distance = Math.abs(Math.sqrt(Math.pow(x - beard.line.x, 2) + Math.pow(y - beard.line.y, 2)));
            return distance <= 25;
        });
        return nearBeards;
    };
    // https://zhuanlan.zhihu.com/p/447898464 在圆中均匀分布随机点
    Beards.prototype.randomPoint = function (r, centerX, centerY, tryCount) {
        if (tryCount === void 0) { tryCount = 0; }
        var theta = 2 * Math.PI * Math.random();
        var len = Math.sqrt(Math.random()) * r;
        var x = centerX + len * Math.cos(theta);
        var y = centerY + len * Math.sin(theta);
        // y值太大 重新绘制 重新绘制次数为3次 都为失败则不绘制
        if (y < this.faceY - BREAS_Y && tryCount != 3) {
            return this.randomPoint(r, centerX, centerY, ++tryCount);
        }
        return [x, y];
    };
    Beards.prototype.createBear = function (face, usePool) {
        if (usePool === void 0) { usePool = false; }
        var _a = this.randomPoint(250, this.faceX, this.faceY), x = _a[0], y = _a[1];
        if (y > this.faceY - BREAS_Y) {
            var beard = usePool ? this.reDrawBear(x, y, face) : this.drawBeard(x, y, face);
            this.beards.push(beard);
            face.addChild(beard.shape);
        }
    };
    Beards.prototype.drawBeards = function (face) {
        var count = 0;
        for (var i = 0; i < BREAS_NUM; i++) {
            this.createBear(face);
        }
    };
    Beards.prototype.touchStart = function (event) {
        Beards.touchPositionRecrod = { x: event.$stageX, y: event.$stageY };
    };
    return Beards;
}(egret.Sprite));
__reflect(Beards.prototype, "Beards", ["BeardInterface"]);
