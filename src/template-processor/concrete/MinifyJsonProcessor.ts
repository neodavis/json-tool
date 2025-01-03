import { JsonObject } from '../../types';
import { JsonTemplateProcessor } from '../JsonTemplateProcessor';

export class MinifyJsonProcessor extends JsonTemplateProcessor {
    protected transform(data: JsonObject): JsonObject {
        const minified = JSON.parse(JSON.stringify(data));
        return minified;
    }

    protected override validateOutput(data: JsonObject): void {
        super.validateOutput(data);
        
        const stringified = JSON.stringify(data);
        if (stringified.includes('  ')) {
            throw new Error('Minification failed: contains extra whitespace');
        }
    }
}
