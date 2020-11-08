import { UrlMatcher } from './urlMatcher';
import { isString, isDefined, isFunction } from '../common/predicates';
import { identity, extend } from '../common/common';
import { is, or, pattern } from '../common/hof';
import { StateObject } from '../state/stateObject';
/**
 * Creates a [[UrlRule]]
 *
 * Creates a [[UrlRule]] from a:
 *
 * - `string`
 * - [[UrlMatcher]]
 * - `RegExp`
 * - [[StateObject]]
 */
var UrlRuleFactory = /** @class */ (function () {
    function UrlRuleFactory(router) {
        this.router = router;
    }
    UrlRuleFactory.prototype.compile = function (str) {
        return this.router.urlMatcherFactory.compile(str);
    };
    UrlRuleFactory.prototype.create = function (what, handler) {
        var _this = this;
        var isState = StateObject.isState, isStateDeclaration = StateObject.isStateDeclaration;
        var makeRule = pattern([
            [isString, function (_what) { return makeRule(_this.compile(_what)); }],
            [is(UrlMatcher), function (_what) { return _this.fromUrlMatcher(_what, handler); }],
            [or(isState, isStateDeclaration), function (_what) { return _this.fromState(_what, _this.router); }],
            [is(RegExp), function (_what) { return _this.fromRegExp(_what, handler); }],
            [isFunction, function (_what) { return new BaseUrlRule(_what, handler); }],
        ]);
        var rule = makeRule(what);
        if (!rule)
            throw new Error("invalid 'what' in when()");
        return rule;
    };
    /**
     * A UrlRule which matches based on a UrlMatcher
     *
     * The `handler` may be either a `string`, a [[UrlRuleHandlerFn]] or another [[UrlMatcher]]
     *
     * ## Handler as a function
     *
     * If `handler` is a function, the function is invoked with:
     *
     * - matched parameter values ([[RawParams]] from [[UrlMatcher.exec]])
     * - url: the current Url ([[UrlParts]])
     * - router: the router object ([[UIRouter]])
     *
     * #### Example:
     * ```js
     * var urlMatcher = $umf.compile("/foo/:fooId/:barId");
     * var rule = factory.fromUrlMatcher(urlMatcher, match => "/home/" + match.fooId + "/" + match.barId);
     * var match = rule.match('/foo/123/456'); // results in { fooId: '123', barId: '456' }
     * var result = rule.handler(match); // '/home/123/456'
     * ```
     *
     * ## Handler as UrlMatcher
     *
     * If `handler` is a UrlMatcher, the handler matcher is used to create the new url.
     * The `handler` UrlMatcher is formatted using the matched param from the first matcher.
     * The url is replaced with the result.
     *
     * #### Example:
     * ```js
     * var urlMatcher = $umf.compile("/foo/:fooId/:barId");
     * var handler = $umf.compile("/home/:fooId/:barId");
     * var rule = factory.fromUrlMatcher(urlMatcher, handler);
     * var match = rule.match('/foo/123/456'); // results in { fooId: '123', barId: '456' }
     * var result = rule.handler(match); // '/home/123/456'
     * ```
     */
    UrlRuleFactory.prototype.fromUrlMatcher = function (urlMatcher, handler) {
        var _handler = handler;
        if (isString(handler))
            handler = this.router.urlMatcherFactory.compile(handler);
        if (is(UrlMatcher)(handler))
            _handler = function (match) { return handler.format(match); };
        function matchUrlParamters(url) {
            var params = urlMatcher.exec(url.path, url.search, url.hash);
            return urlMatcher.validates(params) && params;
        }
        // Prioritize URLs, lowest to highest:
        // - Some optional URL parameters, but none matched
        // - No optional parameters in URL
        // - Some optional parameters, some matched
        // - Some optional parameters, all matched
        function matchPriority(params) {
            var optional = urlMatcher.parameters().filter(function (param) { return param.isOptional; });
            if (!optional.length)
                return 0.000001;
            var matched = optional.filter(function (param) { return params[param.id]; });
            return matched.length / optional.length;
        }
        var details = { urlMatcher: urlMatcher, matchPriority: matchPriority, type: 'URLMATCHER' };
        return extend(new BaseUrlRule(matchUrlParamters, _handler), details);
    };
    /**
     * A UrlRule which matches a state by its url
     *
     * #### Example:
     * ```js
     * var rule = factory.fromState($state.get('foo'), router);
     * var match = rule.match('/foo/123/456'); // results in { fooId: '123', barId: '456' }
     * var result = rule.handler(match);
     * // Starts a transition to 'foo' with params: { fooId: '123', barId: '456' }
     * ```
     */
    UrlRuleFactory.prototype.fromState = function (stateOrDecl, router) {
        var state = StateObject.isStateDeclaration(stateOrDecl) ? stateOrDecl.$$state() : stateOrDecl;
        /**
         * Handles match by transitioning to matched state
         *
         * First checks if the router should start a new transition.
         * A new transition is not required if the current state's URL
         * and the new URL are already identical
         */
        var handler = function (match) {
            var $state = router.stateService;
            var globals = router.globals;
            if ($state.href(state, match) !== $state.href(globals.current, globals.params)) {
                $state.transitionTo(state, match, { inherit: true, source: 'url' });
            }
        };
        var details = { state: state, type: 'STATE' };
        return extend(this.fromUrlMatcher(state.url, handler), details);
    };
    /**
     * A UrlRule which matches based on a regular expression
     *
     * The `handler` may be either a [[UrlRuleHandlerFn]] or a string.
     *
     * ## Handler as a function
     *
     * If `handler` is a function, the function is invoked with:
     *
     * - regexp match array (from `regexp`)
     * - url: the current Url ([[UrlParts]])
     * - router: the router object ([[UIRouter]])
     *
     * #### Example:
     * ```js
     * var rule = factory.fromRegExp(/^\/foo\/(bar|baz)$/, match => "/home/" + match[1])
     * var match = rule.match('/foo/bar'); // results in [ '/foo/bar', 'bar' ]
     * var result = rule.handler(match); // '/home/bar'
     * ```
     *
     * ## Handler as string
     *
     * If `handler` is a string, the url is *replaced by the string* when the Rule is invoked.
     * The string is first interpolated using `string.replace()` style pattern.
     *
     * #### Example:
     * ```js
     * var rule = factory.fromRegExp(/^\/foo\/(bar|baz)$/, "/home/$1")
     * var match = rule.match('/foo/bar'); // results in [ '/foo/bar', 'bar' ]
     * var result = rule.handler(match); // '/home/bar'
     * ```
     */
    UrlRuleFactory.prototype.fromRegExp = function (regexp, handler) {
        if (regexp.global || regexp.sticky)
            throw new Error('Rule RegExp must not be global or sticky');
        /**
         * If handler is a string, the url will be replaced by the string.
         * If the string has any String.replace() style variables in it (like `$2`),
         * they will be replaced by the captures from [[match]]
         */
        var redirectUrlTo = function (match) {
            // Interpolates matched values into $1 $2, etc using a String.replace()-style pattern
            return handler.replace(/\$(\$|\d{1,2})/, function (m, what) { return match[what === '$' ? 0 : Number(what)]; });
        };
        var _handler = isString(handler) ? redirectUrlTo : handler;
        var matchParamsFromRegexp = function (url) { return regexp.exec(url.path); };
        var details = { regexp: regexp, type: 'REGEXP' };
        return extend(new BaseUrlRule(matchParamsFromRegexp, _handler), details);
    };
    UrlRuleFactory.isUrlRule = function (obj) { return obj && ['type', 'match', 'handler'].every(function (key) { return isDefined(obj[key]); }); };
    return UrlRuleFactory;
}());
export { UrlRuleFactory };
/**
 * A base rule which calls `match`
 *
 * The value from the `match` function is passed through to the `handler`.
 * @internal
 */
var BaseUrlRule = /** @class */ (function () {
    function BaseUrlRule(match, handler) {
        var _this = this;
        this.match = match;
        this.type = 'RAW';
        this.matchPriority = function (match) { return 0 - _this.$id; };
        this.handler = handler || identity;
    }
    return BaseUrlRule;
}());
export { BaseUrlRule };
//# sourceMappingURL=urlRule.js.map