import { FormatterStrategy } from "../services/formatter-strategy.service";

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


export class SmartFormatterStrategy implements FormatterStrategy {
  format(jsonString: string): string {
    try {
      const jsonObject = JSON.parse(jsonString);
      return JSON.stringify(jsonObject, null, 2); // Pretty print with 2 spaces
    } catch (error) {
      throw new Error('Invalid JSON string');
    }
  }
}