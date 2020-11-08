/** An enum for Transition Rejection reasons */
declare enum RejectType {
    /**
     * A new transition superseded this one.
     *
     * While this transition was running, a new transition started.
     * This transition is cancelled because it was superseded by new transition.
     */
    SUPERSEDED = 2,
    /**
     * The transition was aborted
     *
     * The transition was aborted by a hook which returned `false`
     */
    ABORTED = 3,
    /**
     * The transition was invalid
     *
     * The transition was never started because it was invalid
     */
    INVALID = 4,
    /**
     * The transition was ignored
     *
     * The transition was ignored because it would have no effect.
     *
     * Either:
     *
     * - The transition is targeting the current state and parameter values
     * - The transition is targeting the same state and parameter values as the currently running transition.
     */
    IGNORED = 5,
    /**
     * The transition errored.
     *
     * This generally means a hook threw an error or returned a rejected promise
     */
    ERROR = 6
}
export { RejectType };
export declare class Rejection {
    /** @internal */
    $id: number;
    /**
     * The type of the rejection.
     *
     * This value is an number representing the type of transition rejection.
     * If using Typescript, this is a Typescript enum.
     *
     * - [[RejectType.SUPERSEDED]] (`2`)
     * - [[RejectType.ABORTED]] (`3`)
     * - [[RejectType.INVALID]] (`4`)
     * - [[RejectType.IGNORED]] (`5`)
     * - [[RejectType.ERROR]] (`6`)
     *
     */
    type: RejectType;
    /**
     * A message describing the rejection
     */
    message: string;
    /**
     * A detail object
     *
     * This value varies based on the mechanism for rejecting the transition.
     * For example, if an error was thrown from a hook, the `detail` will be the `Error` object.
     * If a hook returned a rejected promise, the `detail` will be the rejected value.
     */
    detail: any;
    /**
     * Indicates if the transition was redirected.
     *
     * When a transition is redirected, the rejection [[type]] will be [[RejectType.SUPERSEDED]] and this flag will be true.
     */
    redirected: boolean;
    /** Returns true if the obj is a rejected promise created from the `asPromise` factory */
    static isRejectionPromise(obj: any): boolean;
    /** Returns a Rejection due to transition superseded */
    static superseded(detail?: any, options?: any): Rejection;
    /** Returns a Rejection due to redirected transition */
    static redirected(detail?: any): Rejection;
    /** Returns a Rejection due to invalid transition */
    static invalid(detail?: any): Rejection;
    /** Returns a Rejection due to ignored transition */
    static ignored(detail?: any): Rejection;
    /** Returns a Rejection due to aborted transition */
    static aborted(detail?: any): Rejection;
    /** Returns a Rejection due to aborted transition */
    static errored(detail?: any): Rejection;
    /**
     * Returns a Rejection
     *
     * Normalizes a value as a Rejection.
     * If the value is already a Rejection, returns it.
     * Otherwise, wraps and returns the value as a Rejection (Rejection type: ERROR).
     *
     * @returns `detail` if it is already a `Rejection`, else returns an ERROR Rejection.
     */
    static normalize(detail?: Rejection | Error | any): Rejection;
    constructor(type: number, message?: string, detail?: any);
    toString(): string;
    toPromise(): Promise<any>;
}
