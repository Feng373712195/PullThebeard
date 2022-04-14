var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Loading = (function () {
    function Loading() {
        this.loading = document.querySelector('.loading');
        this.loading_text = this.loading.querySelector('.text');
    }
    Loading.getInstance = function () {
        if (!Loading.shared) {
            Loading.shared = new Loading();
        }
        return Loading.shared;
    };
    Loading.prototype.show = function (text) {
        if (text) {
            this.loading_text['innerText'] = text;
        }
        else {
            this.loading_text['innerText'] = '加载中';
        }
        this.loading['style'].display = 'flex';
    };
    Loading.prototype.hide = function () {
        this.loading['style'].display = 'none';
    };
    return Loading;
}());
__reflect(Loading.prototype, "Loading");
