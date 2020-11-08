import { UrlMatcherFactory } from './url/urlMatcherFactory';
import { UrlRouter } from './url/urlRouter';
import { TransitionService } from './transition/transitionService';
import { ViewService } from './view/view';
import { StateRegistry } from './state/stateRegistry';
import { StateService } from './state/stateService';
import { UIRouterGlobals } from './globals';
import { values, removeFrom } from './common/common';
import { isFunction } from './common/predicates';
import { UrlService } from './url/urlService';
import { trace } from './common/trace';
import { makeStub } from './common';
/** @internal */
var _routerInstance = 0;
/** @internal */
var locSvcFns = ['url', 'path', 'search', 'hash', 'onChange'];
/** @internal */
var locCfgFns = ['port', 'protocol', 'host', 'baseHref', 'html5Mode', 'hashPrefix'];
/** @internal */
var locationServiceStub = makeStub('LocationServices', locSvcFns);
/** @internal */
var locationConfigStub = makeStub('LocationConfig', locCfgFns);
/**
 * An instance of UI-Router.
 *
 * This object contains references to service APIs which define your application's routing behavior.
 */
var UIRouter = /** @class */ (function () {
    /**
     * Creates a new `UIRouter` object
     *
     * @param locationService a [[LocationServices]] implementation
     * @param locationConfig a [[LocationConfig]] implementation
     * @internal
     */
    function UIRouter(locationService, locationConfig) {
        if (locationService === void 0) { locationService = locationServiceStub; }
        if (locationConfig === void 0) { locationConfig = locationConfigStub; }
        this.locationService = locationService;
        this.locationConfig = locationConfig;
        /** @internal */ this.$id = _routerInstance++;
        /** @internal */ this._disposed = false;
        /** @internal */ this._disposables = [];
        /** Enable/disable tracing to the javascript console */
        this.trace = trace;
        /** Provides services related to ui-view synchronization */
        this.viewService = new ViewService(this);
        /** An object that contains global router state, such as the current state and params */
        this.globals = new UIRouterGlobals();
        /** A service that exposes global Transition Hooks */
        this.transitionService = new TransitionService(this);
        /**
         * Deprecated for public use. Use [[urlService]] instead.
         * @deprecated Use [[urlService]] instead
         */
        this.urlMatcherFactory = new UrlMatcherFactory(this);
        /**
         * Deprecated for public use. Use [[urlService]] instead.
         * @deprecated Use [[urlService]] instead
         */
        this.urlRouter = new UrlRouter(this);
        /** Provides services related to the URL */
        this.urlService = new UrlService(this);
        /** Provides a registry for states, and related registration services */
        this.stateRegistry = new StateRegistry(this);
        /** Provides services related to states */
        this.stateService = new StateService(this);
        /** @internal plugin instances are registered here */
        this._plugins = {};
        this.viewService._pluginapi._rootViewContext(this.stateRegistry.root());
        this.globals.$current = this.stateRegistry.root();
        this.globals.current = this.globals.$current.self;
        this.disposable(this.globals);
        this.disposable(this.stateService);
        this.disposable(this.stateRegistry);
        this.disposable(this.transitionService);
        this.disposable(this.urlService);
        this.disposable(locationService);
        this.disposable(locationConfig);
    }
    /** Registers an object to be notified when the router is disposed */
    UIRouter.prototype.disposable = function (disposable) {
        this._disposables.push(disposable);
    };
    /**
     * Disposes this router instance
     *
     * When called, clears resources retained by the router by calling `dispose(this)` on all
     * registered [[disposable]] objects.
     *
     * Or, if a `disposable` object is provided, calls `dispose(this)` on that object only.
     *
     * @internal
     * @param disposable (optional) the disposable to dispose
     */
    UIRouter.prototype.dispose = function (disposable) {
        var _this = this;
        if (disposable && isFunction(disposable.dispose)) {
            disposable.dispose(this);
            return undefined;
        }
        this._disposed = true;
        this._disposables.slice().forEach(function (d) {
            try {
                typeof d.dispose === 'function' && d.dispose(_this);
                removeFrom(_this._disposables, d);
            }
            catch (ignored) { }
        });
    };
    /**
     * Adds a plugin to UI-Router
     *
     * This method adds a UI-Router Plugin.
     * A plugin can enhance or change UI-Router behavior using any public API.
     *
     * #### Example:
     * ```js
     * import { MyCoolPlugin } from "ui-router-cool-plugin";
     *
     * var plugin = router.addPlugin(MyCoolPlugin);
     * ```
     *
     * ### Plugin authoring
     *
     * A plugin is simply a class (or constructor function) which accepts a [[UIRouter]] instance and (optionally) an options object.
     *
     * The plugin can implement its functionality using any of the public APIs of [[UIRouter]].
     * For example, it may configure router options or add a Transition Hook.
     *
     * The plugin can then be published as a separate module.
     *
     * #### Example:
     * ```js
     * export class MyAuthPlugin implements UIRouterPlugin {
     *   constructor(router: UIRouter, options: any) {
     *     this.name = "MyAuthPlugin";
     *     let $transitions = router.transitionService;
     *     let $state = router.stateService;
     *
     *     let authCriteria = {
     *       to: (state) => state.data && state.data.requiresAuth
     *     };
     *
     *     function authHook(transition: Transition) {
     *       let authService = transition.injector().get('AuthService');
     *       if (!authService.isAuthenticated()) {
     *         return $state.target('login');
     *       }
     *     }
     *
     *     $transitions.onStart(authCriteria, authHook);
     *   }
     * }
     * ```
     *
     * @param plugin one of:
     *        - a plugin class which implements [[UIRouterPlugin]]
     *        - a constructor function for a [[UIRouterPlugin]] which accepts a [[UIRouter]] instance
     *        - a factory function which accepts a [[UIRouter]] instance and returns a [[UIRouterPlugin]] instance
     * @param options options to pass to the plugin class/factory
     * @returns the registered plugin instance
     */
    UIRouter.prototype.plugin = function (plugin, options) {
        if (options === void 0) { options = {}; }
        var pluginInstance = new plugin(this, options);
        if (!pluginInstance.name)
            throw new Error('Required property `name` missing on plugin: ' + pluginInstance);
        this._disposables.push(pluginInstance);
        return (this._plugins[pluginInstance.name] = pluginInstance);
    };
    UIRouter.prototype.getPlugin = function (pluginName) {
        return pluginName ? this._plugins[pluginName] : values(this._plugins);
    };
    return UIRouter;
}());
export { UIRouter };
//# sourceMappingURL=router.js.map