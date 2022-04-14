var BASE_URL = 'http://localhost:3000';
// 本地环境 无服务器环境
var IS_LOCAL = true;
var Http;
(function (Http) {
    // 数据处理
    function querify(object) {
        if (object === void 0) { object = {}; }
        var keys = Object.keys(object);
        var result = keys.reduce(function (prev, current) {
            prev += "&" + current + "=" + object[current];
            return prev;
        }, '').slice(1);
        return result;
    }
    function PostRequest(uri, params) {
        var _this = this;
        if (params === void 0) { params = {}; }
        return new Promise(function (resolve, reject) {
            var request = new egret.HttpRequest();
            request.responseType = egret.HttpResponseType.TEXT;
            // 设置为POST请求
            request.open(BASE_URL + uri, egret.HttpMethod.POST);
            request.setRequestHeader("Accept", "application/json");
            request.setRequestHeader("Content-Type", "application/json");
            var keys = Object.keys(params);
            request.send(JSON.stringify(params));
            request.addEventListener(egret.Event.COMPLETE, function (event) {
                var request = event.currentTarget;
                var res = JSON.parse(request.response);
                resolve(res);
            }, _this);
            request.addEventListener(egret.IOErrorEvent.IO_ERROR, function (event) {
                var res = JSON.parse(request.response);
                // 关闭全局加载
                Loading.getInstance().hide();
                alert(res.errmsg);
                reject(res);
            }, _this);
        });
    }
    Http.PostRequest = PostRequest;
    function GetRequest(uri) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var request = new egret.HttpRequest();
            request.responseType = egret.HttpResponseType.TEXT;
            request.open(BASE_URL + uri, egret.HttpMethod.GET);
            request.send();
            request.addEventListener(egret.Event.COMPLETE, function (event) {
                var request = event.currentTarget;
                var res = JSON.parse(request.response);
                resolve(res);
            }, _this);
            request.addEventListener(egret.IOErrorEvent.IO_ERROR, function (event) {
                var res = JSON.parse(request.response);
                // 关闭全局加载
                Loading.getInstance().hide();
                alert(res.errmsg);
                reject(event);
            }, _this);
        });
    }
    Http.GetRequest = GetRequest;
})(Http || (Http = {}));
