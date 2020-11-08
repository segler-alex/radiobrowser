"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resolvable = exports.defaultResolvePolicy = void 0;
var common_1 = require("../common/common");
var coreservices_1 = require("../common/coreservices");
var trace_1 = require("../common/trace");
var strings_1 = require("../common/strings");
var predicates_1 = require("../common/predicates");
var predicates_2 = require("../common/predicates");
// TODO: explicitly make this user configurable
exports.defaultResolvePolicy = {
    when: 'LAZY',
    async: 'WAIT',
};
/**
 * The basic building block for the resolve system.
 *
 * Resolvables encapsulate a state's resolve's resolveFn, the resolveFn's declared dependencies, the wrapped (.promise),
 * and the unwrapped-when-complete (.data) result of the resolveFn.
 *
 * Resolvable.get() either retrieves the Resolvable's existing promise, or else invokes resolve() (which invokes the
 * resolveFn) and returns the resulting promise.
 *
 * Resolvable.get() and Resolvable.resolve() both execute within a context path, which is passed as the first
 * parameter to those fns.
 */
var Resolvable = /** @class */ (function () {
    function Resolvable(arg1, resolveFn, deps, policy, data) {
        this.resolved = false;
        this.promise = undefined;
        if (arg1 instanceof Resolvable) {
            common_1.extend(this, arg1);
        }
        else if (predicates_1.isFunction(resolveFn)) {
            if (predicates_2.isNullOrUndefined(arg1))
                throw new Error('new Resolvable(): token argument is required');
            if (!predicates_1.isFunction(resolveFn))
                throw new Error('new Resolvable(): resolveFn argument must be a function');
            this.token = arg1;
            this.policy = policy;
            this.resolveFn = resolveFn;
            this.deps = deps || [];
            this.data = data;
            this.resolved = data !== undefined;
            this.promise = this.resolved ? coreservices_1.services.$q.when(this.data) : undefined;
        }
        else if (predicates_1.isObject(arg1) && arg1.token && (arg1.hasOwnProperty('resolveFn') || arg1.hasOwnProperty('data'))) {
            var literal = arg1;
            return new Resolvable(literal.token, literal.resolveFn, literal.deps, literal.policy, literal.data);
        }
    }
    Resolvable.prototype.getPolicy = function (state) {
        var thisPolicy = this.policy || {};
        var statePolicy = (state && state.resolvePolicy) || {};
        return {
            when: thisPolicy.when || statePolicy.when || exports.defaultResolvePolicy.when,
            async: thisPolicy.async || statePolicy.async || exports.defaultResolvePolicy.async,
        };
    };
    /**
     * Asynchronously resolve this Resolvable's data
     *
     * Given a ResolveContext that this Resolvable is found in:
     * Wait for this Resolvable's dependencies, then invoke this Resolvable's function
     * and update the Resolvable's state
     */
    Resolvable.prototype.resolve = function (resolveContext, trans) {
        var _this = this;
        var $q = coreservices_1.services.$q;
        // Gets all dependencies from ResolveContext and wait for them to be resolved
        var getResolvableDependencies = function () {
            return $q.all(resolveContext.getDependencies(_this).map(function (resolvable) { return resolvable.get(resolveContext, trans); }));
        };
        // Invokes the resolve function passing the resolved dependencies as arguments
        var invokeResolveFn = function (resolvedDeps) { return _this.resolveFn.apply(null, resolvedDeps); };
        var node = resolveContext.findNode(this);
        var state = node && node.state;
        var asyncPolicy = this.getPolicy(state).async;
        var customAsyncPolicy = predicates_1.isFunction(asyncPolicy) ? asyncPolicy : common_1.identity;
        // After the final value has been resolved, update the state of the Resolvable
        var applyResolvedValue = function (resolvedValue) {
            _this.data = resolvedValue;
            _this.resolved = true;
            _this.resolveFn = null;
            trace_1.trace.traceResolvableResolved(_this, trans);
            return _this.data;
        };
        // Sets the promise property first, then getsResolvableDependencies in the context of the promise chain. Always waits one tick.
        return (this.promise = $q
            .when()
            .then(getResolvableDependencies)
            .then(invokeResolveFn)
            .then(customAsyncPolicy)
            .then(applyResolvedValue));
    };
    /**
     * Gets a promise for this Resolvable's data.
     *
     * Fetches the data and returns a promise.
     * Returns the existing promise if it has already been fetched once.
     */
    Resolvable.prototype.get = function (resolveContext, trans) {
        return this.promise || this.resolve(resolveContext, trans);
    };
    Resolvable.prototype.toString = function () {
        return "Resolvable(token: " + strings_1.stringify(this.token) + ", requires: [" + this.deps.map(strings_1.stringify) + "])";
    };
    Resolvable.prototype.clone = function () {
        return new Resolvable(this);
    };
    Resolvable.fromData = function (token, data) { return new Resolvable(token, function () { return data; }, null, null, data); };
    return Resolvable;
}());
exports.Resolvable = Resolvable;
//# sourceMappingURL=resolvable.js.map