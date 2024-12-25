import { JsonEditorComponent } from "../json-tool/components/json-editor/json-editor.component";
import { LoggerCommand } from "./logger-command";
import { FormatterStrategy } from "../strategies/formatter-strategy";
import { BaseCommand } from "./base-command";

export class FormatCommand implements BaseCommand {
  constructor(
    private editor: JsonEditorComponent,
    private formatter: FormatterStrategy,
  ) {
  }

  execute(): void {
    new LoggerCommand('Command', 'Executing Format Command').execute();

    const formatted = this.formatter.format(this.editor.control.value);

    this.editor.control.setValue(formatted);
  }
}

export class SaveCommand implements BaseCommand {
  constructor(private editor: JsonEditorComponent) {
  }

  execute(): void {
    new LoggerCommand('Command', 'Executing Save Command').execute();

    this.editor.saveService.saveState(this.editor.control.value);
  }
}
