var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
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
// 游戏音乐默认开启
var musicIsPlay = true;
if (localStorage.getItem('musicPlay')) {
    musicIsPlay = localStorage.getItem('musicPlay') === '1' ? true : false;
}
else {
    localStorage.setItem('musicPlay', '1');
}
var SoundManager = (function () {
    function SoundManager() {
        this.soundMap = {};
        // 准备开始声
        // 待补充 按钮选择声 ｜  | 出现结果音效
        // 在音乐加载后进行播放
        this.bgSoundPlaying = false;
    }
    SoundManager.getInstance = function () {
        if (!SoundManager.shared) {
            SoundManager.shared = new SoundManager();
        }
        return SoundManager.shared;
    };
    Object.defineProperty(SoundManager, "musicIsPlay", {
        get: function () {
            return musicIsPlay;
        },
        set: function (value) {
            musicIsPlay = value;
            localStorage.setItem('musicPlay', value ? '1' : '0');
        },
        enumerable: true,
        configurable: true
    });
    SoundManager.prototype.loadSound = function (url) {
        var sound = new egret.Sound();
        sound.addEventListener(egret.IOErrorEvent.IO_ERROR, function loadError(event) {
            console.log("loaded error!");
            alert('背景音乐加载失败');
        }, this);
        sound.load(url);
        return sound;
    };
    SoundManager.prototype.playSound = function (soundKey, loops, resourceSrc, start) {
        if (start === void 0) { start = 0; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var sound, soundChannel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sound = null;
                        soundChannel = null;
                        if (!!this.soundMap[soundKey]) return [3 /*break*/, 2];
                        this.soundMap[soundKey] = { sound: sound, soundChannel: soundChannel, play: true, playing: true };
                        sound = this.loadSound(resourceSrc);
                        return [4 /*yield*/, new Promise(function (resolve) {
                                sound.addEventListener(egret.Event.COMPLETE, function () {
                                    if (_this.soundMap[soundKey].play)
                                        soundChannel = sound.play(start, loops);
                                    resolve(soundChannel);
                                }, null);
                            })];
                    case 1:
                        soundChannel = _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        sound = this.soundMap[soundKey].sound;
                        // 加载完毕之后才可以播放
                        // egret.Sound 类型定义没有加入loaded属性，这里只能暂时设置为any
                        if (!sound.loaded)
                            return [2 /*return*/];
                        soundChannel = sound.play(start, loops);
                        _a.label = 3;
                    case 3:
                        if (loops === 1) {
                            // 音频播放完毕后 音频playing设置为false
                            soundChannel.addEventListener(egret.Event.SOUND_COMPLETE, function () {
                                _this.soundMap[soundKey].playing = false;
                            }, null);
                        }
                        this.soundMap[soundKey] = { sound: sound, soundChannel: soundChannel, play: this.soundMap[soundKey].play, playing: true };
                        return [2 /*return*/, this.soundMap[soundKey]];
                }
            });
        });
    };
    SoundManager.prototype.playButtonSound = function () {
        return __awaiter(this, void 0, void 0, function () {
            var soundChannel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!SoundManager.musicIsPlay)
                            return [2 /*return*/];
                        return [4 /*yield*/, this.playSound('button', 1, 'resource/sounds/button.wav')];
                    case 1:
                        soundChannel = (_a.sent()).soundChannel;
                        soundChannel.volume = 0.3;
                        return [2 /*return*/];
                }
            });
        });
    };
    SoundManager.prototype.playStartSound = function () {
        return __awaiter(this, void 0, void 0, function () {
            var soundChannel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!SoundManager.musicIsPlay)
                            return [2 /*return*/];
                        return [4 /*yield*/, this.playSound('start', 1, 'resource/sounds/start.wav', 0.2)];
                    case 1:
                        soundChannel = (_a.sent()).soundChannel;
                        soundChannel.volume = 0.3;
                        return [2 /*return*/];
                }
            });
        });
    };
    SoundManager.prototype.playWoWSound = function () {
        return __awaiter(this, void 0, void 0, function () {
            var soundChannel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!SoundManager.musicIsPlay)
                            return [2 /*return*/];
                        return [4 /*yield*/, this.playSound('wowShout', 1, 'resource/sounds/wow.wav')];
                    case 1:
                        soundChannel = (_a.sent()).soundChannel;
                        soundChannel.volume = 0.1;
                        return [2 /*return*/];
                }
            });
        });
    };
    SoundManager.prototype.playNiceSound = function () {
        return __awaiter(this, void 0, void 0, function () {
            var soundChannel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!SoundManager.musicIsPlay)
                            return [2 /*return*/];
                        return [4 /*yield*/, this.playSound('niceShout', 1, 'resource/sounds/nice.wav')];
                    case 1:
                        soundChannel = (_a.sent()).soundChannel;
                        soundChannel.volume = 0.1;
                        return [2 /*return*/];
                }
            });
        });
    };
    SoundManager.prototype.playShoutSound = function () {
        return __awaiter(this, void 0, void 0, function () {
            var soundChannel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!SoundManager.musicIsPlay)
                            return [2 /*return*/];
                        // 防止频繁播放
                        if (this.soundMap['shout'] && this.soundMap['shout'].playing)
                            return [2 /*return*/];
                        return [4 /*yield*/, this.playSound('shout', 1, 'resource/sounds/shout.wav')];
                    case 1:
                        soundChannel = (_a.sent()).soundChannel;
                        soundChannel.volume = 0.1;
                        return [2 /*return*/];
                }
            });
        });
    };
    SoundManager.prototype.playLongShoutSound = function () {
        return __awaiter(this, void 0, void 0, function () {
            var soundChannel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!SoundManager.musicIsPlay)
                            return [2 /*return*/];
                        return [4 /*yield*/, this.playSound('longShout', 1, 'resource/sounds/longShout.wav')];
                    case 1:
                        soundChannel = (_a.sent()).soundChannel;
                        soundChannel.volume = 0.1;
                        return [2 /*return*/];
                }
            });
        });
    };
    SoundManager.prototype.palyPullShoutSound = function () {
        return __awaiter(this, void 0, void 0, function () {
            var soundChannel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!SoundManager.musicIsPlay)
                            return [2 /*return*/];
                        if (this.soundMap['pullShount'] && this.soundMap['pullShount'].playing)
                            return [2 /*return*/];
                        return [4 /*yield*/, this.playSound('pullShount', 0, 'resource/sounds/pullShout.wav')
                            /*
                             * 这么写是因为 这个音效是在 touchStart事件播放 和 touchEnd事件停止播放
                             * 第一次执行音效可能还没加载完成，就已经触发完了touchEnd 。导致触发touchEnd后，音效才加载完成然后播放
                             * playSound 中在音效加载事件中判断 play 是否要播放，
                             * 如果加载完毕之前已经触发touchEnd了 play会变为false则不会播放音效 soundChannel 也会是null
                             */
                        ];
                    case 1:
                        soundChannel = (_a.sent()).soundChannel;
                        /*
                         * 这么写是因为 这个音效是在 touchStart事件播放 和 touchEnd事件停止播放
                         * 第一次执行音效可能还没加载完成，就已经触发完了touchEnd 。导致触发touchEnd后，音效才加载完成然后播放
                         * playSound 中在音效加载事件中判断 play 是否要播放，
                         * 如果加载完毕之前已经触发touchEnd了 play会变为false则不会播放音效 soundChannel 也会是null
                         */
                        if (!this.soundMap['pullShount'].soundChannel)
                            return [2 /*return*/];
                        soundChannel.volume = 0.2;
                        this.soundMap['pullShount'].play = true;
                        this.soundMap['pullShount'].playing = true;
                        return [2 /*return*/];
                }
            });
        });
    };
    SoundManager.prototype.stopPullShoutSound = function () {
        if (!SoundManager.musicIsPlay)
            return;
        if (!this.soundMap['pullShount'])
            return;
        if (this.soundMap['pullShount'].soundChannel)
            this.soundMap['pullShount'].soundChannel.stop();
        this.soundMap['pullShount'].play = false;
        this.soundMap['pullShount'].playing = false;
    };
    SoundManager.prototype.playBgSound = function () {
        return __awaiter(this, void 0, void 0, function () {
            var soundChannel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!SoundManager.musicIsPlay)
                            return [2 /*return*/];
                        if (this.soundMap['bg'] && this.soundMap['bg'].playing)
                            return [2 /*return*/];
                        return [4 /*yield*/, this.playSound('bg', 0, 'resource/sounds/bg.mp3')];
                    case 1:
                        soundChannel = (_a.sent()).soundChannel;
                        soundChannel.volume = 0.3;
                        return [2 /*return*/];
                }
            });
        });
    };
    SoundManager.prototype.stopBgSound = function () {
        if (!SoundManager.musicIsPlay)
            return;
        this.soundMap['bg'].soundChannel.stop();
        this.soundMap['bg'].playing = false;
    };
    return SoundManager;
}());
__reflect(SoundManager.prototype, "SoundManager");
