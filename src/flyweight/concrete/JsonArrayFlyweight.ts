import { JsonElementFlyweight } from '../JsonElementFlyweight';

export class JsonArrayFlyweight implements JsonElementFlyweight {
    private readonly value: any[];

    constructor(value: any[]) {
        this.value = value;
    }

    getType(): string {
        return 'array';
    }

    getValue(): any[] {
        return this.value;
    }

    format(indent: number): string {
        const spacing = ' '.repeat(indent);
        const elements = this.value
            .map(item => `${spacing}  ${JSON.stringify(item)}`)
            .join(',\n');
        return `[\n${elements}\n${spacing}]`;
    }
}
