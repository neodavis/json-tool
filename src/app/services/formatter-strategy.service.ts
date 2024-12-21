import { FormatterStrategy } from "../strategies/formatter-strategy";
import { LoggerCommand } from "./logger.service";

export class FormatterStrategyService implements FormatterStrategy {
  private readonly formatterStrategy: FormatterStrategy;

  constructor(
    formatterStrategy: FormatterStrategy,
  ) {    
    this.formatterStrategy = formatterStrategy;
  }

  format(text: string) {
    new LoggerCommand().execute('Strategy', 'Using Formatter Strategy');

    return this.formatterStrategy.format(text);
  }
}
