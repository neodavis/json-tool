import { JsonEditorComponent } from "../json-tool/components/json-editor/json-editor.component";
import { BaseCommand } from "./base-command";

export class LoadHistoryCommand implements BaseCommand {
  constructor(private editor: JsonEditorComponent, private content: string) {
  }

  getDescription(): string {
    return 'Loaded content from history';
  }

  execute(): void {
    this.editor.control.setValue(this.content);
  }
}

export class SaveCommand implements BaseCommand {
  constructor(private editor: JsonEditorComponent) {
  }

  getDescription(): string {
    return 'Document content saved';
  }

  execute(): void {
    this.editor.saveService.saveState(this.editor.control.value);
  }
}
