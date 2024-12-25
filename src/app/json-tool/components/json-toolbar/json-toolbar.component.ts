import { Component, Input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { FileSelectEvent, FileUpload, FileUploadModule } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';
import { SelectButtonModule } from 'primeng/selectbutton';

import { FileImportCommand } from '../../../commands/file-command';

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
  @Input({required: true}) jsonInputControl: FormControl<null | string> = new FormControl('');
  @Input({required: true}) schemaControl: FormControl<null | string> = new FormControl('');

  readonly fileNameControl = new FormControl<string>('New Document', [
    Validators.minLength(1),
    Validators.required
  ]);

  importFile(fileUploadEl: FileUpload, event: FileSelectEvent): void {
    new FileImportCommand(this, fileUploadEl, event).execute();
  }
}
