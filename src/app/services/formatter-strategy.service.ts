import { FormatterStrategy } from "../strategies/formatter-strategy";
import { LoggerCommand } from "../commands/logger-command";

export class FormatterStrategyService implements FormatterStrategy {
  private readonly formatterStrategy: FormatterStrategy;

  constructor(
    formatterStrategy: FormatterStrategy,
  ) {    
    this.formatterStrategy = formatterStrategy;
  }

  format(text: string) {
    new LoggerCommand('Strategy', 'Using Formatter Strategy').execute();

    return this.formatterStrategy.format(text);
  }
}
