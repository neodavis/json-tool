import { JsonElementFlyweight } from '../JsonElementFlyweight';

export class JsonPrimitiveFlyweight implements JsonElementFlyweight {
    private readonly value: string | number | boolean | null;

    constructor(value: string | number | boolean | null) {
        this.value = value;
    }

    getType(): string {
        return typeof this.value;
    }

    getValue(): string | number | boolean | null {
        return this.value;
    }

    format(indent: number): string {
        return JSON.stringify(this.value);
    }
}
