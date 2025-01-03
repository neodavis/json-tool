import { JsonObject } from '../../types';
import { JsonTemplateProcessor } from '../JsonTemplateProcessor';

export class FlattenJsonProcessor extends JsonTemplateProcessor {
    protected transform(data: JsonObject): JsonObject {
        const result: JsonObject = {};
        
        const flatten = (obj: JsonObject, prefix = ''): void => {
            for (const [key, value] of Object.entries(obj)) {
                const newKey = prefix ? `${prefix}.${key}` : key;
                if (value && typeof value === 'object' && !Array.isArray(value)) {
                    flatten(value as JsonObject, newKey);
                } else {
                    result[newKey] = value;
                }
            }
        };

        flatten(data);
        return result;
    }
}
