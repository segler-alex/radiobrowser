"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queue = void 0;
var common_1 = require("./common");
var Queue = /** @class */ (function () {
    function Queue(_items, _limit) {
        if (_items === void 0) { _items = []; }
        if (_limit === void 0) { _limit = null; }
        this._items = _items;
        this._limit = _limit;
        this._evictListeners = [];
        this.onEvict = common_1.pushTo(this._evictListeners);
    }
    Queue.prototype.enqueue = function (item) {
        var items = this._items;
        items.push(item);
        if (this._limit && items.length > this._limit)
            this.evict();
        return item;
    };
    Queue.prototype.evict = function () {
        var item = this._items.shift();
        this._evictListeners.forEach(function (fn) { return fn(item); });
        return item;
    };
    Queue.prototype.dequeue = function () {
        if (this.size())
            return this._items.splice(0, 1)[0];
    };
    Queue.prototype.clear = function () {
        var current = this._items;
        this._items = [];
        return current;
    };
    Queue.prototype.size = function () {
        return this._items.length;
    };
    Queue.prototype.remove = function (item) {
        var idx = this._items.indexOf(item);
        return idx > -1 && this._items.splice(idx, 1)[0];
    };
    Queue.prototype.peekTail = function () {
        return this._items[this._items.length - 1];
    };
    Queue.prototype.peekHead = function () {
        if (this.size())
            return this._items[0];
    };
    return Queue;
}());
exports.Queue = Queue;
//# sourceMappingURL=queue.js.map