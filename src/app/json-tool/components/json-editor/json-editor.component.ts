import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { EditorComponent } from 'ngx-monaco-editor-v2';
import { TooltipModule } from 'primeng/tooltip';
import { PrimeIcons } from 'primeng/api';
import { Button } from 'primeng/button';
import { map, merge, Observable, startWith, withLatestFrom } from 'rxjs';

import { UndoRedoService } from '../../../services/undo-redo.service';
import { ParserStrategyService } from '../../../services/json-strategy.service';
import { SaveService } from '../../../services/save.service';

@Component({
  selector: 'app-json-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, EditorComponent, TooltipModule, Button],
  templateUrl: './json-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JsonEditorComponent implements OnInit {
  @Input({ required: true }) name!: string
  @Input({ required: true }) control!: FormControl;

  needSave$!: Observable<boolean>
  isInputFormatted$!: Observable<boolean>

  readonly undoRedoService = inject(UndoRedoService);
  readonly parserStrategyService = inject(ParserStrategyService);
  readonly saveService = inject(SaveService);
  readonly PrimeIcons = PrimeIcons;

  editorOptions = {
    automaticLayout: true,
    language: 'json'
  };

  ngOnInit() {
    this.isInputFormatted$ = this.getIsInputFormatted$(this.control)
    this.needSave$ = this.getNeedSave$(this.control);

    this.initializeSaveService();
  }

  save() {
    this.saveService.saveState(this.control.value)
  }

  private initializeSaveService() {
    const currentState = this.saveService.currentState

    if (currentState) {
      this.control.setValue(currentState);
    }
  }

  formatInput() {
    const parsed = this.parserStrategyService.parse(this.control.value ?? '');
    const stringified = this.parserStrategyService.stringify(parsed ?? { });

    this.control.setValue(stringified ?? '')
  }

  editorInit(editor: any) {
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

  private getNeedSave$(jsonInputControl: FormControl<string | null>) {
    return merge(jsonInputControl.valueChanges, this.saveService.currentState$)
      .pipe(
        withLatestFrom(this.saveService.currentState$),
        map(([_, currentSavedState]) => {
          return jsonInputControl.value === currentSavedState;
        })
      )
  }
}
