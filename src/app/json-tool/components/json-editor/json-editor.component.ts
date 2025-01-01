import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { EditorComponent } from 'ngx-monaco-editor-v2';
import { TooltipModule } from 'primeng/tooltip';
import { PrimeIcons } from 'primeng/api';
import { Button } from 'primeng/button';
import { BehaviorSubject, debounceTime, distinctUntilChanged, filter, tap } from 'rxjs';

import { UndoRedoService } from '../../../services/undo-redo.service';
import { CompactFormatterStrategy } from '../../../strategies/compact-formatter-strategy';
import { SaveService } from '../../../services/save.service';
import { EditorStateSubject } from '../../../observers/editor-observer';
import { LoadHistoryCommand } from '../../../commands/editor-command';
import { PrettyFormatterStrategy } from '../../../strategies/pretty-formatter-strategy';
import { FileSelectEvent, FileUpload, FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { FileImportCommand } from '../../../commands/file-command';
import { DocumentType } from '../../../interfaces/document.interface';
import { AuthService } from '../../../services/auth.service';
import { DialogService } from 'primeng/dynamicdialog';
import { CommandInvoker } from '../../../commands/command-invoker';
import { DocumentFormatCommand } from '../../../commands/document-command';
import { HistoryModalComponent } from '../../../history-modal/history-modal.component';

@Component({
  selector: 'app-json-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, EditorComponent, TooltipModule, Button, FileUploadModule, InputTextModule],
  templateUrl: './json-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SaveService, UndoRedoService, DialogService],
})
export class JsonEditorComponent implements OnInit {
  @Input({required: true}) name!: string;
  @Input({required: true}) description!: string;
  @Input({required: true}) control!: FormControl;
  @Input({required: true}) type!: DocumentType;

  readonly undoRedoService = inject(UndoRedoService);
  readonly saveService = inject(SaveService);
  readonly auth = inject(AuthService);
  readonly dialogService = inject(DialogService);
  private readonly commandInvoker = inject(CommandInvoker);

  readonly PrimeIcons = PrimeIcons;
  readonly isSaving$ = this.saveService.isSaving;
  readonly saveError$ = this.saveService.saveError$;

  readonly stateSubject = new EditorStateSubject();
  readonly compactFormatter = new CompactFormatterStrategy();
  readonly prettyFormatter = new PrettyFormatterStrategy();
  readonly suppressSave$ = new BehaviorSubject<boolean>(true);

  readonly fileNameControl = new FormControl<string>('New Document', [
    Validators.minLength(1),
    Validators.required
  ]);

  readonly editorOptions = {
    automaticLayout: true,
    language: 'json',
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    theme: 'githubDark',
  };

  ngOnInit() {
    this.setupSubscriptions();
    this.initializeServices();
    this.configureEditor();
  }

  importFile(fileUploadEl: FileUpload, event: FileSelectEvent): void {
    this.commandInvoker.execute(new FileImportCommand(this, fileUploadEl, event));
  }

  undo(): void {
    const previousState = this.undoRedoService.undo();
    if (previousState !== null) {
      this.control.setValue(previousState);
    }
  }

  redo(): void {
    const nextState = this.undoRedoService.redo();
    if (nextState !== null) {
      this.control.setValue(nextState);
    }
  }

  editorInit(): void {
    this.control.updateValueAndValidity();
  }

  formatInputCompact(): void {
    this.commandInvoker.execute(new DocumentFormatCommand(
      this.control,
      this.compactFormatter.format.bind(this.compactFormatter)
    ));
  }

  formatInputPretty(): void {
    this.commandInvoker.execute(new DocumentFormatCommand(
      this.control,
      this.prettyFormatter.format.bind(this.prettyFormatter)
    ));
  }

  protected initializeServices(): void {
    this.saveService.initializeService(this.type);
    this.saveService.canSave$
      .pipe(
        tap(canSave => this.suppressSave$.next(!canSave))
      )
      .subscribe();
    this.stateSubject
      .subscribe({
        next: () => this.suppressSave$.next(false)
      });
    this.saveService.currentState$
      .pipe(
        tap((state) => {
          this.control.setValue(state);
          this.undoRedoService.initialize(this.control.value || '');
        })
      )
      .subscribe()
  }

  protected setupSubscriptions(): void {
    this.control.valueChanges.pipe(
      debounceTime(300),
      filter(Boolean),
      distinctUntilChanged(),
      tap(value => {
        this.undoRedoService.addState(value);
        this.saveService.saveState(value);
      }),
    ).subscribe();
  }

  protected configureEditor(): void {
    this.control.updateValueAndValidity();
  }

  loadFromHistory() {
    this.dialogService.open(HistoryModalComponent, {
      header: 'Document History',
      width: '70%',
      data: {
        type: this.type,
        userId: this.auth.userSubject.value?.uid
      }
    }).onClose.subscribe((content) => {
      if (content) {
        this.commandInvoker.execute(new LoadHistoryCommand(this, content.content));
      }
    });
  }
}
