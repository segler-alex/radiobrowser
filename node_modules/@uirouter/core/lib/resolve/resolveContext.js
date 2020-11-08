"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResolveContext = exports.NATIVE_INJECTOR_TOKEN = void 0;
var common_1 = require("../common/common");
var hof_1 = require("../common/hof");
var trace_1 = require("../common/trace");
var coreservices_1 = require("../common/coreservices");
var interface_1 = require("./interface");
var resolvable_1 = require("./resolvable");
var pathUtils_1 = require("../path/pathUtils");
var strings_1 = require("../common/strings");
var common_2 = require("../common");
var whens = interface_1.resolvePolicies.when;
var ALL_WHENS = [whens.EAGER, whens.LAZY];
var EAGER_WHENS = [whens.EAGER];
// tslint:disable-next-line:no-inferrable-types
exports.NATIVE_INJECTOR_TOKEN = 'Native Injector';
/**
 * Encapsulates Dependency Injection for a path of nodes
 *
 * UI-Router states are organized as a tree.
 * A nested state has a path of ancestors to the root of the tree.
 * When a state is being activated, each element in the path is wrapped as a [[PathNode]].
 * A `PathNode` is a stateful object that holds things like parameters and resolvables for the state being activated.
 *
 * The ResolveContext closes over the [[PathNode]]s, and provides DI for the last node in the path.
 */
var ResolveContext = /** @class */ (function () {
    function ResolveContext(_path) {
        this._path = _path;
    }
    /** Gets all the tokens found in the resolve context, de-duplicated */
    ResolveContext.prototype.getTokens = function () {
        return this._path.reduce(function (acc, node) { return acc.concat(node.resolvables.map(function (r) { return r.token; })); }, []).reduce(common_1.uniqR, []);
    };
    /**
     * Gets the Resolvable that matches the token
     *
     * Gets the last Resolvable that matches the token in this context, or undefined.
     * Throws an error if it doesn't exist in the ResolveContext
     */
    ResolveContext.prototype.getResolvable = function (token) {
        var matching = this._path
            .map(function (node) { return node.resolvables; })
            .reduce(common_1.unnestR, [])
            .filter(function (r) { return r.token === token; });
        return common_1.tail(matching);
    };
    /** Returns the [[ResolvePolicy]] for the given [[Resolvable]] */
    ResolveContext.prototype.getPolicy = function (resolvable) {
        var node = this.findNode(resolvable);
        return resolvable.getPolicy(node.state);
    };
    /**
     * Returns a ResolveContext that includes a portion of this one
     *
     * Given a state, this method creates a new ResolveContext from this one.
     * The new context starts at the first node (root) and stops at the node for the `state` parameter.
     *
     * #### Why
     *
     * When a transition is created, the nodes in the "To Path" are injected from a ResolveContext.
     * A ResolveContext closes over a path of [[PathNode]]s and processes the resolvables.
     * The "To State" can inject values from its own resolvables, as well as those from all its ancestor state's (node's).
     * This method is used to create a narrower context when injecting ancestor nodes.
     *
     * @example
     * `let ABCD = new ResolveContext([A, B, C, D]);`
     *
     * Given a path `[A, B, C, D]`, where `A`, `B`, `C` and `D` are nodes for states `a`, `b`, `c`, `d`:
     * When injecting `D`, `D` should have access to all resolvables from `A`, `B`, `C`, `D`.
     * However, `B` should only be able to access resolvables from `A`, `B`.
     *
     * When resolving for the `B` node, first take the full "To Path" Context `[A,B,C,D]` and limit to the subpath `[A,B]`.
     * `let AB = ABCD.subcontext(a)`
     */
    ResolveContext.prototype.subContext = function (state) {
        return new ResolveContext(pathUtils_1.PathUtils.subPath(this._path, function (node) { return node.state === state; }));
    };
    /**
     * Adds Resolvables to the node that matches the state
     *
     * This adds a [[Resolvable]] (generally one created on the fly; not declared on a [[StateDeclaration.resolve]] block).
     * The resolvable is added to the node matching the `state` parameter.
     *
     * These new resolvables are not automatically fetched.
     * The calling code should either fetch them, fetch something that depends on them,
     * or rely on [[resolvePath]] being called when some state is being entered.
     *
     * Note: each resolvable's [[ResolvePolicy]] is merged with the state's policy, and the global default.
     *
     * @param newResolvables the new Resolvables
     * @param state Used to find the node to put the resolvable on
     */
    ResolveContext.prototype.addResolvables = function (newResolvables, state) {
        var node = common_1.find(this._path, hof_1.propEq('state', state));
        var keys = newResolvables.map(function (r) { return r.token; });
        node.resolvables = node.resolvables.filter(function (r) { return keys.indexOf(r.token) === -1; }).concat(newResolvables);
    };
    /**
     * Returns a promise for an array of resolved path Element promises
     *
     * @param when
     * @param trans
     * @returns {Promise<any>|any}
     */
    ResolveContext.prototype.resolvePath = function (when, trans) {
        var _this = this;
        if (when === void 0) { when = 'LAZY'; }
        // This option determines which 'when' policy Resolvables we are about to fetch.
        var whenOption = common_1.inArray(ALL_WHENS, when) ? when : 'LAZY';
        // If the caller specified EAGER, only the EAGER Resolvables are fetched.
        // if the caller specified LAZY, both EAGER and LAZY Resolvables are fetched.`
        var matchedWhens = whenOption === interface_1.resolvePolicies.when.EAGER ? EAGER_WHENS : ALL_WHENS;
        // get the subpath to the state argument, if provided
        trace_1.trace.traceResolvePath(this._path, when, trans);
        var matchesPolicy = function (acceptedVals, whenOrAsync) { return function (resolvable) {
            return common_1.inArray(acceptedVals, _this.getPolicy(resolvable)[whenOrAsync]);
        }; };
        // Trigger all the (matching) Resolvables in the path
        // Reduce all the "WAIT" Resolvables into an array
        var promises = this._path.reduce(function (acc, node) {
            var nodeResolvables = node.resolvables.filter(matchesPolicy(matchedWhens, 'when'));
            var nowait = nodeResolvables.filter(matchesPolicy(['NOWAIT'], 'async'));
            var wait = nodeResolvables.filter(hof_1.not(matchesPolicy(['NOWAIT'], 'async')));
            // For the matching Resolvables, start their async fetch process.
            var subContext = _this.subContext(node.state);
            var getResult = function (r) {
                return r
                    .get(subContext, trans)
                    // Return a tuple that includes the Resolvable's token
                    .then(function (value) { return ({ token: r.token, value: value }); });
            };
            nowait.forEach(getResult);
            return acc.concat(wait.map(getResult));
        }, []);
        // Wait for all the "WAIT" resolvables
        return coreservices_1.services.$q.all(promises);
    };
    ResolveContext.prototype.injector = function () {
        return this._injector || (this._injector = new UIInjectorImpl(this));
    };
    ResolveContext.prototype.findNode = function (resolvable) {
        return common_1.find(this._path, function (node) { return common_1.inArray(node.resolvables, resolvable); });
    };
    /**
     * Gets the async dependencies of a Resolvable
     *
     * Given a Resolvable, returns its dependencies as a Resolvable[]
     */
    ResolveContext.prototype.getDependencies = function (resolvable) {
        var _this = this;
        var node = this.findNode(resolvable);
        // Find which other resolvables are "visible" to the `resolvable` argument
        // subpath stopping at resolvable's node, or the whole path (if the resolvable isn't in the path)
        var subPath = pathUtils_1.PathUtils.subPath(this._path, function (x) { return x === node; }) || this._path;
        var availableResolvables = subPath
            .reduce(function (acc, _node) { return acc.concat(_node.resolvables); }, []) // all of subpath's resolvables
            .filter(function (res) { return res !== resolvable; }); // filter out the `resolvable` argument
        var getDependency = function (token) {
            var matching = availableResolvables.filter(function (r) { return r.token === token; });
            if (matching.length)
                return common_1.tail(matching);
            var fromInjector = _this.injector().getNative(token);
            if (common_2.isUndefined(fromInjector)) {
                throw new Error('Could not find Dependency Injection token: ' + strings_1.stringify(token));
            }
            return new resolvable_1.Resolvable(token, function () { return fromInjector; }, [], fromInjector);
        };
        return resolvable.deps.map(getDependency);
    };
    return ResolveContext;
}());
exports.ResolveContext = ResolveContext;
/** @internal */
var UIInjectorImpl = /** @class */ (function () {
    function UIInjectorImpl(context) {
        this.context = context;
        this.native = this.get(exports.NATIVE_INJECTOR_TOKEN) || coreservices_1.services.$injector;
    }
    UIInjectorImpl.prototype.get = function (token) {
        var resolvable = this.context.getResolvable(token);
        if (resolvable) {
            if (this.context.getPolicy(resolvable).async === 'NOWAIT') {
                return resolvable.get(this.context);
            }
            if (!resolvable.resolved) {
                throw new Error('Resolvable async .get() not complete:' + strings_1.stringify(resolvable.token));
            }
            return resolvable.data;
        }
        return this.getNative(token);
    };
    UIInjectorImpl.prototype.getAsync = function (token) {
        var resolvable = this.context.getResolvable(token);
        if (resolvable)
            return resolvable.get(this.context);
        return coreservices_1.services.$q.when(this.native.get(token));
    };
    UIInjectorImpl.prototype.getNative = function (token) {
        return this.native && this.native.get(token);
    };
    return UIInjectorImpl;
}());
//# sourceMappingURL=resolveContext.js.map