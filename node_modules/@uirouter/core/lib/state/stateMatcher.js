"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateMatcher = void 0;
var predicates_1 = require("../common/predicates");
var common_1 = require("../common/common");
var safeConsole_1 = require("../common/safeConsole");
var StateMatcher = /** @class */ (function () {
    function StateMatcher(_states) {
        this._states = _states;
    }
    StateMatcher.prototype.isRelative = function (stateName) {
        stateName = stateName || '';
        return stateName.indexOf('.') === 0 || stateName.indexOf('^') === 0;
    };
    StateMatcher.prototype.find = function (stateOrName, base, matchGlob) {
        if (matchGlob === void 0) { matchGlob = true; }
        if (!stateOrName && stateOrName !== '')
            return undefined;
        var isStr = predicates_1.isString(stateOrName);
        var name = isStr ? stateOrName : stateOrName.name;
        if (this.isRelative(name))
            name = this.resolvePath(name, base);
        var state = this._states[name];
        if (state && (isStr || (!isStr && (state === stateOrName || state.self === stateOrName)))) {
            return state;
        }
        else if (isStr && matchGlob) {
            var _states = common_1.values(this._states);
            var matches = _states.filter(function (_state) { return _state.__stateObjectCache.nameGlob && _state.__stateObjectCache.nameGlob.matches(name); });
            if (matches.length > 1) {
                safeConsole_1.safeConsole.error("stateMatcher.find: Found multiple matches for " + name + " using glob: ", matches.map(function (match) { return match.name; }));
            }
            return matches[0];
        }
        return undefined;
    };
    StateMatcher.prototype.resolvePath = function (name, base) {
        if (!base)
            throw new Error("No reference point given for path '" + name + "'");
        var baseState = this.find(base);
        var splitName = name.split('.');
        var pathLength = splitName.length;
        var i = 0, current = baseState;
        for (; i < pathLength; i++) {
            if (splitName[i] === '' && i === 0) {
                current = baseState;
                continue;
            }
            if (splitName[i] === '^') {
                if (!current.parent)
                    throw new Error("Path '" + name + "' not valid for state '" + baseState.name + "'");
                current = current.parent;
                continue;
            }
            break;
        }
        var relName = splitName.slice(i).join('.');
        return current.name + (current.name && relName ? '.' : '') + relName;
    };
    return StateMatcher;
}());
exports.StateMatcher = StateMatcher;
//# sourceMappingURL=stateMatcher.js.map