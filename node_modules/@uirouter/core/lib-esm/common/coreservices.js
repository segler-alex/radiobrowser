var noImpl = function (fnname) { return function () {
    throw new Error("No implementation for " + fnname + ". The framework specific code did not implement this method.");
}; };
export var makeStub = function (service, methods) {
    return methods.reduce(function (acc, key) { return ((acc[key] = noImpl(service + "." + key + "()")), acc); }, {});
};
var services = {
    $q: undefined,
    $injector: undefined,
};
export { services };
//# sourceMappingURL=coreservices.js.map