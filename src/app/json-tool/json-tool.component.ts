import { AfterViewInit, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { ChipModule } from 'primeng/chip';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { Button, ButtonDirective } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { PrimeIcons } from 'primeng/api';
import { FileSelectEvent, FileUpload, FileUploadModule } from 'primeng/fileupload';
import { filter, map, merge, startWith, take, tap, withLatestFrom } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';

import { JsonParser, ParserStrategyService } from '../services/json-strategy.service';
import { UndoRedoService } from '../services/undo-redo.service';
import { schemaValidatorGetter } from '../validators/schema.validator';
import { TextOutputComponent } from './components/text-output/text-output.component';
import { TableOutputComponent } from './components/table-output/table-output.component';
import { SaveService } from '../services/save.service';
import { TreeOutputComponent } from './components/tree-output/tree-output.component';

enum ViewOption { Text = 'Text', Table = 'Table', Tree = 'Tree' }

@Component({
  selector: 'app-json-tool',
  templateUrl: './json-tool.component.html',
  styleUrls: ['./json-tool.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Button,
    ButtonDirective,
    InputTextareaModule,
    InputTextModule,
    SelectButtonModule,
    ChipModule,
    TextOutputComponent,
    TableOutputComponent,
    FileUploadModule,
    TreeOutputComponent
  ],
  providers: [ParserStrategyService, SaveService]
})
export class JsonToolComponent implements AfterViewInit {
  readonly undoRedoService = inject(UndoRedoService);
  readonly parserStrategyService = inject(ParserStrategyService);
  readonly saveService = inject(SaveService);

  readonly viewOptions: ViewOption[] = Object.values(ViewOption) as ViewOption[]
  readonly jsonInputControl = new FormControl<string>('');
  readonly needSave$ = merge(this.jsonInputControl.valueChanges, this.saveService.currentState$)
    .pipe(
      withLatestFrom(this.saveService.currentState$),
      map(([_, currentSavedState]) => {
        return this.jsonInputControl.value === currentSavedState;
      })
    )
  readonly isInputFormatted$ = this.jsonInputControl.valueChanges
    .pipe(
      startWith(this.jsonInputControl.value),
      map((value) => {
        if (this.jsonInputControl.invalid || !value) {
          return true
        }

        const parsed = this.parserStrategyService.parse(value ?? '');
        const stringified = this.parserStrategyService.stringify(parsed);

        return stringified === value
      })
    )
  readonly fileNameControl = new FormControl<string>('New Document', [Validators.minLength(1), Validators.required]);
  readonly viewOptionControl = new FormControl<ViewOption>(ViewOption.Text);
  readonly ViewOption = ViewOption;
  readonly PrimeIcons = PrimeIcons;

  ngAfterViewInit() {
    this.initializeSaveService();
    this.initializeParserStrategy();
    this.initializeUndoRedo();
  }

  save() {
    this.saveService.saveState(this.jsonInputControl.value)
  }

  undo() {
    const previousState = this.undoRedoService.undo();

    if (previousState !== null) {
      this.jsonInputControl.setValue(previousState);
    }
  }

  redo() {
    const nextState = this.undoRedoService.redo();

    if (nextState !== null) {
      this.jsonInputControl.setValue(nextState);
    }
  }

  private initializeParserStrategy() {
    this.parserStrategyService.setParserStrategy(new JsonParser());
    this.jsonInputControl.addValidators(schemaValidatorGetter(this.parserStrategyService.parserStrategy!))
  }

  private initializeUndoRedo() {
    const initialState = this.jsonInputControl.value ?? '';

    this.undoRedoService.initialize(initialState);

    this.jsonInputControl.valueChanges
      .pipe(
        filter(() => this.jsonInputControl.valid),
        tap((value) => this.undoRedoService.addState(value ?? '')),
        filter(Boolean)
      )
      .subscribe()
  }

  formatInput() {
    const parsed = this.parserStrategyService.parse(this.jsonInputControl.value ?? '');
    const stringified = this.parserStrategyService.stringify(parsed);

    this.jsonInputControl.setValue(stringified)
  }

  private initializeSaveService() {
    const currentState = this.saveService.currentState

    if (currentState) {
      this.jsonInputControl.setValue(currentState);
    }
  }

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
