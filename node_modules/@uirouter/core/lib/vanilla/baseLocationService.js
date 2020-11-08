"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseLocationServices = void 0;
var common_1 = require("../common");
var utils_1 = require("./utils");
/** A base `LocationServices` */
var BaseLocationServices = /** @class */ (function () {
    function BaseLocationServices(router, fireAfterUpdate) {
        var _this = this;
        this.fireAfterUpdate = fireAfterUpdate;
        this._listeners = [];
        this._listener = function (evt) { return _this._listeners.forEach(function (cb) { return cb(evt); }); };
        this.hash = function () { return utils_1.parseUrl(_this._get()).hash; };
        this.path = function () { return utils_1.parseUrl(_this._get()).path; };
        this.search = function () { return utils_1.getParams(utils_1.parseUrl(_this._get()).search); };
        this._location = common_1.root.location;
        this._history = common_1.root.history;
    }
    BaseLocationServices.prototype.url = function (url, replace) {
        if (replace === void 0) { replace = true; }
        if (common_1.isDefined(url) && url !== this._get()) {
            this._set(null, null, url, replace);
            if (this.fireAfterUpdate) {
                this._listeners.forEach(function (cb) { return cb({ url: url }); });
            }
        }
        return utils_1.buildUrl(this);
    };
    BaseLocationServices.prototype.onChange = function (cb) {
        var _this = this;
        this._listeners.push(cb);
        return function () { return common_1.removeFrom(_this._listeners, cb); };
    };
    BaseLocationServices.prototype.dispose = function (router) {
        common_1.deregAll(this._listeners);
    };
    return BaseLocationServices;
}());
exports.BaseLocationServices = BaseLocationServices;
//# sourceMappingURL=baseLocationService.js.map