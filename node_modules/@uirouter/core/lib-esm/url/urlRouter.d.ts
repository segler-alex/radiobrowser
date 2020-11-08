import { UrlMatcher } from './urlMatcher';
import { RawParams } from '../params';
import { UIRouter } from '../router';
import { UrlRuleFactory } from './urlRule';
import { MatchResult, UrlParts, UrlRule, UrlRuleHandlerFn } from './interface';
import { TargetState, TargetStateDef } from '../state';
/**
 * Updates URL and responds to URL changes
 *
 * ### Deprecation warning:
 * This class is now considered to be an internal API
 * Use the [[UrlService]] instead.
 * For configuring URL rules, use the [[UrlRules]] which can be found as [[UrlService.rules]].
 */
export declare class UrlRouter {
    private router;
    /** used to create [[UrlRule]] objects for common cases */
    urlRuleFactory: UrlRuleFactory;
    /** @internal */ private location;
    /** @internal */
    constructor(/** @internal */ router: UIRouter);
    /** Internal API. */
    update(read?: boolean): void;
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
    push(urlMatcher: UrlMatcher, params?: RawParams, options?: {
        replace?: string | boolean;
    }): void;
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
    href(urlMatcher: UrlMatcher, params?: any, options?: {
        absolute: boolean;
    }): string;
    /** @deprecated use [[UrlService.sync]]*/
    sync: (evt?: any) => void;
    /** @deprecated use [[UrlService.listen]]*/
    listen: (enabled?: boolean) => Function;
    /** @deprecated use [[UrlService.deferIntercept]]*/
    deferIntercept: (defer?: boolean) => void;
    /** @deprecated use [[UrlService.interceptDeferred]]*/
    interceptDeferred: boolean;
    /** @deprecated use [[UrlService.match]]*/
    match: (urlParts: UrlParts) => MatchResult;
    /** @deprecated use [[UrlRules.initial]]*/
    initial: (handler: string | UrlRuleHandlerFn | TargetState | TargetStateDef) => void;
    /** @deprecated use [[UrlRules.otherwise]]*/
    otherwise: (handler: string | UrlRuleHandlerFn | TargetState | TargetStateDef) => void;
    /** @deprecated use [[UrlRules.removeRule]]*/
    removeRule: (rule: UrlRule) => void;
    /** @deprecated use [[UrlRules.rule]]*/
    rule: (rule: UrlRule) => Function;
    /** @deprecated use [[UrlRules.rules]]*/
    rules: () => UrlRule[];
    /** @deprecated use [[UrlRules.sort]]*/
    sort: (compareFn?: (a: UrlRule, b: UrlRule) => number) => void;
    /** @deprecated use [[UrlRules.when]]*/
    when: (matcher: RegExp | UrlMatcher | string, handler: string | UrlRuleHandlerFn, options?: {
        priority: number;
    }) => UrlRule;
}
