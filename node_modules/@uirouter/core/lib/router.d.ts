import { UrlMatcherFactory } from './url/urlMatcherFactory';
import { UrlRouter } from './url/urlRouter';
import { TransitionService } from './transition/transitionService';
import { ViewService } from './view/view';
import { StateRegistry } from './state/stateRegistry';
import { StateService } from './state/stateService';
import { UIRouterGlobals } from './globals';
import { UIRouterPlugin, Disposable } from './interface';
import { UrlService } from './url/urlService';
import { LocationServices, LocationConfig } from './common/coreservices';
import { Trace } from './common/trace';
/**
 * An instance of UI-Router.
 *
 * This object contains references to service APIs which define your application's routing behavior.
 */
export declare class UIRouter {
    locationService: LocationServices;
    locationConfig: LocationConfig;
    /** @internal */ $id: number;
    /** @internal */ _disposed: boolean;
    /** @internal */ private _disposables;
    /** Enable/disable tracing to the javascript console */
    trace: Trace;
    /** Provides services related to ui-view synchronization */
    viewService: ViewService;
    /** An object that contains global router state, such as the current state and params */
    globals: UIRouterGlobals;
    /** A service that exposes global Transition Hooks */
    transitionService: TransitionService;
    /**
     * Deprecated for public use. Use [[urlService]] instead.
     * @deprecated Use [[urlService]] instead
     */
    urlMatcherFactory: UrlMatcherFactory;
    /**
     * Deprecated for public use. Use [[urlService]] instead.
     * @deprecated Use [[urlService]] instead
     */
    urlRouter: UrlRouter;
    /** Provides services related to the URL */
    urlService: UrlService;
    /** Provides a registry for states, and related registration services */
    stateRegistry: StateRegistry;
    /** Provides services related to states */
    stateService: StateService;
    /** @internal plugin instances are registered here */
    private _plugins;
    /** Registers an object to be notified when the router is disposed */
    disposable(disposable: Disposable): void;
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
    dispose(disposable?: any): void;
    /**
     * Creates a new `UIRouter` object
     *
     * @param locationService a [[LocationServices]] implementation
     * @param locationConfig a [[LocationConfig]] implementation
     * @internal
     */
    constructor(locationService?: LocationServices, locationConfig?: LocationConfig);
    /** Add plugin (as ES6 class) */
    plugin<T extends UIRouterPlugin>(plugin: {
        new (router: UIRouter, options?: any): T;
    }, options?: any): T;
    /** Add plugin (as javascript constructor function) */
    plugin<T extends UIRouterPlugin>(plugin: {
        (router: UIRouter, options?: any): void;
    }, options?: any): T;
    /** Add plugin (as javascript factory function) */
    plugin<T extends UIRouterPlugin>(plugin: PluginFactory<T>, options?: any): T;
    /**
     * Returns a plugin registered with the given `pluginName`.
     *
     * @param pluginName the name of the plugin to get
     * @return the plugin, or undefined
     */
    getPlugin(pluginName: string): UIRouterPlugin;
    /**
     * Returns all registered plugins
     * @return all registered plugins
     */
    getPlugin(): UIRouterPlugin[];
}
/** @internal */
export declare type PluginFactory<T> = (router: UIRouter, options?: any) => T;
