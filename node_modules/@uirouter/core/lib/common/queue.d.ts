export declare class Queue<T> {
    private _items;
    private _limit;
    private _evictListeners;
    onEvict: (val: (item: T) => void) => (item: T) => void;
    constructor(_items?: T[], _limit?: number);
    enqueue(item: T): T;
    evict(): T;
    dequeue(): T;
    clear(): Array<T>;
    size(): number;
    remove(item: T): T;
    peekTail(): T;
    peekHead(): T;
}
