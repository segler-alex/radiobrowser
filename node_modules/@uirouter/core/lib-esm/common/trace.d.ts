import { Transition } from '../transition/transition';
import { ViewTuple } from '../view';
import { ActiveUIView, ViewConfig, ViewContext } from '../view/interface';
import { Resolvable } from '../resolve/resolvable';
import { PathNode } from '../path/pathNode';
import { PolicyWhen } from '../resolve/interface';
import { TransitionHook } from '../transition/transitionHook';
import { HookResult } from '../transition/interface';
import { StateObject } from '../state/stateObject';
/**
 * Trace categories Enum
 *
 * Enable or disable a category using [[Trace.enable]] or [[Trace.disable]]
 *
 * `trace.enable(Category.TRANSITION)`
 *
 * These can also be provided using a matching string, or position ordinal
 *
 * `trace.enable("TRANSITION")`
 *
 * `trace.enable(1)`
 */
declare enum Category {
    RESOLVE = 0,
    TRANSITION = 1,
    HOOK = 2,
    UIVIEW = 3,
    VIEWCONFIG = 4
}
export { Category };
/**
 * Prints UI-Router Transition trace information to the console.
 */
export declare class Trace {
    /** @internal */
    approximateDigests: number;
    /** @internal */
    private _enabled;
    /** @internal */
    constructor();
    /** @internal */
    private _set;
    /**
     * Enables a trace [[Category]]
     *
     * ```js
     * trace.enable("TRANSITION");
     * ```
     *
     * @param categories categories to enable. If `categories` is omitted, all categories are enabled.
     *        Also takes strings (category name) or ordinal (category position)
     */
    enable(...categories: (Category | string | number)[]): any;
    /**
     * Disables a trace [[Category]]
     *
     * ```js
     * trace.disable("VIEWCONFIG");
     * ```
     *
     * @param categories categories to disable. If `categories` is omitted, all categories are disabled.
     *        Also takes strings (category name) or ordinal (category position)
     */
    disable(...categories: (Category | string | number)[]): any;
    /**
     * Retrieves the enabled stateus of a [[Category]]
     *
     * ```js
     * trace.enabled("VIEWCONFIG"); // true or false
     * ```
     *
     * @returns boolean true if the category is enabled
     */
    enabled(category: Category | string | number): boolean;
    /** @internal called by ui-router code */
    traceTransitionStart(trans: Transition): void;
    /** @internal called by ui-router code */
    traceTransitionIgnored(trans: Transition): void;
    /** @internal called by ui-router code */
    traceHookInvocation(step: TransitionHook, trans: Transition, options: any): void;
    /** @internal called by ui-router code */
    traceHookResult(hookResult: HookResult, trans: Transition, transitionOptions: any): void;
    /** @internal called by ui-router code */
    traceResolvePath(path: PathNode[], when: PolicyWhen, trans?: Transition): void;
    /** @internal called by ui-router code */
    traceResolvableResolved(resolvable: Resolvable, trans?: Transition): void;
    /** @internal called by ui-router code */
    traceError(reason: any, trans: Transition): void;
    /** @internal called by ui-router code */
    traceSuccess(finalState: StateObject, trans: Transition): void;
    /** @internal called by ui-router code */
    traceUIViewEvent(event: string, viewData: ActiveUIView, extra?: string): void;
    /** @internal called by ui-router code */
    traceUIViewConfigUpdated(viewData: ActiveUIView, context: ViewContext): void;
    /** @internal called by ui-router code */
    traceUIViewFill(viewData: ActiveUIView, html: string): void;
    /** @internal called by ui-router code */
    traceViewSync(pairs: ViewTuple[]): void;
    /** @internal called by ui-router code */
    traceViewServiceEvent(event: string, viewConfig: ViewConfig): void;
    /** @internal called by ui-router code */
    traceViewServiceUIViewEvent(event: string, viewData: ActiveUIView): void;
}
/**
 * The [[Trace]] singleton
 *
 * #### Example:
 * ```js
 * import {trace} from "@uirouter/core";
 * trace.enable(1, 5);
 * ```
 */
declare const trace: Trace;
export { trace };
