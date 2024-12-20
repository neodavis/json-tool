import { JsonEditorComponent } from "../json-tool/components/json-editor/json-editor.component";
import { FormatterStrategy } from "../services/formatter-strategy.service";
import { LoggerService } from "../services/logger.service";

export interface EditorCommand {
  execute(): void;
}

export class FormatCommand implements EditorCommand {
  constructor(
    private editor: JsonEditorComponent,
    private formatter: FormatterStrategy,
    private loggerService: LoggerService
  ) {}

  execute(): void {
    this.loggerService.log('Command', 'Executing Format Command');

    const formatted = this.formatter.format(this.editor.control.value);

    this.editor.control.setValue(formatted);
  }
}

export class SaveCommand implements EditorCommand {
  constructor(
    private editor: JsonEditorComponent,
    private loggerService: LoggerService
) {}

  execute(): void {
    this.loggerService.log('Command', 'Executing Save Command');

    this.editor.saveService.saveState(this.editor.control.value);
  }
}