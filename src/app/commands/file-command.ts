import { take, tap } from "rxjs";
import { FileUpload, FileSelectEvent } from "primeng/fileupload";
import { fromPromise } from "rxjs/internal/observable/innerFrom";

import { BaseCommand } from "./base-command";
import { JsonEditorComponent } from '../json-tool/components/json-editor/json-editor.component';

export class FileImportCommand implements BaseCommand {

  constructor(
    private editor: JsonEditorComponent,
    private fileUpload: FileUpload,
    private event: FileSelectEvent,
  ) { }

  execute(): void {
    const file = this.event.currentFiles[0];
    const text = file?.text();

    this.fileUpload.clear();

    if (file) {
      const jsonTypeIndex = file.name.lastIndexOf('.json');
      const txtTypeIndex = file.name.lastIndexOf('.txt');
      const nameWithoutType = file.name.slice(0, Math.max(txtTypeIndex, jsonTypeIndex));

      new FileNameUpdateCommand(this.editor, nameWithoutType).execute();

      fromPromise(text).pipe(
        take(1),
        tap((content) => this.editor.control.setValue(content))
      ).subscribe();
    }
  }

  getDescription(): string {
    return `File "${this.event.currentFiles[0]?.name}" imported`;
  }
}

export class FileNameUpdateCommand implements BaseCommand {
  constructor(
    private editor: JsonEditorComponent,
    private fileName: string,
  ) {
  }

  execute(): void {
    this.editor.fileNameControl.setValue(this.fileName);
  }


  getDescription(): string {
    return `File name changed to "${this.fileName}"`;
  }
}
