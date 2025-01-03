export interface JsonElementFlyweight {
    getType(): string;
    getValue(): any;
    format(indent: number): string;
}
