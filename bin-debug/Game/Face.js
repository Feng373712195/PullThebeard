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
var Face = (function (_super) {
    __extends(Face, _super);
    function Face(faceParmas) {
        var _this = _super.call(this) || this;
        _this.faceX = 0;
        _this.faceY = 0;
        _this.faceX = faceParmas.x;
        _this.faceY = faceParmas.y;
        return _this;
    }
    Face.prototype.draw = function () {
        var _this = this;
        var face = this.drawFace();
        var openMouth = this.drawOpenMouth();
        this.openMouthAction = this.openMouthAction.bind(this, face, openMouth);
        var touchBreadEvent = new egret.Event('touchBread');
        // 在脸上画胡子
        var bread = new Bread({ faceX: this.faceX, faceY: this.faceY, touchBreadCb: function () {
                face.dispatchEvent(touchBreadEvent);
                _this.openMouthAction();
            } });
        bread.draw(face);
        this.drawEyes(face);
        this.drawMouth(face);
        face.touchEnabled = true;
        return face;
    };
    Face.prototype.drawEyes = function (face) {
        for (var i = 0; i < 2; i++) {
            var eyebrow = new egret.Sprite();
            var eyeball = new egret.Sprite();
            // drawing the eyebrow to the face
            eyebrow.graphics.lineStyle(2, 0x000000);
            eyebrow.graphics.drawArc(this.faceX - 75 / 2 + (i * 150 / 2), this.faceY - 200, 10, 0, Math.PI, false);
            eyebrow.graphics.endFill();
            face.addChild(eyebrow);
            // drawing the eyeball to the face
            eyeball.graphics.beginFill(0x000000);
            // x faceWitdh - 眼距/2 + (i * 眼距)
            eyeball.graphics.drawCircle(this.faceX - 75 + (i * 150), this.faceY - 150, 10);
            eyeball.graphics.endFill();
            face.addChild(eyeball);
        }
    };
    Face.prototype.drawMouth = function (face) {
        var mouth = new egret.Sprite();
        mouth.graphics.lineStyle(2, 0x000000);
        mouth.graphics.drawArc(this.faceX, this.faceY - 100, 20, 0, Math.PI, true);
        mouth.graphics.endFill();
        face.addChild(mouth);
    };
    Face.prototype.drawOpenMouth = function () {
        var openMouth = new egret.Sprite();
        openMouth.graphics.lineStyle(2, 0x000000);
        openMouth.graphics.beginFill(0xff00000);
        openMouth.graphics.drawCircle(this.faceX, this.faceY - 100, 20);
        openMouth.graphics.endFill();
        return openMouth;
    };
    Face.prototype.drawFace = function () {
        var face = new egret.Sprite();
        face.graphics.lineStyle(2, 0x000000);
        face.graphics.beginFill(0xffffff);
        face.graphics.drawCircle(this.faceX, this.faceY, 250);
        face.graphics.endFill();
        face.touchEnabled = true;
        return face;
    };
    Face.prototype.openMouthAction = function (face, adder) {
        face.addChild(adder);
        var timer = setTimeout(function () {
            if (adder.parent) {
                adder.parent.removeChild(adder);
            }
            clearTimeout(timer);
        }, 300);
    };
    return Face;
}(egret.Sprite));
__reflect(Face.prototype, "Face", ["FaceInterface"]);
//# sourceMappingURL=Face.js.map