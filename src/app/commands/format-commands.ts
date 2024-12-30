import { AbstractControl } from '@angular/forms';
import { BaseCommand } from './base-command';
import { FormatterStrategy } from '../strategies/formatter-strategy';

export class FormatCommand implements BaseCommand {
  private previousValue: string;

  constructor(
    private control: AbstractControl,
    private formatter: FormatterStrategy,
    private description: string
  ) {
    this.previousValue = control.value;
  }

  execute(): void {
    this.previousValue = this.control.value;
    const formatted = this.formatter.format(this.control.value);
    this.control.setValue(formatted);
  }

  undo(): void {
    this.control.setValue(this.previousValue);
  }

  getDescription(): string {
    return this.description;
  }
}
