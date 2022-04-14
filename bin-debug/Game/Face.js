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
        this.face = this.drawFace();
        this.openMouth = this.drawOpenMouth();
        this.shynessFace = this.drawShyness();
        var bread = new Beards({
            faceX: this.faceX,
            faceY: this.faceY,
            touchBreadCb: function (breadNum) { return _this.face.dispatchEvent(new egret.Event('touchBread', false, false, breadNum)); }
        });
        this.drawBeardSkin(this.face);
        this.drawFaceLine(this.face);
        this.eyes = this.drawEyes(this.face);
        this.drawMouth(this.face);
        // 在脸上画胡子
        bread.draw(this.face);
        this.face.touchEnabled = true;
        this.face.addEventListener(egret.TouchEvent.TOUCH_MOVE, function () {
            SoundManager.getInstance().palyPullShoutSound();
        }, this.face);
        this.face.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function () {
            SoundManager.getInstance().palyPullShoutSound();
        }, this.face);
        this.face.addEventListener(egret.TouchEvent.TOUCH_END, function () {
            SoundManager.getInstance().stopPullShoutSound();
        }, this.face);
        this.face.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, function () {
            SoundManager.getInstance().stopPullShoutSound();
        }, this.face);
        return this.face;
    };
    Face.prototype.drawEyes = function (face) {
        var eyeballs = [];
        var eyebrows = [];
        for (var i = 0; i < 2; i++) {
            var eyebrow = new egret.Sprite();
            var eyeball = new egret.Sprite();
            eyebrows.push(eyebrow);
            eyeballs.push(eyeball);
            var eyebrowX = this.faceX - 75 / 2 + (i * 150 / 2);
            var eyebrowY = this.faceY - 200;
            // drawing the eyebrow to the face
            eyebrow.x = eyebrowX;
            eyebrow.y = eyebrowY;
            eyebrow.$anchorOffsetX = eyebrowX;
            eyebrow.$anchorOffsetY = eyebrowY;
            eyebrow.graphics.lineStyle(4, 0x000000);
            eyebrow.graphics.drawArc(eyebrowX, eyebrowY, 10, 0, Math.PI, false);
            eyebrow.graphics.endFill();
            eyebrow.rotation = 180;
            face.addChild(eyebrow);
            // x faceWitdh - 眼距/2 + (i * 眼距)
            var eyeballX = this.faceX - 75 + (i * 150);
            var eyeballY = this.faceY - 150;
            eyeball.x = eyeballX;
            eyeball.y = eyeballY;
            eyeball.$anchorOffsetX = eyeballX;
            eyeball.$anchorOffsetY = eyeballY;
            // drawing the eyeball to the face
            eyeball.graphics.beginFill(0x000000);
            eyeball.graphics.drawCircle(eyeballX, eyeballY, 12);
            eyeball.graphics.endFill();
            var tw = egret.Tween.get(eyeball, { loop: true, })
                .wait(2000)
                .to({ scaleY: 0.1 }, 100, egret.Ease.cubicInOut)
                .to({ scaleY: 1 }, 100, egret.Ease.cubicInOut);
            face.addChild(eyeball);
        }
        return { eyeballs: eyeballs, eyebrows: eyebrows };
    };
    Face.prototype.drawMouth = function (face) {
        var mouth = new egret.Sprite();
        mouth.graphics.lineStyle(4, 0x000000);
        mouth.graphics.drawArc(this.faceX, this.faceY - 100, 20, 0, Math.PI, true);
        mouth.graphics.endFill();
        face.addChild(mouth);
    };
    Face.prototype.drawFaceLine = function (face) {
        var faceLine = new egret.Sprite();
        faceLine.graphics.lineStyle(4, 0xFFA500);
        faceLine.graphics.drawCircle(this.faceX, this.faceY, 250);
        faceLine.graphics.endFill();
        face.addChild(faceLine);
    };
    Face.prototype.drawBeardSkin = function (face) {
        var otherBearSkin = new egret.Sprite();
        otherBearSkin.graphics.beginFill(0xf5f5f5);
        otherBearSkin.graphics.drawArc(this.faceX, this.faceY * 2, 250, 0, Math.PI, true);
        otherBearSkin.graphics.endFill();
        otherBearSkin.scaleY = 0.5;
        face.addChild(otherBearSkin);
        var beardSkin = new egret.Sprite();
        beardSkin.graphics.beginFill(0xf5f5f5);
        beardSkin.graphics.drawArc(this.faceX, this.faceY, 250, 0, Math.PI, false);
        beardSkin.graphics.endFill();
        face.addChild(beardSkin);
    };
    Face.prototype.drawOpenMouth = function () {
        var openMouth = new egret.Sprite();
        openMouth.graphics.lineStyle(4, 0x000000);
        openMouth.graphics.beginFill(0xff00000);
        openMouth.graphics.drawCircle(this.faceX, this.faceY - 100, 20);
        openMouth.graphics.endFill();
        return openMouth;
    };
    Face.prototype.drawFace = function () {
        var face = new egret.Sprite();
        face.x = this.faceX;
        face.y = this.faceY;
        face.$anchorOffsetX = this.faceX;
        face.$anchorOffsetY = this.faceY;
        face.graphics.beginFill(0xFFEFD5);
        face.graphics.drawCircle(this.faceX, this.faceY, 250);
        face.touchEnabled = true;
        var tw = egret.Tween.get(face, { loop: true })
            .to({ scaleX: 1.01, scaleY: 1.01 }, 1000, egret.Ease.cubicInOut)
            .to({ scaleX: 1, scaleY: 1 }, 1000, egret.Ease.cubicInOut);
        return face;
    };
    Face.prototype.drawShyness = function () {
        var shynessFace = new egret.Sprite();
        var y = this.faceY - 113;
        for (var i = 0; i < 2; i++) {
            for (var i2 = 0; i2 < 3; i2++) {
                var lineX = this.faceX - 85 + (i2 * 10) + (i * 155);
                var line = new egret.Shape();
                line.x = lineX;
                line.y = y;
                line.anchorOffsetX = lineX;
                line.anchorOffsetY = y;
                line.graphics.lineStyle(4, 0xFFB6C1);
                line.graphics.moveTo(lineX, y - 8);
                line.graphics.lineTo(lineX - 4, y);
                line.graphics.endFill();
                shynessFace.addChild(line);
            }
        }
        return shynessFace;
    };
    Face.prototype.shyness = function () {
        var _this = this;
        this.face.addChild(this.shynessFace);
        this.eyes.eyebrows.forEach(function (i) { return i.rotation = 0; });
        var timer = setTimeout(function () {
            _this.eyes.eyebrows.forEach(function (i) { return i.rotation = 180; });
            if (_this.shynessFace.parent)
                _this.shynessFace.parent.removeChild(_this.shynessFace);
            clearTimeout(timer);
        }, 600);
    };
    Face.prototype.openMouthAction = function () {
        var _this = this;
        this.face.addChild(this.openMouth);
        var timer = setTimeout(function () {
            if (_this.openMouth.parent)
                _this.openMouth.parent.removeChild(_this.openMouth);
            clearTimeout(timer);
        }, 300);
    };
    return Face;
}(egret.Sprite));
__reflect(Face.prototype, "Face", ["FaceInterface"]);
