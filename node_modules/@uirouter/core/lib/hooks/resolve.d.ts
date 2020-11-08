import { TransitionService } from '../transition/transitionService';
export declare const RESOLVE_HOOK_PRIORITY = 1000;
export declare const registerEagerResolvePath: (transitionService: TransitionService) => Function;
export declare const registerLazyResolveState: (transitionService: TransitionService) => Function;
export declare const registerResolveRemaining: (transitionService: TransitionService) => Function;
