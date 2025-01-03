import { JsonElementFlyweight } from './JsonElementFlyweight';
import { JsonObjectFlyweight } from './concrete/JsonObjectFlyweight';
import { JsonArrayFlyweight } from './concrete/JsonArrayFlyweight';
import { JsonPrimitiveFlyweight } from './concrete/JsonPrimitiveFlyweight';

export class JsonElementFactory {
    private static instance: JsonElementFactory;
    private elementCache: Map<string, JsonElementFlyweight>;

    private constructor() {
        this.elementCache = new Map();
    }

    static getInstance(): JsonElementFactory {
        if (!JsonElementFactory.instance) {
            JsonElementFactory.instance = new JsonElementFactory();
        }
        return JsonElementFactory.instance;
    }

    getJsonElement(value: any): JsonElementFlyweight {
        const key = JSON.stringify(value);
        
        if (this.elementCache.has(key)) {
            return this.elementCache.get(key)!;
        }

        let element: JsonElementFlyweight;

        if (Array.isArray(value)) {
            element = new JsonArrayFlyweight(value);
        } else if (value !== null && typeof value === 'object') {
            element = new JsonObjectFlyweight(value);
        } else {
            element = new JsonPrimitiveFlyweight(value);
        }

        this.elementCache.set(key, element);
        return element;
    }

    clearCache(): void {
        this.elementCache.clear();
    }
}
