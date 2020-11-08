"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserLocationConfig = void 0;
var predicates_1 = require("../common/predicates");
/** A `LocationConfig` that delegates to the browser's `location` object */
var BrowserLocationConfig = /** @class */ (function () {
    function BrowserLocationConfig(router, _isHtml5) {
        if (_isHtml5 === void 0) { _isHtml5 = false; }
        this._isHtml5 = _isHtml5;
        this._baseHref = undefined;
        this._hashPrefix = '';
    }
    BrowserLocationConfig.prototype.port = function () {
        if (location.port) {
            return Number(location.port);
        }
        return this.protocol() === 'https' ? 443 : 80;
    };
    BrowserLocationConfig.prototype.protocol = function () {
        return location.protocol.replace(/:/g, '');
    };
    BrowserLocationConfig.prototype.host = function () {
        return location.hostname;
    };
    BrowserLocationConfig.prototype.html5Mode = function () {
        return this._isHtml5;
    };
    BrowserLocationConfig.prototype.hashPrefix = function (newprefix) {
        return predicates_1.isDefined(newprefix) ? (this._hashPrefix = newprefix) : this._hashPrefix;
    };
    BrowserLocationConfig.prototype.baseHref = function (href) {
        if (predicates_1.isDefined(href))
            this._baseHref = href;
        if (predicates_1.isUndefined(this._baseHref))
            this._baseHref = this.getBaseHref();
        return this._baseHref;
    };
    BrowserLocationConfig.prototype.getBaseHref = function () {
        var baseTag = document.getElementsByTagName('base')[0];
        if (baseTag && baseTag.href) {
            return baseTag.href.replace(/^([^/:]*:)?\/\/[^/]*/, '');
        }
        return this._isHtml5 ? '/' : location.pathname || '/';
    };
    BrowserLocationConfig.prototype.dispose = function () { };
    return BrowserLocationConfig;
}());
exports.BrowserLocationConfig = BrowserLocationConfig;
//# sourceMappingURL=browserLocationConfig.js.map