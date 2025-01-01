import { BaseCommand } from './base-command';
import { FormControl } from '@angular/forms';

export class DocumentFormatCommand implements BaseCommand {

  constructor(
    private control: FormControl,
    private formatter: (value: string) => string
  ) {}

  execute(): void {
    this.control.setValue(this.formatter(this.control.value));
  }

  getDescription(): string {
    return 'Document formatted';
  }
}
