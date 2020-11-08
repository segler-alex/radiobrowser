import { Param } from '../params/param';
import { ParamTypes } from '../params/paramTypes';
import { RawParams } from '../params/interface';
import { UrlMatcherCompileConfig } from './interface';
import { ParamFactory } from './urlMatcherFactory';
/**
 * Matches URLs against patterns.
 *
 * Matches URLs against patterns and extracts named parameters from the path or the search
 * part of the URL.
 *
 * A URL pattern consists of a path pattern, optionally followed by '?' and a list of search (query)
 * parameters. Multiple search parameter names are separated by '&'. Search parameters
 * do not influence whether or not a URL is matched, but their values are passed through into
 * the matched parameters returned by [[UrlMatcher.exec]].
 *
 * - *Path parameters* are defined using curly brace placeholders (`/somepath/{param}`)
 * or colon placeholders (`/somePath/:param`).
 *
 * - *A parameter RegExp* may be defined for a param after a colon
 * (`/somePath/{param:[a-zA-Z0-9]+}`) in a curly brace placeholder.
 * The regexp must match for the url to be matched.
 * Should the regexp itself contain curly braces, they must be in matched pairs or escaped with a backslash.
 *
 * Note: a RegExp parameter will encode its value using either [[ParamTypes.path]] or [[ParamTypes.query]].
 *
 * - *Custom parameter types* may also be specified after a colon (`/somePath/{param:int}`) in curly brace parameters.
 *   See [[UrlMatcherFactory.type]] for more information.
 *
 * - *Catch-all parameters* are defined using an asterisk placeholder (`/somepath/*catchallparam`).
 *   A catch-all * parameter value will contain the remainder of the URL.
 *
 * ---
 *
 * Parameter names may contain only word characters (latin letters, digits, and underscore) and
 * must be unique within the pattern (across both path and search parameters).
 * A path parameter matches any number of characters other than '/'. For catch-all
 * placeholders the path parameter matches any number of characters.
 *
 * Examples:
 *
 * * `'/hello/'` - Matches only if the path is exactly '/hello/'. There is no special treatment for
 *   trailing slashes, and patterns have to match the entire path, not just a prefix.
 * * `'/user/:id'` - Matches '/user/bob' or '/user/1234!!!' or even '/user/' but not '/user' or
 *   '/user/bob/details'. The second path segment will be captured as the parameter 'id'.
 * * `'/user/{id}'` - Same as the previous example, but using curly brace syntax.
 * * `'/user/{id:[^/]*}'` - Same as the previous example.
 * * `'/user/{id:[0-9a-fA-F]{1,8}}'` - Similar to the previous example, but only matches if the id
 *   parameter consists of 1 to 8 hex digits.
 * * `'/files/{path:.*}'` - Matches any URL starting with '/files/' and captures the rest of the
 *   path into the parameter 'path'.
 * * `'/files/*path'` - ditto.
 * * `'/calendar/{start:date}'` - Matches "/calendar/2014-11-12" (because the pattern defined
 *   in the built-in  `date` ParamType matches `2014-11-12`) and provides a Date object in $stateParams.start
 *
 */
export declare class UrlMatcher {
    /** @internal */
    static nameValidator: RegExp;
    /** @internal */
    private _cache;
    /** @internal */
    private _children;
    /** @internal */
    private _params;
    /** @internal */
    private _segments;
    /** @internal */
    private _compiled;
    /** @internal */
    private readonly config;
    /** The pattern that was passed into the constructor */
    pattern: string;
    /** @internal */
    static encodeDashes(str: string): string;
    /** @internal Given a matcher, return an array with the matcher's path segments and path params, in order */
    static pathSegmentsAndParams(matcher: UrlMatcher): any;
    /** @internal Given a matcher, return an array with the matcher's query params */
    static queryParams(matcher: UrlMatcher): Param[];
    /**
     * Compare two UrlMatchers
     *
     * This comparison function converts a UrlMatcher into static and dynamic path segments.
     * Each static path segment is a static string between a path separator (slash character).
     * Each dynamic segment is a path parameter.
     *
     * The comparison function sorts static segments before dynamic ones.
     */
    static compare(a: UrlMatcher, b: UrlMatcher): number;
    /**
     * @param pattern The pattern to compile into a matcher.
     * @param paramTypes The [[ParamTypes]] registry
     * @param paramFactory A [[ParamFactory]] object
     * @param config  A [[UrlMatcherCompileConfig]] configuration object
     */
    constructor(pattern: string, paramTypes: ParamTypes, paramFactory: ParamFactory, config?: UrlMatcherCompileConfig);
    /**
     * Creates a new concatenated UrlMatcher
     *
     * Builds a new UrlMatcher by appending another UrlMatcher to this one.
     *
     * @param url A `UrlMatcher` instance to append as a child of the current `UrlMatcher`.
     */
    append(url: UrlMatcher): UrlMatcher;
    /** @internal */
    isRoot(): boolean;
    /** Returns the input pattern string */
    toString(): string;
    private _getDecodedParamValue;
    /**
     * Tests the specified url/path against this matcher.
     *
     * Tests if the given url matches this matcher's pattern, and returns an object containing the captured
     * parameter values.  Returns null if the path does not match.
     *
     * The returned object contains the values
     * of any search parameters that are mentioned in the pattern, but their value may be null if
     * they are not present in `search`. This means that search parameters are always treated
     * as optional.
     *
     * #### Example:
     * ```js
     * new UrlMatcher('/user/{id}?q&r').exec('/user/bob', {
     *   x: '1', q: 'hello'
     * });
     * // returns { id: 'bob', q: 'hello', r: null }
     * ```
     *
     * @param path    The URL path to match, e.g. `$location.path()`.
     * @param search  URL search parameters, e.g. `$location.search()`.
     * @param hash    URL hash e.g. `$location.hash()`.
     * @param options
     *
     * @returns The captured parameter values.
     */
    exec(path: string, search?: any, hash?: string, options?: any): RawParams;
    /**
     * @internal
     * Returns all the [[Param]] objects of all path and search parameters of this pattern in order of appearance.
     *
     * @returns {Array.<Param>}  An array of [[Param]] objects. Must be treated as read-only. If the
     *    pattern has no parameters, an empty array is returned.
     */
    parameters(opts?: any): Param[];
    /**
     * @internal
     * Returns a single parameter from this UrlMatcher by id
     *
     * @param id
     * @param opts
     * @returns {T|Param|any|boolean|UrlMatcher|null}
     */
    parameter(id: string, opts?: any): Param;
    /**
     * Validates the input parameter values against this UrlMatcher
     *
     * Checks an object hash of parameters to validate their correctness according to the parameter
     * types of this `UrlMatcher`.
     *
     * @param params The object hash of parameters to validate.
     * @returns Returns `true` if `params` validates, otherwise `false`.
     */
    validates(params: RawParams): boolean;
    /**
     * Given a set of parameter values, creates a URL from this UrlMatcher.
     *
     * Creates a URL that matches this pattern by substituting the specified values
     * for the path and search parameters.
     *
     * #### Example:
     * ```js
     * new UrlMatcher('/user/{id}?q').format({ id:'bob', q:'yes' });
     * // returns '/user/bob?q=yes'
     * ```
     *
     * @param values  the values to substitute for the parameters in this pattern.
     * @returns the formatted URL (path and optionally search part).
     */
    format(values?: RawParams): string;
}
