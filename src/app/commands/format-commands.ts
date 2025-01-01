import { AbstractControl } from '@angular/forms';
import { BaseCommand } from './base-command';
import { FormatterStrategy } from '../strategies/formatter-strategy';

export class FormatCommand implements BaseCommand {

  constructor(
    private control: AbstractControl,
    private formatter: FormatterStrategy,
    private description: string
  ) { }

  execute(): void {
    const formatted = this.formatter.format(this.control.value);
    this.control.setValue(formatted);
  }

  getDescription(): string {
    return this.description;
  }
}
