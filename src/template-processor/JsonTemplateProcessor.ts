import { JsonObject } from '../types';

export abstract class JsonTemplateProcessor {
    public processJson(data: JsonObject): JsonObject {
        this.validateInput(data);
        const processed = this.transform(data);
        this.validateOutput(processed);
        return processed;
    }

    protected validateInput(data: JsonObject): void {
        if (!data || typeof data !== 'object') {
            throw new Error('Invalid input: JSON object required');
        }
    }

    protected validateOutput(data: JsonObject): void {
        if (!data || typeof data !== 'object') {
            throw new Error('Invalid output: JSON object required');
        }
    }

    protected abstract transform(data: JsonObject): JsonObject;
}
