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
exports.core = void 0;
/**
 * Main entry point for angular 1.x build
 * @publicapi @module ng1
 */ /** */
__exportStar(require("./interface"), exports);
__exportStar(require("./services"), exports);
__exportStar(require("./statebuilders/views"), exports);
__exportStar(require("./stateProvider"), exports);
__exportStar(require("./urlRouterProvider"), exports);
require("./injectables");
require("./directives/stateDirectives");
require("./stateFilters");
require("./directives/viewDirective");
require("./viewScroll");
exports.default = 'ui.router';
var core = require("@uirouter/core");
exports.core = core;
__exportStar(require("@uirouter/core"), exports);
//# sourceMappingURL=index.js.map