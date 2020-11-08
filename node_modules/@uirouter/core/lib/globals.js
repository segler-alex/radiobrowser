"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIRouterGlobals = void 0;
var stateParams_1 = require("./params/stateParams");
var queue_1 = require("./common/queue");
/**
 * Global router state
 *
 * This is where we hold the global mutable state such as current state, current
 * params, current transition, etc.
 */
var UIRouterGlobals = /** @class */ (function () {
    function UIRouterGlobals() {
        /**
         * Current parameter values
         *
         * The parameter values from the latest successful transition
         */
        this.params = new stateParams_1.StateParams();
        /** @internal */
        this.lastStartedTransitionId = -1;
        /** @internal */
        this.transitionHistory = new queue_1.Queue([], 1);
        /** @internal */
        this.successfulTransitions = new queue_1.Queue([], 1);
    }
    UIRouterGlobals.prototype.dispose = function () {
        this.transitionHistory.clear();
        this.successfulTransitions.clear();
        this.transition = null;
    };
    return UIRouterGlobals;
}());
exports.UIRouterGlobals = UIRouterGlobals;
//# sourceMappingURL=globals.js.map