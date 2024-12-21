import { take, tap } from "rxjs";
import { FileUpload, FileSelectEvent } from "primeng/fileupload";
import { fromPromise } from "rxjs/internal/observable/innerFrom";

import { JsonToolbarComponent } from "../json-tool/components/json-toolbar/json-toolbar.component";
import { LoggerCommand } from "../commands/logger-command";
import { BaseCommand } from "./base-command";

export class FileImportCommand implements BaseCommand {
  constructor(
    private toolbar: JsonToolbarComponent,
    private fileUpload: FileUpload,
    private event: FileSelectEvent,
  ) {}

  execute(): void {
    new LoggerCommand('Command', 'Executing File Import Command').execute();
    const file = this.event.currentFiles[0];
    const text = file?.text();

    this.fileUpload.clear();

    if (file) {
      const jsonTypeIndex = file.name.lastIndexOf('.json');
      const txtTypeIndex = file.name.lastIndexOf('.txt');
      const nameWithoutType = file.name.slice(0, Math.max(txtTypeIndex, jsonTypeIndex));

      new FileNameUpdateCommand(this.toolbar, nameWithoutType).execute();

      fromPromise(text).pipe(
        take(1),
        tap((content) => this.toolbar.jsonInputControl.setValue(content))
      ).subscribe();
    }
  }
}

export class FileNameUpdateCommand implements BaseCommand {
  constructor(
    private toolbar: JsonToolbarComponent,
    private fileName: string,
  ) {}

  execute(): void {
    new LoggerCommand('Command', 'Executing File Name Update Command').execute();
    this.toolbar.fileNameControl.setValue(this.fileName);
  }
}