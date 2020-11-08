"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.services = exports.makeStub = void 0;
var noImpl = function (fnname) { return function () {
    throw new Error("No implementation for " + fnname + ". The framework specific code did not implement this method.");
}; };
exports.makeStub = function (service, methods) {
    return methods.reduce(function (acc, key) { return ((acc[key] = noImpl(service + "." + key + "()")), acc); }, {});
};
var services = {
    $q: undefined,
    $injector: undefined,
};
exports.services = services;
//# sourceMappingURL=coreservices.js.map