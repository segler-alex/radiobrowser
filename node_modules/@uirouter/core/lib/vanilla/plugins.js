"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.memoryLocationPlugin = exports.pushStateLocationPlugin = exports.hashLocationPlugin = exports.servicesPlugin = void 0;
var browserLocationConfig_1 = require("./browserLocationConfig");
var hashLocationService_1 = require("./hashLocationService");
var utils_1 = require("./utils");
var pushStateLocationService_1 = require("./pushStateLocationService");
var memoryLocationService_1 = require("./memoryLocationService");
var memoryLocationConfig_1 = require("./memoryLocationConfig");
var injector_1 = require("./injector");
var q_1 = require("./q");
var coreservices_1 = require("../common/coreservices");
function servicesPlugin(router) {
    coreservices_1.services.$injector = injector_1.$injector;
    coreservices_1.services.$q = q_1.$q;
    return { name: 'vanilla.services', $q: q_1.$q, $injector: injector_1.$injector, dispose: function () { return null; } };
}
exports.servicesPlugin = servicesPlugin;
/** A `UIRouterPlugin` uses the browser hash to get/set the current location */
exports.hashLocationPlugin = utils_1.locationPluginFactory('vanilla.hashBangLocation', false, hashLocationService_1.HashLocationService, browserLocationConfig_1.BrowserLocationConfig);
/** A `UIRouterPlugin` that gets/sets the current location using the browser's `location` and `history` apis */
exports.pushStateLocationPlugin = utils_1.locationPluginFactory('vanilla.pushStateLocation', true, pushStateLocationService_1.PushStateLocationService, browserLocationConfig_1.BrowserLocationConfig);
/** A `UIRouterPlugin` that gets/sets the current location from an in-memory object */
exports.memoryLocationPlugin = utils_1.locationPluginFactory('vanilla.memoryLocation', false, memoryLocationService_1.MemoryLocationService, memoryLocationConfig_1.MemoryLocationConfig);
//# sourceMappingURL=plugins.js.map