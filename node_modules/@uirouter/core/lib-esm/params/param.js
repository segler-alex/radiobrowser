import { extend, filter, map, allTrueR, find } from '../common/common';
import { prop } from '../common/hof';
import { isInjectable, isDefined, isString, isArray, isUndefined } from '../common/predicates';
import { services } from '../common/coreservices';
import { ParamType } from './paramType';
var hasOwn = Object.prototype.hasOwnProperty;
var isShorthand = function (cfg) {
    return ['value', 'type', 'squash', 'array', 'dynamic'].filter(hasOwn.bind(cfg || {})).length === 0;
};
var DefType;
(function (DefType) {
    DefType[DefType["PATH"] = 0] = "PATH";
    DefType[DefType["SEARCH"] = 1] = "SEARCH";
    DefType[DefType["CONFIG"] = 2] = "CONFIG";
})(DefType || (DefType = {}));
export { DefType };
function getParamDeclaration(paramName, location, state) {
    var noReloadOnSearch = (state.reloadOnSearch === false && location === DefType.SEARCH) || undefined;
    var dynamic = find([state.dynamic, noReloadOnSearch], isDefined);
    var defaultConfig = isDefined(dynamic) ? { dynamic: dynamic } : {};
    var paramConfig = unwrapShorthand(state && state.params && state.params[paramName]);
    return extend(defaultConfig, paramConfig);
}
function unwrapShorthand(cfg) {
    cfg = isShorthand(cfg) ? { value: cfg } : cfg;
    getStaticDefaultValue['__cacheable'] = true;
    function getStaticDefaultValue() {
        return cfg.value;
    }
    var $$fn = isInjectable(cfg.value) ? cfg.value : getStaticDefaultValue;
    return extend(cfg, { $$fn: $$fn });
}
function getType(cfg, urlType, location, id, paramTypes) {
    if (cfg.type && urlType && urlType.name !== 'string')
        throw new Error("Param '" + id + "' has two type configurations.");
    if (cfg.type && urlType && urlType.name === 'string' && paramTypes.type(cfg.type))
        return paramTypes.type(cfg.type);
    if (urlType)
        return urlType;
    if (!cfg.type) {
        var type = location === DefType.CONFIG
            ? 'any'
            : location === DefType.PATH
                ? 'path'
                : location === DefType.SEARCH
                    ? 'query'
                    : 'string';
        return paramTypes.type(type);
    }
    return cfg.type instanceof ParamType ? cfg.type : paramTypes.type(cfg.type);
}
/** returns false, true, or the squash value to indicate the "default parameter url squash policy". */
function getSquashPolicy(config, isOptional, defaultPolicy) {
    var squash = config.squash;
    if (!isOptional || squash === false)
        return false;
    if (!isDefined(squash) || squash == null)
        return defaultPolicy;
    if (squash === true || isString(squash))
        return squash;
    throw new Error("Invalid squash policy: '" + squash + "'. Valid policies: false, true, or arbitrary string");
}
function getReplace(config, arrayMode, isOptional, squash) {
    var defaultPolicy = [
        { from: '', to: isOptional || arrayMode ? undefined : '' },
        { from: null, to: isOptional || arrayMode ? undefined : '' },
    ];
    var replace = isArray(config.replace) ? config.replace : [];
    if (isString(squash))
        replace.push({ from: squash, to: undefined });
    var configuredKeys = map(replace, prop('from'));
    return filter(defaultPolicy, function (item) { return configuredKeys.indexOf(item.from) === -1; }).concat(replace);
}
var Param = /** @class */ (function () {
    function Param(id, type, location, urlConfig, state) {
        var config = getParamDeclaration(id, location, state);
        type = getType(config, type, location, id, urlConfig.paramTypes);
        var arrayMode = getArrayMode();
        type = arrayMode ? type.$asArray(arrayMode, location === DefType.SEARCH) : type;
        var isOptional = config.value !== undefined || location === DefType.SEARCH;
        var dynamic = isDefined(config.dynamic) ? !!config.dynamic : !!type.dynamic;
        var raw = isDefined(config.raw) ? !!config.raw : !!type.raw;
        var squash = getSquashPolicy(config, isOptional, urlConfig.defaultSquashPolicy());
        var replace = getReplace(config, arrayMode, isOptional, squash);
        var inherit = isDefined(config.inherit) ? !!config.inherit : !!type.inherit;
        // array config: param name (param[]) overrides default settings.  explicit config overrides param name.
        function getArrayMode() {
            var arrayDefaults = { array: location === DefType.SEARCH ? 'auto' : false };
            var arrayParamNomenclature = id.match(/\[\]$/) ? { array: true } : {};
            return extend(arrayDefaults, arrayParamNomenclature, config).array;
        }
        extend(this, { id: id, type: type, location: location, isOptional: isOptional, dynamic: dynamic, raw: raw, squash: squash, replace: replace, inherit: inherit, array: arrayMode, config: config });
    }
    Param.values = function (params, values) {
        if (values === void 0) { values = {}; }
        var paramValues = {};
        for (var _i = 0, params_1 = params; _i < params_1.length; _i++) {
            var param = params_1[_i];
            paramValues[param.id] = param.value(values[param.id]);
        }
        return paramValues;
    };
    /**
     * Finds [[Param]] objects which have different param values
     *
     * Filters a list of [[Param]] objects to only those whose parameter values differ in two param value objects
     *
     * @param params: The list of Param objects to filter
     * @param values1: The first set of parameter values
     * @param values2: the second set of parameter values
     *
     * @returns any Param objects whose values were different between values1 and values2
     */
    Param.changed = function (params, values1, values2) {
        if (values1 === void 0) { values1 = {}; }
        if (values2 === void 0) { values2 = {}; }
        return params.filter(function (param) { return !param.type.equals(values1[param.id], values2[param.id]); });
    };
    /**
     * Checks if two param value objects are equal (for a set of [[Param]] objects)
     *
     * @param params The list of [[Param]] objects to check
     * @param values1 The first set of param values
     * @param values2 The second set of param values
     *
     * @returns true if the param values in values1 and values2 are equal
     */
    Param.equals = function (params, values1, values2) {
        if (values1 === void 0) { values1 = {}; }
        if (values2 === void 0) { values2 = {}; }
        return Param.changed(params, values1, values2).length === 0;
    };
    /** Returns true if a the parameter values are valid, according to the Param definitions */
    Param.validates = function (params, values) {
        if (values === void 0) { values = {}; }
        return params.map(function (param) { return param.validates(values[param.id]); }).reduce(allTrueR, true);
    };
    Param.prototype.isDefaultValue = function (value) {
        return this.isOptional && this.type.equals(this.value(), value);
    };
    /**
     * [Internal] Gets the decoded representation of a value if the value is defined, otherwise, returns the
     * default value, which may be the result of an injectable function.
     */
    Param.prototype.value = function (value) {
        var _this = this;
        /**
         * [Internal] Get the default value of a parameter, which may be an injectable function.
         */
        var getDefaultValue = function () {
            if (_this._defaultValueCache)
                return _this._defaultValueCache.defaultValue;
            if (!services.$injector)
                throw new Error('Injectable functions cannot be called at configuration time');
            var defaultValue = services.$injector.invoke(_this.config.$$fn);
            if (defaultValue !== null && defaultValue !== undefined && !_this.type.is(defaultValue))
                throw new Error("Default value (" + defaultValue + ") for parameter '" + _this.id + "' is not an instance of ParamType (" + _this.type.name + ")");
            if (_this.config.$$fn['__cacheable']) {
                _this._defaultValueCache = { defaultValue: defaultValue };
            }
            return defaultValue;
        };
        var replaceSpecialValues = function (val) {
            for (var _i = 0, _a = _this.replace; _i < _a.length; _i++) {
                var tuple = _a[_i];
                if (tuple.from === val)
                    return tuple.to;
            }
            return val;
        };
        value = replaceSpecialValues(value);
        return isUndefined(value) ? getDefaultValue() : this.type.$normalize(value);
    };
    Param.prototype.isSearch = function () {
        return this.location === DefType.SEARCH;
    };
    Param.prototype.validates = function (value) {
        // There was no parameter value, but the param is optional
        if ((isUndefined(value) || value === null) && this.isOptional)
            return true;
        // The value was not of the correct ParamType, and could not be decoded to the correct ParamType
        var normalized = this.type.$normalize(value);
        if (!this.type.is(normalized))
            return false;
        // The value was of the correct type, but when encoded, did not match the ParamType's regexp
        var encoded = this.type.encode(normalized);
        return !(isString(encoded) && !this.type.pattern.exec(encoded));
    };
    Param.prototype.toString = function () {
        return "{Param:" + this.id + " " + this.type + " squash: '" + this.squash + "' optional: " + this.isOptional + "}";
    };
    return Param;
}());
export { Param };
//# sourceMappingURL=param.js.map