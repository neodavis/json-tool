export interface Flyweight<T = unknown> {
    getKey(): string;
    getValue(): T;
}