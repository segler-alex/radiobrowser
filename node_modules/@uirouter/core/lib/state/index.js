"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * # The state subsystem
 *
 * This subsystem implements the ui-router state tree
 *
 * - The [[StateService]] has state-related service methods such as:
 *   - [[StateService.get]]: Get a registered [[StateDeclaration]] object
 *   - [[StateService.go]]: Transition from the current state to a new state
 *   - [[StateService.reload]]: Reload the current state
 *   - [[StateService.target]]: Get a [[TargetState]] (useful when redirecting from a Transition Hook)
 *   - [[StateService.onInvalid]]: Register a callback for when a transition to an invalid state is started
 *   - [[StateService.defaultErrorHandler]]: Register a global callback for when a transition errors
 * - The [[StateDeclaration]] interface defines the shape of a state declaration
 * - The [[StateRegistry]] contains all the registered states
 *   - States can be added/removed using the [[StateRegistry.register]] and [[StateRegistry.deregister]]
 *     - Note: Bootstrap state registration differs by front-end framework.
 *   - Get notified of state registration/deregistration using [[StateRegistry.onStatesChanged]].
 *
 * @packageDocumentation
 */
__exportStar(require("./interface"), exports);
__exportStar(require("./stateBuilder"), exports);
__exportStar(require("./stateObject"), exports);
__exportStar(require("./stateMatcher"), exports);
__exportStar(require("./stateQueueManager"), exports);
__exportStar(require("./stateRegistry"), exports);
__exportStar(require("./stateService"), exports);
__exportStar(require("./targetState"), exports);
//# sourceMappingURL=index.js.map