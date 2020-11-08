"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateRegistry = void 0;
var stateMatcher_1 = require("./stateMatcher");
var stateBuilder_1 = require("./stateBuilder");
var stateQueueManager_1 = require("./stateQueueManager");
var common_1 = require("../common/common");
var hof_1 = require("../common/hof");
/**
 * A registry for all of the application's [[StateDeclaration]]s
 *
 * This API is found at `router.stateRegistry` ([[UIRouter.stateRegistry]])
 */
var StateRegistry = /** @class */ (function () {
    /** @internal */
    function StateRegistry(router) {
        this.router = router;
        this.states = {};
        /** @internal */
        this.listeners = [];
        this.matcher = new stateMatcher_1.StateMatcher(this.states);
        this.builder = new stateBuilder_1.StateBuilder(this.matcher, router.urlMatcherFactory);
        this.stateQueue = new stateQueueManager_1.StateQueueManager(router, this.states, this.builder, this.listeners);
        this._registerRoot();
    }
    /** @internal */
    StateRegistry.prototype._registerRoot = function () {
        var rootStateDef = {
            name: '',
            url: '^',
            views: null,
            params: {
                '#': { value: null, type: 'hash', dynamic: true },
            },
            abstract: true,
        };
        var _root = (this._root = this.stateQueue.register(rootStateDef));
        _root.navigable = null;
    };
    /** @internal */
    StateRegistry.prototype.dispose = function () {
        var _this = this;
        this.stateQueue.dispose();
        this.listeners = [];
        this.get().forEach(function (state) { return _this.get(state) && _this.deregister(state); });
    };
    /**
     * Listen for a State Registry events
     *
     * Adds a callback that is invoked when states are registered or deregistered with the StateRegistry.
     *
     * #### Example:
     * ```js
     * let allStates = registry.get();
     *
     * // Later, invoke deregisterFn() to remove the listener
     * let deregisterFn = registry.onStatesChanged((event, states) => {
     *   switch(event) {
     *     case: 'registered':
     *       states.forEach(state => allStates.push(state));
     *       break;
     *     case: 'deregistered':
     *       states.forEach(state => {
     *         let idx = allStates.indexOf(state);
     *         if (idx !== -1) allStates.splice(idx, 1);
     *       });
     *       break;
     *   }
     * });
     * ```
     *
     * @param listener a callback function invoked when the registered states changes.
     *        The function receives two parameters, `event` and `state`.
     *        See [[StateRegistryListener]]
     * @return a function that deregisters the listener
     */
    StateRegistry.prototype.onStatesChanged = function (listener) {
        this.listeners.push(listener);
        return function deregisterListener() {
            common_1.removeFrom(this.listeners)(listener);
        }.bind(this);
    };
    /**
     * Gets the implicit root state
     *
     * Gets the root of the state tree.
     * The root state is implicitly created by UI-Router.
     * Note: this returns the internal [[StateObject]] representation, not a [[StateDeclaration]]
     *
     * @return the root [[StateObject]]
     */
    StateRegistry.prototype.root = function () {
        return this._root;
    };
    /**
     * Adds a state to the registry
     *
     * Registers a [[StateDeclaration]] or queues it for registration.
     *
     * Note: a state will be queued if the state's parent isn't yet registered.
     *
     * @param stateDefinition the definition of the state to register.
     * @returns the internal [[StateObject]] object.
     *          If the state was successfully registered, then the object is fully built (See: [[StateBuilder]]).
     *          If the state was only queued, then the object is not fully built.
     */
    StateRegistry.prototype.register = function (stateDefinition) {
        return this.stateQueue.register(stateDefinition);
    };
    /** @internal */
    StateRegistry.prototype._deregisterTree = function (state) {
        var _this = this;
        var all = this.get().map(function (s) { return s.$$state(); });
        var getChildren = function (states) {
            var _children = all.filter(function (s) { return states.indexOf(s.parent) !== -1; });
            return _children.length === 0 ? _children : _children.concat(getChildren(_children));
        };
        var children = getChildren([state]);
        var deregistered = [state].concat(children).reverse();
        deregistered.forEach(function (_state) {
            var rulesApi = _this.router.urlService.rules;
            // Remove URL rule
            rulesApi
                .rules()
                .filter(hof_1.propEq('state', _state))
                .forEach(function (rule) { return rulesApi.removeRule(rule); });
            // Remove state from registry
            delete _this.states[_state.name];
        });
        return deregistered;
    };
    /**
     * Removes a state from the registry
     *
     * This removes a state from the registry.
     * If the state has children, they are are also removed from the registry.
     *
     * @param stateOrName the state's name or object representation
     * @returns {StateObject[]} a list of removed states
     */
    StateRegistry.prototype.deregister = function (stateOrName) {
        var _state = this.get(stateOrName);
        if (!_state)
            throw new Error("Can't deregister state; not found: " + stateOrName);
        var deregisteredStates = this._deregisterTree(_state.$$state());
        this.listeners.forEach(function (listener) {
            return listener('deregistered', deregisteredStates.map(function (s) { return s.self; }));
        });
        return deregisteredStates;
    };
    StateRegistry.prototype.get = function (stateOrName, base) {
        var _this = this;
        if (arguments.length === 0)
            return Object.keys(this.states).map(function (name) { return _this.states[name].self; });
        var found = this.matcher.find(stateOrName, base);
        return (found && found.self) || null;
    };
    /**
     * Registers a [[BuilderFunction]] for a specific [[StateObject]] property (e.g., `parent`, `url`, or `path`).
     * More than one BuilderFunction can be registered for a given property.
     *
     * The BuilderFunction(s) will be used to define the property on any subsequently built [[StateObject]] objects.
     *
     * @param property The name of the State property being registered for.
     * @param builderFunction The BuilderFunction which will be used to build the State property
     * @returns a function which deregisters the BuilderFunction
     */
    StateRegistry.prototype.decorator = function (property, builderFunction) {
        return this.builder.builder(property, builderFunction);
    };
    return StateRegistry;
}());
exports.StateRegistry = StateRegistry;
//# sourceMappingURL=stateRegistry.js.map