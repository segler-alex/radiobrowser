import { UIRouter } from '../router';
import { Disposable } from '../interface';
import { UrlRule, UrlRuleHandlerFn } from './interface';
import { TargetState, TargetStateDef } from '../state';
import { UrlMatcher } from './urlMatcher';
import { UrlRuleFactory } from './urlRule';
/**
 * API for managing URL rules
 *
 * This API is used to create and manage URL rules.
 * URL rules are a mechanism to respond to specific URL patterns.
 *
 * The most commonly used methods are [[otherwise]] and [[when]].
 *
 * This API is found at `router.urlService.rules` (see: [[UIRouter.urlService]], [[URLService.rules]])
 */
export declare class UrlRules implements Disposable {
    private router;
    /** used to create [[UrlRule]] objects for common cases */
    urlRuleFactory: UrlRuleFactory;
    /** @internal */ private _sortFn;
    /** @internal */ private _otherwiseFn;
    /** @internal */ private _sorted;
    /** @internal */ private _rules;
    /** @internal */ private _id;
    /** @internal */
    constructor(/** @internal */ router: UIRouter);
    /** @internal */
    dispose(router?: UIRouter): void;
    /**
     * Defines the initial state, path, or behavior to use when the app starts.
     *
     * This rule defines the initial/starting state for the application.
     *
     * This rule is triggered the first time the URL is checked (when the app initially loads).
     * The rule is triggered only when the url matches either `""` or `"/"`.
     *
     * Note: The rule is intended to be used when the root of the application is directly linked to.
     * When the URL is *not* `""` or `"/"` and doesn't match other rules, the [[otherwise]] rule is triggered.
     * This allows 404-like behavior when an unknown URL is deep-linked.
     *
     * #### Example:
     * Start app at `home` state.
     * ```js
     * .initial({ state: 'home' });
     * ```
     *
     * #### Example:
     * Start app at `/home` (by url)
     * ```js
     * .initial('/home');
     * ```
     *
     * #### Example:
     * When no other url rule matches, go to `home` state
     * ```js
     * .initial((matchValue, url, router) => {
     *   console.log('initial state');
     *   return { state: 'home' };
     * })
     * ```
     *
     * @param handler The initial state or url path, or a function which returns the state or url path (or performs custom logic).
     */
    initial(handler: string | UrlRuleHandlerFn | TargetState | TargetStateDef): void;
    /**
     * Defines the state, url, or behavior to use when no other rule matches the URL.
     *
     * This rule is matched when *no other rule* matches.
     * It is generally used to handle unknown URLs (similar to "404" behavior, but on the client side).
     *
     * - If `handler` a string, it is treated as a url redirect
     *
     * #### Example:
     * When no other url rule matches, redirect to `/index`
     * ```js
     * .otherwise('/index');
     * ```
     *
     * - If `handler` is an object with a `state` property, the state is activated.
     *
     * #### Example:
     * When no other url rule matches, redirect to `home` and provide a `dashboard` parameter value.
     * ```js
     * .otherwise({ state: 'home', params: { dashboard: 'default' } });
     * ```
     *
     * - If `handler` is a function, the function receives the current url ([[UrlParts]]) and the [[UIRouter]] object.
     *   The function can perform actions, and/or return a value.
     *
     * #### Example:
     * When no other url rule matches, manually trigger a transition to the `home` state
     * ```js
     * .otherwise((matchValue, urlParts, router) => {
     *   router.stateService.go('home');
     * });
     * ```
     *
     * #### Example:
     * When no other url rule matches, go to `home` state
     * ```js
     * .otherwise((matchValue, urlParts, router) => {
     *   return { state: 'home' };
     * });
     * ```
     *
     * @param handler The url path to redirect to, or a function which returns the url path (or performs custom logic).
     */
    otherwise(handler: string | UrlRuleHandlerFn | TargetState | TargetStateDef): void;
    /**
     * Remove a rule previously registered
     *
     * @param rule the matcher rule that was previously registered using [[rule]]
     */
    removeRule(rule: any): void;
    /**
     * Manually adds a URL Rule.
     *
     * Usually, a url rule is added using [[StateDeclaration.url]] or [[when]].
     * This api can be used directly for more control (to register a [[BaseUrlRule]], for example).
     * Rules can be created using [[urlRuleFactory]], or created manually as simple objects.
     *
     * A rule should have a `match` function which returns truthy if the rule matched.
     * It should also have a `handler` function which is invoked if the rule is the best match.
     *
     * @return a function that deregisters the rule
     */
    rule(rule: UrlRule): Function;
    /**
     * Gets all registered rules
     *
     * @returns an array of all the registered rules
     */
    rules(): UrlRule[];
    /**
     * Defines URL Rule priorities
     *
     * More than one rule ([[UrlRule]]) might match a given URL.
     * This `compareFn` is used to sort the rules by priority.
     * Higher priority rules should sort earlier.
     *
     * The [[defaultRuleSortFn]] is used by default.
     *
     * You only need to call this function once.
     * The `compareFn` will be used to sort the rules as each is registered.
     *
     * If called without any parameter, it will re-sort the rules.
     *
     * ---
     *
     * Url rules may come from multiple sources: states's urls ([[StateDeclaration.url]]), [[when]], and [[rule]].
     * Each rule has a (user-provided) [[UrlRule.priority]], a [[UrlRule.type]], and a [[UrlRule.$id]]
     * The `$id` is is the order in which the rule was registered.
     *
     * The sort function should use these data, or data found on a specific type
     * of [[UrlRule]] (such as [[StateRule.state]]), to order the rules as desired.
     *
     * #### Example:
     * This compare function prioritizes rules by the order in which the rules were registered.
     * A rule registered earlier has higher priority.
     *
     * ```js
     * function compareFn(a, b) {
     *   return a.$id - b.$id;
     * }
     * ```
     *
     * @param compareFn a function that compares to [[UrlRule]] objects.
     *    The `compareFn` should abide by the `Array.sort` compare function rules.
     *    Given two rules, `a` and `b`, return a negative number if `a` should be higher priority.
     *    Return a positive number if `b` should be higher priority.
     *    Return `0` if the rules are identical.
     *
     *    See the [mozilla reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#Description)
     *    for details.
     */
    sort(compareFn?: (a: UrlRule, b: UrlRule) => number): void;
    /** @internal */
    private ensureSorted;
    /** @internal */
    private stableSort;
    /**
     * Registers a `matcher` and `handler` for custom URLs handling.
     *
     * The `matcher` can be:
     *
     * - a [[UrlMatcher]]: See: [[UrlMatcherFactory.compile]]
     * - a `string`: The string is compiled to a [[UrlMatcher]]
     * - a `RegExp`: The regexp is used to match the url.
     *
     * The `handler` can be:
     *
     * - a string: The url is redirected to the value of the string.
     * - a function: The url is redirected to the return value of the function.
     *
     * ---
     *
     * When the `handler` is a `string` and the `matcher` is a `UrlMatcher` (or string), the redirect
     * string is interpolated with parameter values.
     *
     * #### Example:
     * When the URL is `/foo/123` the rule will redirect to `/bar/123`.
     * ```js
     * .when("/foo/:param1", "/bar/:param1")
     * ```
     *
     * ---
     *
     * When the `handler` is a string and the `matcher` is a `RegExp`, the redirect string is
     * interpolated with capture groups from the RegExp.
     *
     * #### Example:
     * When the URL is `/foo/123` the rule will redirect to `/bar/123`.
     * ```js
     * .when(new RegExp("^/foo/(.*)$"), "/bar/$1");
     * ```
     *
     * ---
     *
     * When the handler is a function, it receives the matched value, the current URL, and the `UIRouter` object (See [[UrlRuleHandlerFn]]).
     * The "matched value" differs based on the `matcher`.
     * For [[UrlMatcher]]s, it will be the matched state params.
     * For `RegExp`, it will be the match array from `regexp.exec()`.
     *
     * If the handler returns a string, the URL is redirected to the string.
     *
     * #### Example:
     * When the URL is `/foo/123` the rule will redirect to `/bar/123`.
     * ```js
     * .when(new RegExp("^/foo/(.*)$"), match => "/bar/" + match[1]);
     * ```
     *
     * Note: the `handler` may also invoke arbitrary code, such as `$state.go()`
     *
     * @param matcher A pattern `string` to match, compiled as a [[UrlMatcher]], or a `RegExp`.
     * @param handler The path to redirect to, or a function that returns the path.
     * @param options `{ priority: number }`
     *
     * @return the registered [[UrlRule]]
     */
    when(matcher: RegExp | UrlMatcher | string, handler: string | UrlRuleHandlerFn, options?: {
        priority: number;
    }): UrlRule;
}
