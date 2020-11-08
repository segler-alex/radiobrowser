/**
 * Predicates
 *
 * These predicates return true/false based on the input.
 * Although these functions are exported, they are subject to change without notice.
 *
 * @packageDocumentation
 */
import { and, not, pipe, prop, or } from './hof';
var toStr = Object.prototype.toString;
var tis = function (t) { return function (x) { return typeof x === t; }; };
export var isUndefined = tis('undefined');
export var isDefined = not(isUndefined);
export var isNull = function (o) { return o === null; };
export var isNullOrUndefined = or(isNull, isUndefined);
export var isFunction = tis('function');
export var isNumber = tis('number');
export var isString = tis('string');
export var isObject = function (x) { return x !== null && typeof x === 'object'; };
export var isArray = Array.isArray;
export var isDate = (function (x) { return toStr.call(x) === '[object Date]'; });
export var isRegExp = (function (x) { return toStr.call(x) === '[object RegExp]'; });
/**
 * Predicate which checks if a value is injectable
 *
 * A value is "injectable" if it is a function, or if it is an ng1 array-notation-style array
 * where all the elements in the array are Strings, except the last one, which is a Function
 */
export function isInjectable(val) {
    if (isArray(val) && val.length) {
        var head = val.slice(0, -1), tail = val.slice(-1);
        return !(head.filter(not(isString)).length || tail.filter(not(isFunction)).length);
    }
    return isFunction(val);
}
/**
 * Predicate which checks if a value looks like a Promise
 *
 * It is probably a Promise if it's an object, and it has a `then` property which is a Function
 */
export var isPromise = and(isObject, pipe(prop('then'), isFunction));
//# sourceMappingURL=predicates.js.map