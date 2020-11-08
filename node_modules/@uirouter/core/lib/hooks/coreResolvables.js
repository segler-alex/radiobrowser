"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.treeChangesCleanup = exports.registerAddCoreResolvables = void 0;
var transition_1 = require("../transition/transition");
var router_1 = require("../router");
var resolve_1 = require("../resolve");
var common_1 = require("../common");
function addCoreResolvables(trans) {
    trans.addResolvable(resolve_1.Resolvable.fromData(router_1.UIRouter, trans.router), '');
    trans.addResolvable(resolve_1.Resolvable.fromData(transition_1.Transition, trans), '');
    trans.addResolvable(resolve_1.Resolvable.fromData('$transition$', trans), '');
    trans.addResolvable(resolve_1.Resolvable.fromData('$stateParams', trans.params()), '');
    trans.entering().forEach(function (state) {
        trans.addResolvable(resolve_1.Resolvable.fromData('$state$', state), state);
    });
}
exports.registerAddCoreResolvables = function (transitionService) {
    return transitionService.onCreate({}, addCoreResolvables);
};
var TRANSITION_TOKENS = ['$transition$', transition_1.Transition];
var isTransition = common_1.inArray(TRANSITION_TOKENS);
// References to Transition in the treeChanges pathnodes makes all
// previous Transitions reachable in memory, causing a memory leak
// This function removes resolves for '$transition$' and `Transition` from the treeChanges.
// Do not use this on current transitions, only on old ones.
exports.treeChangesCleanup = function (trans) {
    var nodes = common_1.values(trans.treeChanges()).reduce(common_1.unnestR, []).reduce(common_1.uniqR, []);
    // If the resolvable is a Transition, return a new resolvable with null data
    var replaceTransitionWithNull = function (r) {
        return isTransition(r.token) ? resolve_1.Resolvable.fromData(r.token, null) : r;
    };
    nodes.forEach(function (node) {
        node.resolvables = node.resolvables.map(replaceTransitionWithNull);
    });
};
//# sourceMappingURL=coreResolvables.js.map