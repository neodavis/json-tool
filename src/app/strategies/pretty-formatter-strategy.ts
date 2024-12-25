import { FormatterStrategy } from "./formatter-strategy";

export class PrettyFormatterStrategy implements FormatterStrategy {
  format(jsonString: string): string {
    try {
      const jsonObject = JSON.parse(jsonString);
      return JSON.stringify(jsonObject, null, 2); // Pretty print with 2 spaces
    } catch (error) {
      throw new Error('Invalid JSON string');
    }
  }
}
