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
var BREAS_NUM = 40;
var BREAS_Y = 30;
var Bread = (function (_super) {
    __extends(Bread, _super);
    function Bread(breadParmas) {
        var _this = _super.call(this) || this;
        _this.faceX = 0;
        _this.faceY = 0;
        _this.breas = [];
        _this.touchBreadCb = function () { };
        _this.removeBear = function (brea) {
            return new Promise(function (resolve) {
                brea.touchEnabled = false;
                var tw = egret.Tween.get(brea);
                tw.to({ y: 50 }, 500)
                    .call(function () {
                    var breaIndex = _this.breas.indexOf(brea);
                    // 清除动画
                    egret.Tween.removeTweens(brea);
                    // 清除监听事件
                    brea.removeEventListener(egret.TouchEvent.TOUCH_TAP, _this.touchBear, brea);
                    brea.removeEventListener(egret.TouchEvent.TOUCH_MOVE, _this.touchBear, brea);
                    // 从画布上消失
                    brea.parent.removeChild(brea);
                    // 从数组中清除
                    _this.breas.splice(breaIndex, 1);
                    // 通知回收
                    brea = null;
                    resolve();
                });
            });
        };
        _this.touchBear = function (brea, face, event) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            var timer_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        //  小于30个胡子 及时补充
                        if (this.breas.length <= 30) {
                            timer_1 = setTimeout(function () {
                                var i = 0;
                                while (++i < 10) {
                                    _this.createBear(face);
                                }
                                clearTimeout(timer_1);
                            });
                        }
                        if (!brea.parent) return [3 /*break*/, 2];
                        this.touchBreadCb();
                        // 清除胡子
                        return [4 /*yield*/, this.removeBear(brea)];
                    case 1:
                        // 清除胡子
                        _a.sent();
                        // 再重新创建一条新胡子
                        this.createBear(face);
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); };
        _this.faceX = breadParmas.faceX;
        _this.faceY = breadParmas.faceY;
        if (_this.touchBreadCb) {
            _this.touchBreadCb = breadParmas.touchBreadCb;
        }
        return _this;
    }
    Bread.prototype.draw = function (face) {
        var otherBearSkin = new egret.Sprite();
        otherBearSkin.graphics.beginFill(0xf5f5f5);
        otherBearSkin.graphics.drawArc(this.faceX, this.faceY * 2, 250, 0, Math.PI, true);
        otherBearSkin.graphics.endFill();
        otherBearSkin.scaleY = 0.5;
        face.addChild(otherBearSkin);
        var beardSkin = new egret.Sprite();
        beardSkin.graphics.beginFill(0xf5f5f5);
        beardSkin.graphics.drawArc(this.faceX, this.faceY - 2, 250, 0, Math.PI, false);
        beardSkin.graphics.endFill();
        this.drawBears(beardSkin);
        face.addChild(beardSkin);
    };
    Bread.prototype.randPoint = function (r, centerX, centerY, tryCount) {
        if (tryCount === void 0) { tryCount = 0; }
        var theta = 2 * Math.PI * Math.random();
        var len = Math.sqrt(Math.random()) * r;
        var x = centerX + len * Math.cos(theta);
        var y = centerY + len * Math.sin(theta);
        // y值太大 重新绘制 重新绘制次数为3次 都为失败则不绘制
        if (y < this.faceY - BREAS_Y && tryCount != 3) {
            return this.randPoint(r, centerX, centerY, ++tryCount);
        }
        return [x, y];
    };
    Bread.prototype.drawBear = function (x, y, face) {
        var shp = new egret.Sprite();
        // 测试查看点击范围
        // shp.graphics.lineStyle(2,0x000000);
        shp.graphics.beginFill(0x000000, 0);
        shp.graphics.drawCircle(x >= this.faceX ? x - 20 : x - 10, y - 25, 50);
        var line = new egret.Shape();
        line.graphics.lineStyle(2, 0x000000);
        line.graphics.moveTo(x, y);
        line.graphics.lineTo(x >= this.faceX ? x - 10 : x + 10, y - 20);
        line.graphics.endFill();
        shp.zIndex = 99;
        shp.addChild(line);
        shp.graphics.endFill();
        shp.touchEnabled = true;
        shp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchBear.bind(this, shp, face), shp);
        shp.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchBear.bind(this, shp, face), shp);
        return shp;
    };
    Bread.prototype.createBear = function (face) {
        var _a = this.randPoint(250, this.faceX, this.faceY), x = _a[0], y = _a[1];
        if (y > this.faceY - BREAS_Y) {
            var brea = this.drawBear(x, y, face);
            this.breas.push(brea);
            face.addChild(brea);
        }
    };
    Bread.prototype.drawBears = function (face) {
        var count = 0;
        for (var i = 0; i < BREAS_NUM; i++) {
            this.createBear(face);
        }
    };
    return Bread;
}(egret.Sprite));
__reflect(Bread.prototype, "Bread", ["BreadInterface"]);
//# sourceMappingURL=Bread.js.map