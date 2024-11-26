import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { EditorComponent } from 'ngx-monaco-editor-v2';
import { TooltipModule } from 'primeng/tooltip';
import { PrimeIcons } from 'primeng/api';
import { Button } from 'primeng/button';
import { debounceTime, filter, map, merge, Observable, skip, startWith, tap, withLatestFrom } from 'rxjs';

import { UndoRedoService } from '../../../services/undo-redo.service';
import { ParserStrategyService } from '../../../services/json-strategy.service';
import { SaveService } from '../../../services/save.service';

@Component({
  selector: 'app-json-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, EditorComponent, TooltipModule, Button],
  templateUrl: './json-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SaveService, UndoRedoService],
})
export class JsonEditorComponent implements OnInit {
  @Input({ required: true }) name!: string
  @Input({ required: true }) description!: string
  @Input({ required: true }) control!: FormControl;

  suppressSave$!: Observable<boolean>
  isInputFormatted$!: Observable<boolean>

  readonly undoRedoService = inject(UndoRedoService);
  readonly parserStrategyService = inject(ParserStrategyService);
  readonly saveService = inject(SaveService);
  readonly PrimeIcons = PrimeIcons;
  readonly countdown$ = this.saveService.countdown;

  editorOptions = {
    automaticLayout: true,
    language: 'json'
  };

  ngOnInit() {
    this.isInputFormatted$ = this.getIsInputFormatted$(this.control)
    this.initializeSaveService();
    this.initializeUndoRedo();
  }

  save() {
    this.saveService.saveState(this.control.value)
  }

  private initializeUndoRedo() {
    const initialState = this.control.value ?? '';

    this.undoRedoService.initialize(initialState);

    this.control.valueChanges
      .pipe(
        debounceTime(200),
        tap((value) => this.undoRedoService.addState(value ?? '')),
        filter(Boolean)
      )
      .subscribe()
  }

  private initializeSaveService() {
    this.suppressSave$ = this.getSuppressSave$(this.control);
    this.saveService.initializeService(this.name);

    this.control.valueChanges
      .pipe(
        skip(3),
        tap(() => this.saveService.startCountdown(this.control.value))
      )
      .subscribe()

    const currentState = this.saveService.currentState;

    if (currentState) {
      this.control.setValue(currentState);
    }
  }

  formatInput() {
    const parsed = this.parserStrategyService.parse(this.control.value ?? '');
    const stringified = this.parserStrategyService.stringify(parsed ?? { });

    this.control.setValue(stringified ?? '')
  }

  editorInit() {
    this.control.updateValueAndValidity();
  }

  undo() {
    const previousState = this.undoRedoService.undo();

    if (previousState !== null) {
      this.control.setValue(previousState);
    }
  }

  redo() {
    const nextState = this.undoRedoService.redo();

    if (nextState !== null) {
      this.control.setValue(nextState);
    }
  }

  private getIsInputFormatted$(jsonInputControl: FormControl<string | null>) {
    return jsonInputControl.valueChanges
      .pipe(
        startWith(jsonInputControl.value),
        map((value) => {
          if (jsonInputControl.invalid || !value) {
            return true
          }

          try {
            const parsed = this.parserStrategyService.parse(value ?? '');
            const stringified = this.parserStrategyService.stringify(parsed ?? { });

            return stringified === value
          } catch {
            return false
          }
        })
      );
  }

  private getSuppressSave$(control: FormControl<string | null>) {
    return merge(control.valueChanges, this.saveService.currentState$, this.countdown$)
      .pipe(
        withLatestFrom(this.saveService.currentState$, this.countdown$),
        map(([_, currentSavedState, countdown]) => control.value === currentSavedState && !countdown)
      )
  }
}
