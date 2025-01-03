import { JsonElementFlyweight } from '../JsonElementFlyweight';

export class JsonObjectFlyweight implements JsonElementFlyweight {
    private readonly value: Record<string, any>;

    constructor(value: Record<string, any>) {
        this.value = value;
    }

    getType(): string {
        return 'object';
    }

    getValue(): Record<string, any> {
        return this.value;
    }

    format(indent: number): string {
        const spacing = ' '.repeat(indent);
        const entries = Object.entries(this.value)
            .map(([key, value]) => `${spacing}  "${key}": ${JSON.stringify(value)}`)
            .join(',\n');
        return `{\n${entries}\n${spacing}}`;
    }
}
