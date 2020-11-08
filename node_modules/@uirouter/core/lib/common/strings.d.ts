/**
 * Functions that manipulate strings
 *
 * Although these functions are exported, they are subject to change without notice.
 *
 * @packageDocumentation
 */
import { IInjectable } from './common';
/**
 * Returns a string shortened to a maximum length
 *
 * If the string is already less than the `max` length, return the string.
 * Else return the string, shortened to `max - 3` and append three dots ("...").
 *
 * @param max the maximum length of the string to return
 * @param str the input string
 */
export declare function maxLength(max: number, str: string): string;
/**
 * Returns a string, with spaces added to the end, up to a desired str length
 *
 * If the string is already longer than the desired length, return the string.
 * Else returns the string, with extra spaces on the end, such that it reaches `length` characters.
 *
 * @param length the desired length of the string to return
 * @param str the input string
 */
export declare function padString(length: number, str: string): string;
export declare function kebobString(camelCase: string): string;
export declare function functionToString(fn: Function): any;
export declare function fnToString(fn: IInjectable): any;
export declare function stringify(o: any): string;
/** Returns a function that splits a string on a character or substring */
export declare const beforeAfterSubstr: (char: string) => (str: string) => string[];
export declare const hostRegex: RegExp;
export declare const stripLastPathElement: (str: string) => string;
export declare const splitHash: (str: string) => string[];
export declare const splitQuery: (str: string) => string[];
export declare const splitEqual: (str: string) => string[];
export declare const trimHashVal: (str: string) => string;
/**
 * Splits on a delimiter, but returns the delimiters in the array
 *
 * #### Example:
 * ```js
 * var splitOnSlashes = splitOnDelim('/');
 * splitOnSlashes("/foo"); // ["/", "foo"]
 * splitOnSlashes("/foo/"); // ["/", "foo", "/"]
 * ```
 */
export declare function splitOnDelim(delim: string): (str: string) => string[];
/**
 * Reduce fn that joins neighboring strings
 *
 * Given an array of strings, returns a new array
 * where all neighboring strings have been joined.
 *
 * #### Example:
 * ```js
 * let arr = ["foo", "bar", 1, "baz", "", "qux" ];
 * arr.reduce(joinNeighborsR, []) // ["foobar", 1, "bazqux" ]
 * ```
 */
export declare function joinNeighborsR(acc: any[], x: any): any[];
