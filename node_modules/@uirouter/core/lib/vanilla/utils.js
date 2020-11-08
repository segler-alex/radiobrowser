"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.locationPluginFactory = exports.buildUrl = exports.parseUrl = exports.getParams = exports.keyValsToObjectR = void 0;
var common_1 = require("../common");
exports.keyValsToObjectR = function (accum, _a) {
    var key = _a[0], val = _a[1];
    if (!accum.hasOwnProperty(key)) {
        accum[key] = val;
    }
    else if (common_1.isArray(accum[key])) {
        accum[key].push(val);
    }
    else {
        accum[key] = [accum[key], val];
    }
    return accum;
};
exports.getParams = function (queryString) {
    return queryString.split('&').filter(common_1.identity).map(common_1.splitEqual).reduce(exports.keyValsToObjectR, {});
};
function parseUrl(url) {
    var orEmptyString = function (x) { return x || ''; };
    var _a = common_1.splitHash(url).map(orEmptyString), beforehash = _a[0], hash = _a[1];
    var _b = common_1.splitQuery(beforehash).map(orEmptyString), path = _b[0], search = _b[1];
    return { path: path, search: search, hash: hash, url: url };
}
exports.parseUrl = parseUrl;
exports.buildUrl = function (loc) {
    var path = loc.path();
    var searchObject = loc.search();
    var hash = loc.hash();
    var search = Object.keys(searchObject)
        .map(function (key) {
        var param = searchObject[key];
        var vals = common_1.isArray(param) ? param : [param];
        return vals.map(function (val) { return key + '=' + val; });
    })
        .reduce(common_1.unnestR, [])
        .join('&');
    return path + (search ? '?' + search : '') + (hash ? '#' + hash : '');
};
function locationPluginFactory(name, isHtml5, serviceClass, configurationClass) {
    return function (uiRouter) {
        var service = (uiRouter.locationService = new serviceClass(uiRouter));
        var configuration = (uiRouter.locationConfig = new configurationClass(uiRouter, isHtml5));
        function dispose(router) {
            router.dispose(service);
            router.dispose(configuration);
        }
        return { name: name, service: service, configuration: configuration, dispose: dispose };
    };
}
exports.locationPluginFactory = locationPluginFactory;
//# sourceMappingURL=utils.js.map