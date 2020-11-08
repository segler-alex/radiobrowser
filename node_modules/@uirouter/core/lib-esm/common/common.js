var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
/**
 * Random utility functions used in the UI-Router code
 *
 * These functions are exported, but are subject to change without notice.
 *
 * @packageDocumentation
 * @preferred
 */
import { isFunction, isString, isArray, isRegExp, isDate } from './predicates';
import { all, any, prop, curry, not } from './hof';
import { services } from './coreservices';
export var root = (typeof self === 'object' && self.self === self && self) ||
    (typeof global === 'object' && global.global === global && global) ||
    this;
var angular = root.angular || {};
export var fromJson = angular.fromJson || JSON.parse.bind(JSON);
export var toJson = angular.toJson || JSON.stringify.bind(JSON);
export var forEach = angular.forEach || _forEach;
export var extend = Object.assign || _extend;
export var equals = angular.equals || _equals;
export function identity(x) {
    return x;
}
export function noop() { }
/**
 * Builds proxy functions on the `to` object which pass through to the `from` object.
 *
 * For each key in `fnNames`, creates a proxy function on the `to` object.
 * The proxy function calls the real function on the `from` object.
 *
 *
 * #### Example:
 * This example creates an new class instance whose functions are prebound to the new'd object.
 * ```js
 * class Foo {
 *   constructor(data) {
 *     // Binds all functions from Foo.prototype to 'this',
 *     // then copies them to 'this'
 *     bindFunctions(Foo.prototype, this, this);
 *     this.data = data;
 *   }
 *
 *   log() {
 *     console.log(this.data);
 *   }
 * }
 *
 * let myFoo = new Foo([1,2,3]);
 * var logit = myFoo.log;
 * logit(); // logs [1, 2, 3] from the myFoo 'this' instance
 * ```
 *
 * #### Example:
 * This example creates a bound version of a service function, and copies it to another object
 * ```
 *
 * var SomeService = {
 *   this.data = [3, 4, 5];
 *   this.log = function() {
 *     console.log(this.data);
 *   }
 * }
 *
 * // Constructor fn
 * function OtherThing() {
 *   // Binds all functions from SomeService to SomeService,
 *   // then copies them to 'this'
 *   bindFunctions(SomeService, this, SomeService);
 * }
 *
 * let myOtherThing = new OtherThing();
 * myOtherThing.log(); // logs [3, 4, 5] from SomeService's 'this'
 * ```
 *
 * @param source A function that returns the source object which contains the original functions to be bound
 * @param target A function that returns the target object which will receive the bound functions
 * @param bind A function that returns the object which the functions will be bound to
 * @param fnNames The function names which will be bound (Defaults to all the functions found on the 'from' object)
 * @param latebind If true, the binding of the function is delayed until the first time it's invoked
 */
export function createProxyFunctions(source, target, bind, fnNames, latebind) {
    if (latebind === void 0) { latebind = false; }
    var bindFunction = function (fnName) { return source()[fnName].bind(bind()); };
    var makeLateRebindFn = function (fnName) {
        return function lateRebindFunction() {
            target[fnName] = bindFunction(fnName);
            return target[fnName].apply(null, arguments);
        };
    };
    fnNames = fnNames || Object.keys(source());
    return fnNames.reduce(function (acc, name) {
        acc[name] = latebind ? makeLateRebindFn(name) : bindFunction(name);
        return acc;
    }, target);
}
/**
 * prototypal inheritance helper.
 * Creates a new object which has `parent` object as its prototype, and then copies the properties from `extra` onto it
 */
export var inherit = function (parent, extra) { return extend(Object.create(parent), extra); };
/** Given an array, returns true if the object is found in the array, (using indexOf) */
export var inArray = curry(_inArray);
export function _inArray(array, obj) {
    return array.indexOf(obj) !== -1;
}
/**
 * Given an array, and an item, if the item is found in the array, it removes it (in-place).
 * The same array is returned
 */
export var removeFrom = curry(_removeFrom);
export function _removeFrom(array, obj) {
    var idx = array.indexOf(obj);
    if (idx >= 0)
        array.splice(idx, 1);
    return array;
}
/** pushes a values to an array and returns the value */
export var pushTo = curry(_pushTo);
export function _pushTo(arr, val) {
    return arr.push(val), val;
}
/** Given an array of (deregistration) functions, calls all functions and removes each one from the source array */
export var deregAll = function (functions) {
    return functions.slice().forEach(function (fn) {
        typeof fn === 'function' && fn();
        removeFrom(functions, fn);
    });
};
/**
 * Applies a set of defaults to an options object.  The options object is filtered
 * to only those properties of the objects in the defaultsList.
 * Earlier objects in the defaultsList take precedence when applying defaults.
 */
export function defaults(opts) {
    var defaultsList = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        defaultsList[_i - 1] = arguments[_i];
    }
    var defaultVals = extend.apply(void 0, __spreadArrays([{}], defaultsList.reverse()));
    return extend(defaultVals, pick(opts || {}, Object.keys(defaultVals)));
}
/** Reduce function that merges each element of the list into a single object, using extend */
export var mergeR = function (memo, item) { return extend(memo, item); };
/**
 * Finds the common ancestor path between two states.
 *
 * @param {Object} first The first state.
 * @param {Object} second The second state.
 * @return {Array} Returns an array of state names in descending order, not including the root.
 */
export function ancestors(first, second) {
    var path = [];
    // tslint:disable-next-line:forin
    for (var n in first.path) {
        if (first.path[n] !== second.path[n])
            break;
        path.push(first.path[n]);
    }
    return path;
}
/**
 * Return a copy of the object only containing the whitelisted properties.
 *
 * #### Example:
 * ```
 * var foo = { a: 1, b: 2, c: 3 };
 * var ab = pick(foo, ['a', 'b']); // { a: 1, b: 2 }
 * ```
 * @param obj the source object
 * @param propNames an Array of strings, which are the whitelisted property names
 */
export function pick(obj, propNames) {
    var objCopy = {};
    for (var _prop in obj) {
        if (propNames.indexOf(_prop) !== -1) {
            objCopy[_prop] = obj[_prop];
        }
    }
    return objCopy;
}
/**
 * Return a copy of the object omitting the blacklisted properties.
 *
 * @example
 * ```
 *
 * var foo = { a: 1, b: 2, c: 3 };
 * var ab = omit(foo, ['a', 'b']); // { c: 3 }
 * ```
 * @param obj the source object
 * @param propNames an Array of strings, which are the blacklisted property names
 */
export function omit(obj, propNames) {
    return Object.keys(obj)
        .filter(not(inArray(propNames)))
        .reduce(function (acc, key) { return ((acc[key] = obj[key]), acc); }, {});
}
/**
 * Maps an array, or object to a property (by name)
 */
export function pluck(collection, propName) {
    return map(collection, prop(propName));
}
/** Filters an Array or an Object's properties based on a predicate */
export function filter(collection, callback) {
    var arr = isArray(collection), result = arr ? [] : {};
    var accept = arr ? function (x) { return result.push(x); } : function (x, key) { return (result[key] = x); };
    forEach(collection, function (item, i) {
        if (callback(item, i))
            accept(item, i);
    });
    return result;
}
/** Finds an object from an array, or a property of an object, that matches a predicate */
export function find(collection, callback) {
    var result;
    forEach(collection, function (item, i) {
        if (result)
            return;
        if (callback(item, i))
            result = item;
    });
    return result;
}
/** Given an object, returns a new object, where each property is transformed by the callback function */
export var mapObj = map;
/** Maps an array or object properties using a callback function */
export function map(collection, callback, target) {
    target = target || (isArray(collection) ? [] : {});
    forEach(collection, function (item, i) { return (target[i] = callback(item, i)); });
    return target;
}
/**
 * Given an object, return its enumerable property values
 *
 * @example
 * ```
 *
 * let foo = { a: 1, b: 2, c: 3 }
 * let vals = values(foo); // [ 1, 2, 3 ]
 * ```
 */
export var values = function (obj) { return Object.keys(obj).map(function (key) { return obj[key]; }); };
/**
 * Reduce function that returns true if all of the values are truthy.
 *
 * @example
 * ```
 *
 * let vals = [ 1, true, {}, "hello world"];
 * vals.reduce(allTrueR, true); // true
 *
 * vals.push(0);
 * vals.reduce(allTrueR, true); // false
 * ```
 */
export var allTrueR = function (memo, elem) { return memo && elem; };
/**
 * Reduce function that returns true if any of the values are truthy.
 *
 *  * @example
 * ```
 *
 * let vals = [ 0, null, undefined ];
 * vals.reduce(anyTrueR, true); // false
 *
 * vals.push("hello world");
 * vals.reduce(anyTrueR, true); // true
 * ```
 */
export var anyTrueR = function (memo, elem) { return memo || elem; };
/**
 * Reduce function which un-nests a single level of arrays
 * @example
 * ```
 *
 * let input = [ [ "a", "b" ], [ "c", "d" ], [ [ "double", "nested" ] ] ];
 * input.reduce(unnestR, []) // [ "a", "b", "c", "d", [ "double, "nested" ] ]
 * ```
 */
export var unnestR = function (memo, elem) { return memo.concat(elem); };
/**
 * Reduce function which recursively un-nests all arrays
 *
 * @example
 * ```
 *
 * let input = [ [ "a", "b" ], [ "c", "d" ], [ [ "double", "nested" ] ] ];
 * input.reduce(unnestR, []) // [ "a", "b", "c", "d", "double, "nested" ]
 * ```
 */
export var flattenR = function (memo, elem) {
    return isArray(elem) ? memo.concat(elem.reduce(flattenR, [])) : pushR(memo, elem);
};
/**
 * Reduce function that pushes an object to an array, then returns the array.
 * Mostly just for [[flattenR]] and [[uniqR]]
 */
export function pushR(arr, obj) {
    arr.push(obj);
    return arr;
}
/** Reduce function that filters out duplicates */
export var uniqR = function (acc, token) { return (inArray(acc, token) ? acc : pushR(acc, token)); };
/**
 * Return a new array with a single level of arrays unnested.
 *
 * @example
 * ```
 *
 * let input = [ [ "a", "b" ], [ "c", "d" ], [ [ "double", "nested" ] ] ];
 * unnest(input) // [ "a", "b", "c", "d", [ "double, "nested" ] ]
 * ```
 */
export var unnest = function (arr) { return arr.reduce(unnestR, []); };
/**
 * Return a completely flattened version of an array.
 *
 * @example
 * ```
 *
 * let input = [ [ "a", "b" ], [ "c", "d" ], [ [ "double", "nested" ] ] ];
 * flatten(input) // [ "a", "b", "c", "d", "double, "nested" ]
 * ```
 */
export var flatten = function (arr) { return arr.reduce(flattenR, []); };
/**
 * Given a .filter Predicate, builds a .filter Predicate which throws an error if any elements do not pass.
 * @example
 * ```
 *
 * let isNumber = (obj) => typeof(obj) === 'number';
 * let allNumbers = [ 1, 2, 3, 4, 5 ];
 * allNumbers.filter(assertPredicate(isNumber)); //OK
 *
 * let oneString = [ 1, 2, 3, 4, "5" ];
 * oneString.filter(assertPredicate(isNumber, "Not all numbers")); // throws Error(""Not all numbers"");
 * ```
 */
export var assertPredicate = assertFn;
/**
 * Given a .map function, builds a .map function which throws an error if any mapped elements do not pass a truthyness test.
 * @example
 * ```
 *
 * var data = { foo: 1, bar: 2 };
 *
 * let keys = [ 'foo', 'bar' ]
 * let values = keys.map(assertMap(key => data[key], "Key not found"));
 * // values is [1, 2]
 *
 * let keys = [ 'foo', 'bar', 'baz' ]
 * let values = keys.map(assertMap(key => data[key], "Key not found"));
 * // throws Error("Key not found")
 * ```
 */
export var assertMap = assertFn;
export function assertFn(predicateOrMap, errMsg) {
    if (errMsg === void 0) { errMsg = 'assert failure'; }
    return function (obj) {
        var result = predicateOrMap(obj);
        if (!result) {
            throw new Error(isFunction(errMsg) ? errMsg(obj) : errMsg);
        }
        return result;
    };
}
/**
 * Like _.pairs: Given an object, returns an array of key/value pairs
 *
 * @example
 * ```
 *
 * pairs({ foo: "FOO", bar: "BAR }) // [ [ "foo", "FOO" ], [ "bar": "BAR" ] ]
 * ```
 */
export var pairs = function (obj) { return Object.keys(obj).map(function (key) { return [key, obj[key]]; }); };
/**
 * Given two or more parallel arrays, returns an array of tuples where
 * each tuple is composed of [ a[i], b[i], ... z[i] ]
 *
 * @example
 * ```
 *
 * let foo = [ 0, 2, 4, 6 ];
 * let bar = [ 1, 3, 5, 7 ];
 * let baz = [ 10, 30, 50, 70 ];
 * arrayTuples(foo, bar);       // [ [0, 1], [2, 3], [4, 5], [6, 7] ]
 * arrayTuples(foo, bar, baz);  // [ [0, 1, 10], [2, 3, 30], [4, 5, 50], [6, 7, 70] ]
 * ```
 */
export function arrayTuples() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (args.length === 0)
        return [];
    var maxArrayLen = args.reduce(function (min, arr) { return Math.min(arr.length, min); }, 9007199254740991); // aka 2^53 − 1 aka Number.MAX_SAFE_INTEGER
    var result = [];
    var _loop_1 = function (i) {
        // This is a hot function
        // Unroll when there are 1-4 arguments
        switch (args.length) {
            case 1:
                result.push([args[0][i]]);
                break;
            case 2:
                result.push([args[0][i], args[1][i]]);
                break;
            case 3:
                result.push([args[0][i], args[1][i], args[2][i]]);
                break;
            case 4:
                result.push([args[0][i], args[1][i], args[2][i], args[3][i]]);
                break;
            default:
                result.push(args.map(function (array) { return array[i]; }));
                break;
        }
    };
    for (var i = 0; i < maxArrayLen; i++) {
        _loop_1(i);
    }
    return result;
}
/**
 * Reduce function which builds an object from an array of [key, value] pairs.
 *
 * Each iteration sets the key/val pair on the memo object, then returns the memo for the next iteration.
 *
 * Each keyValueTuple should be an array with values [ key: string, value: any ]
 *
 * @example
 * ```
 *
 * var pairs = [ ["fookey", "fooval"], ["barkey", "barval"] ]
 *
 * var pairsToObj = pairs.reduce((memo, pair) => applyPairs(memo, pair), {})
 * // pairsToObj == { fookey: "fooval", barkey: "barval" }
 *
 * // Or, more simply:
 * var pairsToObj = pairs.reduce(applyPairs, {})
 * // pairsToObj == { fookey: "fooval", barkey: "barval" }
 * ```
 */
export function applyPairs(memo, keyValTuple) {
    var key, value;
    if (isArray(keyValTuple))
        key = keyValTuple[0], value = keyValTuple[1];
    if (!isString(key))
        throw new Error('invalid parameters to applyPairs');
    memo[key] = value;
    return memo;
}
/** Get the last element of an array */
export function tail(arr) {
    return (arr.length && arr[arr.length - 1]) || undefined;
}
/**
 * shallow copy from src to dest
 */
export function copy(src, dest) {
    if (dest)
        Object.keys(dest).forEach(function (key) { return delete dest[key]; });
    if (!dest)
        dest = {};
    return extend(dest, src);
}
/** Naive forEach implementation works with Objects or Arrays */
function _forEach(obj, cb, _this) {
    if (isArray(obj))
        return obj.forEach(cb, _this);
    Object.keys(obj).forEach(function (key) { return cb(obj[key], key); });
}
export function _extend(toObj) {
    for (var i = 1; i < arguments.length; i++) {
        var obj = arguments[i];
        if (!obj)
            continue;
        var keys = Object.keys(obj);
        for (var j = 0; j < keys.length; j++) {
            toObj[keys[j]] = obj[keys[j]];
        }
    }
    return toObj;
}
function _equals(o1, o2) {
    if (o1 === o2)
        return true;
    if (o1 === null || o2 === null)
        return false;
    if (o1 !== o1 && o2 !== o2)
        return true; // NaN === NaN
    var t1 = typeof o1, t2 = typeof o2;
    if (t1 !== t2 || t1 !== 'object')
        return false;
    var tup = [o1, o2];
    if (all(isArray)(tup))
        return _arraysEq(o1, o2);
    if (all(isDate)(tup))
        return o1.getTime() === o2.getTime();
    if (all(isRegExp)(tup))
        return o1.toString() === o2.toString();
    if (all(isFunction)(tup))
        return true; // meh
    var predicates = [isFunction, isArray, isDate, isRegExp];
    if (predicates.map(any).reduce(function (b, fn) { return b || !!fn(tup); }, false))
        return false;
    var keys = {};
    // tslint:disable-next-line:forin
    for (var key in o1) {
        if (!_equals(o1[key], o2[key]))
            return false;
        keys[key] = true;
    }
    for (var key in o2) {
        if (!keys[key])
            return false;
    }
    return true;
}
function _arraysEq(a1, a2) {
    if (a1.length !== a2.length)
        return false;
    return arrayTuples(a1, a2).reduce(function (b, t) { return b && _equals(t[0], t[1]); }, true);
}
// issue #2676
export var silenceUncaughtInPromise = function (promise) { return promise.catch(function (e) { return 0; }) && promise; };
export var silentRejection = function (error) { return silenceUncaughtInPromise(services.$q.reject(error)); };
//# sourceMappingURL=common.js.map