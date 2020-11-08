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
 * # Transition subsystem
 *
 * This module contains APIs related to a Transition.
 *
 * See:
 * - [[TransitionService]]
 * - [[Transition]]
 * - [[HookFn]], [[TransitionHookFn]], [[TransitionStateHookFn]], [[HookMatchCriteria]], [[HookResult]]
 *
 * @packageDocumentation @preferred
 */
__exportStar(require("./interface"), exports);
__exportStar(require("./hookBuilder"), exports);
__exportStar(require("./hookRegistry"), exports);
__exportStar(require("./rejectFactory"), exports);
__exportStar(require("./transition"), exports);
__exportStar(require("./transitionHook"), exports);
__exportStar(require("./transitionEventType"), exports);
__exportStar(require("./transitionService"), exports);
//# sourceMappingURL=index.js.map