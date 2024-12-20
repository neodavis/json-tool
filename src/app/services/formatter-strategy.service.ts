import { inject } from "@angular/core";
import { LoggerService } from "./logger.service";

export interface FormatterStrategy {
  format(text: string): string;
}

export class FormatterStrategyService implements FormatterStrategy {
  private readonly formatterStrategy: FormatterStrategy;
  private loggerService: LoggerService;

  constructor(
    formatterStrategy: FormatterStrategy,
    loggerService: LoggerService,
  ) {    
    this.formatterStrategy = formatterStrategy;
    this.loggerService = loggerService;
  }

  format(text: string) {
    this.loggerService.log('Strategy', 'Using Compact Formatter Strategy');

    return this.formatterStrategy.format(text);
  }
}
