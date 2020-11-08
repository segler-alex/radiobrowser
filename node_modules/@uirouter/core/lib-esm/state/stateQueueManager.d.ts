import { _StateDeclaration } from './interface';
import { StateObject } from './stateObject';
import { StateBuilder } from './stateBuilder';
import { StateRegistryListener } from './stateRegistry';
import { Disposable } from '../interface';
import { UIRouter } from '../router';
export declare class StateQueueManager implements Disposable {
    private router;
    states: {
        [key: string]: StateObject;
    };
    builder: StateBuilder;
    listeners: StateRegistryListener[];
    queue: StateObject[];
    constructor(router: UIRouter, states: {
        [key: string]: StateObject;
    }, builder: StateBuilder, listeners: StateRegistryListener[]);
    dispose(): void;
    register(stateDecl: _StateDeclaration): StateObject;
    flush(): {
        [key: string]: StateObject;
    };
    attachRoute(state: StateObject): void;
}
