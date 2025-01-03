import { JsonObject } from '../../types';
import { JsonTemplateProcessor } from '../JsonTemplateProcessor';

export class SortKeysJsonProcessor extends JsonTemplateProcessor {
    protected transform(data: JsonObject): JsonObject {
        const sortObject = (obj: JsonObject): JsonObject => {
            const sorted: JsonObject = {};
            
            Object.keys(obj)
                .sort()
                .forEach(key => {
                    const value = obj[key];
                    sorted[key] = value && typeof value === 'object' && !Array.isArray(value)
                        ? sortObject(value as JsonObject)
                        : value;
                });
                
            return sorted;
        };

        return sortObject(data);
    }
}
