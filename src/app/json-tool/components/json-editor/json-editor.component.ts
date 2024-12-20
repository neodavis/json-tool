import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { EditorComponent } from 'ngx-monaco-editor-v2';
import { TooltipModule } from 'primeng/tooltip';
import { PrimeIcons } from 'primeng/api';
import { Button } from 'primeng/button';
import { BehaviorSubject, debounceTime, filter, take, tap } from 'rxjs';

import { UndoRedoService } from '../../../services/undo-redo.service';
import { CompactFormatterStrategy, SmartFormatterStrategy as PrettyFormatterStrategy } from '../../../strategies/compact-formatter-strategy';
import { SaveService } from '../../../services/save.service';
import { EditorOptionsFlyweight } from '../../../flyweights/editor-options.flyweight';
import { EditorStateSubject } from '../../../observers/editor-observer';
import { EditorBaseComponent } from '../editor-base/editor-base.component';
import { FormatCommand, SaveCommand } from '../../../commands/editor-command';
import { LoggerService } from '../../../services/logger.service';

@Component({
  selector: 'app-json-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, EditorComponent, TooltipModule, Button],
  templateUrl: './json-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SaveService, UndoRedoService],
})
export class JsonEditorComponent extends EditorBaseComponent {
  @Input({ required: true }) name!: string;
  @Input({ required: true }) description!: string;
  @Input({ required: true }) control!: FormControl;
  
  readonly undoRedoService = inject(UndoRedoService);
  readonly loggerService = inject(LoggerService);
  readonly saveService = inject(SaveService);

  readonly editorOptions = EditorOptionsFlyweight.getOptions('json', this.loggerService);
  readonly PrimeIcons = PrimeIcons;
  readonly countdown$ = this.saveService.countdown;
  
  readonly stateSubject = new EditorStateSubject(this.loggerService);
  readonly compactFormatter = new CompactFormatterStrategy();
  readonly prettyFormatter = new PrettyFormatterStrategy();
  readonly suppressSave$ = new BehaviorSubject<boolean>(true);

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

  protected initializeServices(): void {
    this.saveService.initializeService(this.name);
    this.undoRedoService.initialize(this.control.value || '');
    this.stateSubject.observe({
      onStateChange: () => this.suppressSave$.next(false)
    });
    this.saveService._currentState$
      .pipe(
        take(1),
        tap((state) => this.control.setValue(state))
      )
      .subscribe()
  }

  protected setupSubscriptions(): void {
    this.control.valueChanges
    .pipe(
      debounceTime(300),
      tap((value) => this.stateSubject.notify(value)),
      filter(Boolean),
      tap(value => this.undoRedoService.addState(value))
    )
    .subscribe();
  }

  protected configureEditor(): void {
    this.control.updateValueAndValidity();
  }

  formatInputCompact(): void {
    new FormatCommand(this, this.compactFormatter, this.loggerService).execute();
  }

  formatInputPretty(): void {
    new FormatCommand(this, this.prettyFormatter, this.loggerService).execute();
  }

  save(): void {
    new SaveCommand(this, this.loggerService).execute();
    this.suppressSave$.next(true);
  }
}