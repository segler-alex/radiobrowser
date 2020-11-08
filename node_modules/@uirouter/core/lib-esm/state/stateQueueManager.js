import { inArray, isString, prop } from '../common';
import { StateObject } from './stateObject';
var StateQueueManager = /** @class */ (function () {
    function StateQueueManager(router, states, builder, listeners) {
        this.router = router;
        this.states = states;
        this.builder = builder;
        this.listeners = listeners;
        this.queue = [];
    }
    StateQueueManager.prototype.dispose = function () {
        this.queue = [];
    };
    StateQueueManager.prototype.register = function (stateDecl) {
        var queue = this.queue;
        var state = StateObject.create(stateDecl);
        var name = state.name;
        if (!isString(name))
            throw new Error('State must have a valid name');
        if (this.states.hasOwnProperty(name) || inArray(queue.map(prop('name')), name))
            throw new Error("State '" + name + "' is already defined");
        queue.push(state);
        this.flush();
        return state;
    };
    StateQueueManager.prototype.flush = function () {
        var _this = this;
        var _a = this, queue = _a.queue, states = _a.states, builder = _a.builder;
        var registered = [], // states that got registered
        orphans = [], // states that don't yet have a parent registered
        previousQueueLength = {}; // keep track of how long the queue when an orphan was first encountered
        var getState = function (name) { return _this.states.hasOwnProperty(name) && _this.states[name]; };
        var notifyListeners = function () {
            if (registered.length) {
                _this.listeners.forEach(function (listener) {
                    return listener('registered', registered.map(function (s) { return s.self; }));
                });
            }
        };
        while (queue.length > 0) {
            var state = queue.shift();
            var name_1 = state.name;
            var result = builder.build(state);
            var orphanIdx = orphans.indexOf(state);
            if (result) {
                var existingState = getState(name_1);
                if (existingState && existingState.name === name_1) {
                    throw new Error("State '" + name_1 + "' is already defined");
                }
                var existingFutureState = getState(name_1 + '.**');
                if (existingFutureState) {
                    // Remove future state of the same name
                    this.router.stateRegistry.deregister(existingFutureState);
                }
                states[name_1] = state;
                this.attachRoute(state);
                if (orphanIdx >= 0)
                    orphans.splice(orphanIdx, 1);
                registered.push(state);
                continue;
            }
            var prev = previousQueueLength[name_1];
            previousQueueLength[name_1] = queue.length;
            if (orphanIdx >= 0 && prev === queue.length) {
                // Wait until two consecutive iterations where no additional states were dequeued successfully.
                // throw new Error(`Cannot register orphaned state '${name}'`);
                queue.push(state);
                notifyListeners();
                return states;
            }
            else if (orphanIdx < 0) {
                orphans.push(state);
            }
            queue.push(state);
        }
        notifyListeners();
        return states;
    };
    StateQueueManager.prototype.attachRoute = function (state) {
        if (state.abstract || !state.url)
            return;
        var rulesApi = this.router.urlService.rules;
        rulesApi.rule(rulesApi.urlRuleFactory.create(state));
    };
    return StateQueueManager;
}());
export { StateQueueManager };
//# sourceMappingURL=stateQueueManager.js.map