import { Component, Input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncPipe, KeyValuePipe, NgClass } from '@angular/common';

import { InputTextModule } from 'primeng/inputtext';
import { FileSelectEvent, FileUpload, FileUploadModule } from 'primeng/fileupload';
import { take, tap } from 'rxjs';
import { PrimeIcons } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { SelectButtonModule } from 'primeng/selectbutton';

@Component({
  selector: 'app-json-toolbar',
  standalone: true,
  imports: [
    InputTextModule,
    TooltipModule,
    ReactiveFormsModule,
    FileUploadModule,
    SelectButtonModule,
    FormsModule,
  ],
  templateUrl: './json-toolbar.component.html',
})
export class JsonToolbarComponent {
  @Input({ required: true }) jsonInputControl: FormControl<null | string> = new FormControl('');
  @Input({ required: true }) schemaControl: FormControl<null | string> = new FormControl('');

  readonly PrimeIcons = PrimeIcons;
  readonly fileNameControl = new FormControl<string>('New Document', [Validators.minLength(1), Validators.required]);

  importFile(fileUploadEl: FileUpload, event: FileSelectEvent) {
    const file = event.currentFiles[0]
    const text = file?.text()

    fileUploadEl.clear();

    if (file) {
      const jsonTypeIndex = file.name.lastIndexOf('.json')
      const txtTypeIndex = file.name.lastIndexOf('.txt')
      const nameWithoutType = file.name.slice(0, Math.max(txtTypeIndex, jsonTypeIndex))

      this.fileNameControl.setValue(nameWithoutType)

      fromPromise(text)
        .pipe(
          take(1),
          tap((text) => this.jsonInputControl.setValue(text)),
        )
        .subscribe();
    }
  }
}
