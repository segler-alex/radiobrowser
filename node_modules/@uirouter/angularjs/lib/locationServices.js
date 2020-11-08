"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ng1LocationServices = void 0;
/** @publicapi @module ng1 */ /** */
var core_1 = require("@uirouter/core");
var core_2 = require("@uirouter/core");
/**
 * Implements UI-Router LocationServices and LocationConfig using Angular 1's $location service
 * @internalapi
 */
var Ng1LocationServices = /** @class */ (function () {
    function Ng1LocationServices($locationProvider) {
        // .onChange() registry
        this._urlListeners = [];
        this.$locationProvider = $locationProvider;
        var _lp = core_2.val($locationProvider);
        core_2.createProxyFunctions(_lp, this, _lp, ['hashPrefix']);
    }
    /**
     * Applys ng1-specific path parameter encoding
     *
     * The Angular 1 `$location` service is a bit weird.
     * It doesn't allow slashes to be encoded/decoded bi-directionally.
     *
     * See the writeup at https://github.com/angular-ui/ui-router/issues/2598
     *
     * This code patches the `path` parameter type so it encoded/decodes slashes as ~2F
     *
     * @param router
     */
    Ng1LocationServices.monkeyPatchPathParameterType = function (router) {
        var pathType = router.urlMatcherFactory.type('path');
        pathType.encode = function (x) {
            return x != null ? x.toString().replace(/(~|\/)/g, function (m) { return ({ '~': '~~', '/': '~2F' }[m]); }) : x;
        };
        pathType.decode = function (x) {
            return x != null ? x.toString().replace(/(~~|~2F)/g, function (m) { return ({ '~~': '~', '~2F': '/' }[m]); }) : x;
        };
    };
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    Ng1LocationServices.prototype.dispose = function () { };
    Ng1LocationServices.prototype.onChange = function (callback) {
        var _this = this;
        this._urlListeners.push(callback);
        return function () { return core_2.removeFrom(_this._urlListeners)(callback); };
    };
    Ng1LocationServices.prototype.html5Mode = function () {
        var html5Mode = this.$locationProvider.html5Mode();
        html5Mode = core_2.isObject(html5Mode) ? html5Mode.enabled : html5Mode;
        return html5Mode && this.$sniffer.history;
    };
    Ng1LocationServices.prototype.baseHref = function () {
        return this._baseHref || (this._baseHref = this.$browser.baseHref() || this.$window.location.pathname);
    };
    Ng1LocationServices.prototype.url = function (newUrl, replace, state) {
        if (replace === void 0) { replace = false; }
        if (core_1.isDefined(newUrl))
            this.$location.url(newUrl);
        if (replace)
            this.$location.replace();
        if (state)
            this.$location.state(state);
        return this.$location.url();
    };
    Ng1LocationServices.prototype._runtimeServices = function ($rootScope, $location, $sniffer, $browser, $window) {
        var _this = this;
        this.$location = $location;
        this.$sniffer = $sniffer;
        this.$browser = $browser;
        this.$window = $window;
        // Bind $locationChangeSuccess to the listeners registered in LocationService.onChange
        $rootScope.$on('$locationChangeSuccess', function (evt) { return _this._urlListeners.forEach(function (fn) { return fn(evt); }); });
        var _loc = core_2.val($location);
        // Bind these LocationService functions to $location
        core_2.createProxyFunctions(_loc, this, _loc, ['replace', 'path', 'search', 'hash']);
        // Bind these LocationConfig functions to $location
        core_2.createProxyFunctions(_loc, this, _loc, ['port', 'protocol', 'host']);
    };
    return Ng1LocationServices;
}());
exports.Ng1LocationServices = Ng1LocationServices;
//# sourceMappingURL=locationServices.js.map