import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { EditorComponent } from 'ngx-monaco-editor-v2';
import { TooltipModule } from 'primeng/tooltip';
import { PrimeIcons } from 'primeng/api';
import { Button } from 'primeng/button';
import { BehaviorSubject, debounceTime, distinctUntilChanged, filter, skip, skipUntil, skipWhile, take, tap } from 'rxjs';

import { UndoRedoService } from '../../../services/undo-redo.service';
import { CompactFormatterStrategy } from '../../../strategies/compact-formatter-strategy';
import { SaveService } from '../../../services/save.service';
import { EditorOptionsFlyweight } from '../../../flyweights/editor-options-flyweight';
import { EditorStateSubject } from '../../../observers/editor-observer';
import { EditorBaseComponent } from '../editor-base/editor-base.component';
import { FormatCommand, SaveCommand } from '../../../commands/editor-command';
import { PrettyFormatterStrategy } from '../../../strategies/pretty-formatter-strategy';
import { ThemeChangeSubject } from '../../../observers/theme-observer';
import { FileSelectEvent, FileUpload, FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { FileImportCommand } from '../../../commands/file-command';
import { DocumentType } from '../../../interfaces/document.interface';
import { AuthService } from '../../../services/auth.service';
import { HistoryModalComponent } from '../../../history-modal/history-modal.component';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-json-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, EditorComponent, TooltipModule, Button, FileUploadModule, InputTextModule],
  templateUrl: './json-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SaveService, UndoRedoService, DialogService],
})
export class JsonEditorComponent extends EditorBaseComponent {
  @Input({required: true}) name!: string;
  @Input({required: true}) description!: string;
  @Input({required: true}) control!: FormControl;
  @Input({required: true}) type!: DocumentType;

  readonly undoRedoService = inject(UndoRedoService);
  readonly saveService = inject(SaveService);
  readonly editorOptionsFlyweight = inject(EditorOptionsFlyweight);
  readonly auth = inject(AuthService);
  readonly dialogService = inject(DialogService);

  readonly PrimeIcons = PrimeIcons;
  readonly isSaving$ = this.saveService.isSaving;
  readonly saveError$ = this.saveService.saveError$;

  readonly stateSubject = new EditorStateSubject();
  readonly compactFormatter = new CompactFormatterStrategy();
  readonly prettyFormatter = new PrettyFormatterStrategy();
  readonly themeSubject = new ThemeChangeSubject();
  readonly suppressSave$ = new BehaviorSubject<boolean>(true);

  readonly fileNameControl = new FormControl<string>('New Document', [
    Validators.minLength(1),
    Validators.required
  ]);

  importFile(fileUploadEl: FileUpload, event: FileSelectEvent): void {
    new FileImportCommand(this, fileUploadEl, event).execute();
  }

  editorOptions = this.editorOptionsFlyweight.getOptions('json');

  undo(): void {
    const previousState = this.undoRedoService.undo();
    if (previousState) {
      this.control.setValue(previousState);
    }
  }

  redo(): void {
    const nextState = this.undoRedoService.redo();
    if (nextState) {
      this.control.setValue(nextState);
    }
  }

  editorInit(): void {
    this.control.updateValueAndValidity();
  }

  formatInputCompact(): void {
    new FormatCommand(this, this.compactFormatter).execute();
  }

  formatInputPretty(): void {
    new FormatCommand(this, this.prettyFormatter).execute();
  }

  changeTheme(theme: string): void {
    this.themeSubject.next(theme);
  }

  protected initializeServices(): void {
    this.saveService.initializeService(this.type);
    this.initializeThemeObserver();
    this.undoRedoService.initialize(this.control.value || '');
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
        tap((state) => this.control.setValue(state))
      )
      .subscribe()
  }

  protected setupSubscriptions(): void {
    this.control.valueChanges.pipe(
      debounceTime(300),
      filter(Boolean),
      tap(value => {
        this.stateSubject.next(value);
        this.undoRedoService.addState(value);
        this.suppressSave$.next(false);
      }),
      skip(1),
      distinctUntilChanged(),
      tap(() => this.saveService.saveState(this.control.value)),
    ).subscribe();
  }

  save(): void {
    new SaveCommand(this).execute();
    this.suppressSave$.next(true);
  }

  private initializeThemeObserver(): void {
    this.themeSubject.subscribe({
      next: (themeName) => {
        switch (themeName) {
          case 'changed':
            window.monaco.editor.setTheme(themeName);
            break;
          case 'error':
            window.monaco.editor.setTheme('githubDark');
            break;
          case 'optionsUpdated':
            this.editorOptions = {
              ...this.editorOptions,
              theme: themeName,
            };
            break;
        }
      }
    });
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
    }).onClose.subscribe((version: any) => {
      if (version) {
        this.control.setValue(version.content);
      }
    });  
  }
}
