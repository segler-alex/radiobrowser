"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransitionEventType = void 0;
var transitionHook_1 = require("./transitionHook");
/**
 * This class defines a type of hook, such as `onBefore` or `onEnter`.
 * Plugins can define custom hook types, such as sticky states does for `onInactive`.
 */
var TransitionEventType = /** @class */ (function () {
    /* tslint:disable:no-inferrable-types */
    function TransitionEventType(name, hookPhase, hookOrder, criteriaMatchPath, reverseSort, getResultHandler, getErrorHandler, synchronous) {
        if (reverseSort === void 0) { reverseSort = false; }
        if (getResultHandler === void 0) { getResultHandler = transitionHook_1.TransitionHook.HANDLE_RESULT; }
        if (getErrorHandler === void 0) { getErrorHandler = transitionHook_1.TransitionHook.REJECT_ERROR; }
        if (synchronous === void 0) { synchronous = false; }
        this.name = name;
        this.hookPhase = hookPhase;
        this.hookOrder = hookOrder;
        this.criteriaMatchPath = criteriaMatchPath;
        this.reverseSort = reverseSort;
        this.getResultHandler = getResultHandler;
        this.getErrorHandler = getErrorHandler;
        this.synchronous = synchronous;
    }
    return TransitionEventType;
}());
exports.TransitionEventType = TransitionEventType;
//# sourceMappingURL=transitionEventType.js.map