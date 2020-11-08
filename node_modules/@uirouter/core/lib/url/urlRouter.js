"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlRouter = void 0;
var common_1 = require("../common");
var urlRule_1 = require("./urlRule");
function appendBasePath(url, isHtml5, absolute, baseHref) {
    if (baseHref === '/')
        return url;
    if (isHtml5)
        return common_1.stripLastPathElement(baseHref) + url;
    if (absolute)
        return baseHref.slice(1) + url;
    return url;
}
/**
 * Updates URL and responds to URL changes
 *
 * ### Deprecation warning:
 * This class is now considered to be an internal API
 * Use the [[UrlService]] instead.
 * For configuring URL rules, use the [[UrlRules]] which can be found as [[UrlService.rules]].
 */
var UrlRouter = /** @class */ (function () {
    /** @internal */
    function UrlRouter(/** @internal */ router) {
        var _this = this;
        this.router = router;
        // Delegate these calls to [[UrlService]]
        /** @deprecated use [[UrlService.sync]]*/
        this.sync = function (evt) { return _this.router.urlService.sync(evt); };
        /** @deprecated use [[UrlService.listen]]*/
        this.listen = function (enabled) { return _this.router.urlService.listen(enabled); };
        /** @deprecated use [[UrlService.deferIntercept]]*/
        this.deferIntercept = function (defer) { return _this.router.urlService.deferIntercept(defer); };
        /** @deprecated use [[UrlService.match]]*/
        this.match = function (urlParts) { return _this.router.urlService.match(urlParts); };
        // Delegate these calls to [[UrlRules]]
        /** @deprecated use [[UrlRules.initial]]*/
        this.initial = function (handler) {
            return _this.router.urlService.rules.initial(handler);
        };
        /** @deprecated use [[UrlRules.otherwise]]*/
        this.otherwise = function (handler) {
            return _this.router.urlService.rules.otherwise(handler);
        };
        /** @deprecated use [[UrlRules.removeRule]]*/
        this.removeRule = function (rule) { return _this.router.urlService.rules.removeRule(rule); };
        /** @deprecated use [[UrlRules.rule]]*/
        this.rule = function (rule) { return _this.router.urlService.rules.rule(rule); };
        /** @deprecated use [[UrlRules.rules]]*/
        this.rules = function () { return _this.router.urlService.rules.rules(); };
        /** @deprecated use [[UrlRules.sort]]*/
        this.sort = function (compareFn) { return _this.router.urlService.rules.sort(compareFn); };
        /** @deprecated use [[UrlRules.when]]*/
        this.when = function (matcher, handler, options) { return _this.router.urlService.rules.when(matcher, handler, options); };
        this.urlRuleFactory = new urlRule_1.UrlRuleFactory(router);
    }
    /** Internal API. */
    UrlRouter.prototype.update = function (read) {
        var $url = this.router.locationService;
        if (read) {
            this.location = $url.url();
            return;
        }
        if ($url.url() === this.location)
            return;
        $url.url(this.location, true);
    };
    /**
     * Internal API.
     *
     * Pushes a new location to the browser history.
     *
     * @internal
     * @param urlMatcher
     * @param params
     * @param options
     */
    UrlRouter.prototype.push = function (urlMatcher, params, options) {
        var replace = options && !!options.replace;
        this.router.urlService.url(urlMatcher.format(params || {}), replace);
    };
    /**
     * Builds and returns a URL with interpolated parameters
     *
     * #### Example:
     * ```js
     * matcher = $umf.compile("/about/:person");
     * params = { person: "bob" };
     * $bob = $urlRouter.href(matcher, params);
     * // $bob == "/about/bob";
     * ```
     *
     * @param urlMatcher The [[UrlMatcher]] object which is used as the template of the URL to generate.
     * @param params An object of parameter values to fill the matcher's required parameters.
     * @param options Options object. The options are:
     *
     * - **`absolute`** - {boolean=false},  If true will generate an absolute url, e.g. "http://www.example.com/fullurl".
     *
     * @returns Returns the fully compiled URL, or `null` if `params` fail validation against `urlMatcher`
     */
    UrlRouter.prototype.href = function (urlMatcher, params, options) {
        var url = urlMatcher.format(params);
        if (url == null)
            return null;
        options = options || { absolute: false };
        var cfg = this.router.urlService.config;
        var isHtml5 = cfg.html5Mode();
        if (!isHtml5 && url !== null) {
            url = '#' + cfg.hashPrefix() + url;
        }
        url = appendBasePath(url, isHtml5, options.absolute, cfg.baseHref());
        if (!options.absolute || !url) {
            return url;
        }
        var slash = !isHtml5 && url ? '/' : '';
        var cfgPort = cfg.port();
        var port = (cfgPort === 80 || cfgPort === 443 ? '' : ':' + cfgPort);
        return [cfg.protocol(), '://', cfg.host(), port, slash, url].join('');
    };
    Object.defineProperty(UrlRouter.prototype, "interceptDeferred", {
        /** @deprecated use [[UrlService.interceptDeferred]]*/
        get: function () {
            return this.router.urlService.interceptDeferred;
        },
        enumerable: false,
        configurable: true
    });
    return UrlRouter;
}());
exports.UrlRouter = UrlRouter;
//# sourceMappingURL=urlRouter.js.map