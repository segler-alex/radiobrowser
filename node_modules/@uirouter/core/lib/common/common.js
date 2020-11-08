"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.silentRejection = exports.silenceUncaughtInPromise = exports._extend = exports.copy = exports.tail = exports.applyPairs = exports.arrayTuples = exports.pairs = exports.assertFn = exports.assertMap = exports.assertPredicate = exports.flatten = exports.unnest = exports.uniqR = exports.pushR = exports.flattenR = exports.unnestR = exports.anyTrueR = exports.allTrueR = exports.values = exports.map = exports.mapObj = exports.find = exports.filter = exports.pluck = exports.omit = exports.pick = exports.ancestors = exports.mergeR = exports.defaults = exports.deregAll = exports._pushTo = exports.pushTo = exports._removeFrom = exports.removeFrom = exports._inArray = exports.inArray = exports.inherit = exports.createProxyFunctions = exports.noop = exports.identity = exports.equals = exports.extend = exports.forEach = exports.toJson = exports.fromJson = exports.root = void 0;
/**
 * Random utility functions used in the UI-Router code
 *
 * These functions are exported, but are subject to change without notice.
 *
 * @packageDocumentation
 * @preferred
 */
var predicates_1 = require("./predicates");
var hof_1 = require("./hof");
var coreservices_1 = require("./coreservices");
exports.root = (typeof self === 'object' && self.self === self && self) ||
    (typeof global === 'object' && global.global === global && global) ||
    this;
var angular = exports.root.angular || {};
exports.fromJson = angular.fromJson || JSON.parse.bind(JSON);
exports.toJson = angular.toJson || JSON.stringify.bind(JSON);
exports.forEach = angular.forEach || _forEach;
exports.extend = Object.assign || _extend;
exports.equals = angular.equals || _equals;
function identity(x) {
    return x;
}
exports.identity = identity;
function noop() { }
exports.noop = noop;
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
function createProxyFunctions(source, target, bind, fnNames, latebind) {
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
exports.createProxyFunctions = createProxyFunctions;
/**
 * prototypal inheritance helper.
 * Creates a new object which has `parent` object as its prototype, and then copies the properties from `extra` onto it
 */
exports.inherit = function (parent, extra) { return exports.extend(Object.create(parent), extra); };
/** Given an array, returns true if the object is found in the array, (using indexOf) */
exports.inArray = hof_1.curry(_inArray);
function _inArray(array, obj) {
    return array.indexOf(obj) !== -1;
}
exports._inArray = _inArray;
/**
 * Given an array, and an item, if the item is found in the array, it removes it (in-place).
 * The same array is returned
 */
exports.removeFrom = hof_1.curry(_removeFrom);
function _removeFrom(array, obj) {
    var idx = array.indexOf(obj);
    if (idx >= 0)
        array.splice(idx, 1);
    return array;
}
exports._removeFrom = _removeFrom;
/** pushes a values to an array and returns the value */
exports.pushTo = hof_1.curry(_pushTo);
function _pushTo(arr, val) {
    return arr.push(val), val;
}
exports._pushTo = _pushTo;
/** Given an array of (deregistration) functions, calls all functions and removes each one from the source array */
exports.deregAll = function (functions) {
    return functions.slice().forEach(function (fn) {
        typeof fn === 'function' && fn();
        exports.removeFrom(functions, fn);
    });
};
/**
 * Applies a set of defaults to an options object.  The options object is filtered
 * to only those properties of the objects in the defaultsList.
 * Earlier objects in the defaultsList take precedence when applying defaults.
 */
function defaults(opts) {
    var defaultsList = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        defaultsList[_i - 1] = arguments[_i];
    }
    var defaultVals = exports.extend.apply(void 0, __spreadArrays([{}], defaultsList.reverse()));
    return exports.extend(defaultVals, pick(opts || {}, Object.keys(defaultVals)));
}
exports.defaults = defaults;
/** Reduce function that merges each element of the list into a single object, using extend */
exports.mergeR = function (memo, item) { return exports.extend(memo, item); };
/**
 * Finds the common ancestor path between two states.
 *
 * @param {Object} first The first state.
 * @param {Object} second The second state.
 * @return {Array} Returns an array of state names in descending order, not including the root.
 */
function ancestors(first, second) {
    var path = [];
    // tslint:disable-next-line:forin
    for (var n in first.path) {
        if (first.path[n] !== second.path[n])
            break;
        path.push(first.path[n]);
    }
    return path;
}
exports.ancestors = ancestors;
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
function pick(obj, propNames) {
    var objCopy = {};
    for (var _prop in obj) {
        if (propNames.indexOf(_prop) !== -1) {
            objCopy[_prop] = obj[_prop];
        }
    }
    return objCopy;
}
exports.pick = pick;
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
function omit(obj, propNames) {
    return Object.keys(obj)
        .filter(hof_1.not(exports.inArray(propNames)))
        .reduce(function (acc, key) { return ((acc[key] = obj[key]), acc); }, {});
}
exports.omit = omit;
/**
 * Maps an array, or object to a property (by name)
 */
function pluck(collection, propName) {
    return map(collection, hof_1.prop(propName));
}
exports.pluck = pluck;
/** Filters an Array or an Object's properties based on a predicate */
function filter(collection, callback) {
    var arr = predicates_1.isArray(collection), result = arr ? [] : {};
    var accept = arr ? function (x) { return result.push(x); } : function (x, key) { return (result[key] = x); };
    exports.forEach(collection, function (item, i) {
        if (callback(item, i))
            accept(item, i);
    });
    return result;
}
exports.filter = filter;
/** Finds an object from an array, or a property of an object, that matches a predicate */
function find(collection, callback) {
    var result;
    exports.forEach(collection, function (item, i) {
        if (result)
            return;
        if (callback(item, i))
            result = item;
    });
    return result;
}
exports.find = find;
/** Given an object, returns a new object, where each property is transformed by the callback function */
exports.mapObj = map;
/** Maps an array or object properties using a callback function */
function map(collection, callback, target) {
    target = target || (predicates_1.isArray(collection) ? [] : {});
    exports.forEach(collection, function (item, i) { return (target[i] = callback(item, i)); });
    return target;
}
exports.map = map;
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
exports.values = function (obj) { return Object.keys(obj).map(function (key) { return obj[key]; }); };
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
exports.allTrueR = function (memo, elem) { return memo && elem; };
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
exports.anyTrueR = function (memo, elem) { return memo || elem; };
/**
 * Reduce function which un-nests a single level of arrays
 * @example
 * ```
 *
 * let input = [ [ "a", "b" ], [ "c", "d" ], [ [ "double", "nested" ] ] ];
 * input.reduce(unnestR, []) // [ "a", "b", "c", "d", [ "double, "nested" ] ]
 * ```
 */
exports.unnestR = function (memo, elem) { return memo.concat(elem); };
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
exports.flattenR = function (memo, elem) {
    return predicates_1.isArray(elem) ? memo.concat(elem.reduce(exports.flattenR, [])) : pushR(memo, elem);
};
/**
 * Reduce function that pushes an object to an array, then returns the array.
 * Mostly just for [[flattenR]] and [[uniqR]]
 */
function pushR(arr, obj) {
    arr.push(obj);
    return arr;
}
exports.pushR = pushR;
/** Reduce function that filters out duplicates */
exports.uniqR = function (acc, token) { return (exports.inArray(acc, token) ? acc : pushR(acc, token)); };
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
exports.unnest = function (arr) { return arr.reduce(exports.unnestR, []); };
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
exports.flatten = function (arr) { return arr.reduce(exports.flattenR, []); };
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
exports.assertPredicate = assertFn;
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
exports.assertMap = assertFn;
function assertFn(predicateOrMap, errMsg) {
    if (errMsg === void 0) { errMsg = 'assert failure'; }
    return function (obj) {
        var result = predicateOrMap(obj);
        if (!result) {
            throw new Error(predicates_1.isFunction(errMsg) ? errMsg(obj) : errMsg);
        }
        return result;
    };
}
exports.assertFn = assertFn;
/**
 * Like _.pairs: Given an object, returns an array of key/value pairs
 *
 * @example
 * ```
 *
 * pairs({ foo: "FOO", bar: "BAR }) // [ [ "foo", "FOO" ], [ "bar": "BAR" ] ]
 * ```
 */
exports.pairs = function (obj) { return Object.keys(obj).map(function (key) { return [key, obj[key]]; }); };
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
function arrayTuples() {
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
exports.arrayTuples = arrayTuples;
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
function applyPairs(memo, keyValTuple) {
    var key, value;
    if (predicates_1.isArray(keyValTuple))
        key = keyValTuple[0], value = keyValTuple[1];
    if (!predicates_1.isString(key))
        throw new Error('invalid parameters to applyPairs');
    memo[key] = value;
    return memo;
}
exports.applyPairs = applyPairs;
/** Get the last element of an array */
function tail(arr) {
    return (arr.length && arr[arr.length - 1]) || undefined;
}
exports.tail = tail;
/**
 * shallow copy from src to dest
 */
function copy(src, dest) {
    if (dest)
        Object.keys(dest).forEach(function (key) { return delete dest[key]; });
    if (!dest)
        dest = {};
    return exports.extend(dest, src);
}
exports.copy = copy;
/** Naive forEach implementation works with Objects or Arrays */
function _forEach(obj, cb, _this) {
    if (predicates_1.isArray(obj))
        return obj.forEach(cb, _this);
    Object.keys(obj).forEach(function (key) { return cb(obj[key], key); });
}
function _extend(toObj) {
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
exports._extend = _extend;
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
    if (hof_1.all(predicates_1.isArray)(tup))
        return _arraysEq(o1, o2);
    if (hof_1.all(predicates_1.isDate)(tup))
        return o1.getTime() === o2.getTime();
    if (hof_1.all(predicates_1.isRegExp)(tup))
        return o1.toString() === o2.toString();
    if (hof_1.all(predicates_1.isFunction)(tup))
        return true; // meh
    var predicates = [predicates_1.isFunction, predicates_1.isArray, predicates_1.isDate, predicates_1.isRegExp];
    if (predicates.map(hof_1.any).reduce(function (b, fn) { return b || !!fn(tup); }, false))
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
exports.silenceUncaughtInPromise = function (promise) { return promise.catch(function (e) { return 0; }) && promise; };
exports.silentRejection = function (error) { return exports.silenceUncaughtInPromise(coreservices_1.services.$q.reject(error)); };
//# sourceMappingURL=common.js.map