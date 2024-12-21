import { FormatterStrategy } from "./formatter-strategy";

export class CompactFormatterStrategy implements FormatterStrategy {
  format(jsonString: string): string {
    try {
      const jsonObject = JSON.parse(jsonString);
      return JSON.stringify(jsonObject);
    } catch (error) {
      throw new Error('Invalid JSON string');
    }
  }
}
