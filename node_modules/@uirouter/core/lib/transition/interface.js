"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransitionHookScope = exports.TransitionHookPhase = void 0;
var TransitionHookPhase;
(function (TransitionHookPhase) {
    TransitionHookPhase[TransitionHookPhase["CREATE"] = 0] = "CREATE";
    TransitionHookPhase[TransitionHookPhase["BEFORE"] = 1] = "BEFORE";
    TransitionHookPhase[TransitionHookPhase["RUN"] = 2] = "RUN";
    TransitionHookPhase[TransitionHookPhase["SUCCESS"] = 3] = "SUCCESS";
    TransitionHookPhase[TransitionHookPhase["ERROR"] = 4] = "ERROR";
})(TransitionHookPhase || (TransitionHookPhase = {}));
exports.TransitionHookPhase = TransitionHookPhase;
var TransitionHookScope;
(function (TransitionHookScope) {
    TransitionHookScope[TransitionHookScope["TRANSITION"] = 0] = "TRANSITION";
    TransitionHookScope[TransitionHookScope["STATE"] = 1] = "STATE";
})(TransitionHookScope || (TransitionHookScope = {}));
exports.TransitionHookScope = TransitionHookScope;
//# sourceMappingURL=interface.js.map