import { AfterViewInit, Component, inject } from '@angular/core';
import { FormControl } from '@angular/forms';

import { debounceTime, filter, merge, startWith, tap } from 'rxjs';
import { SplitterModule } from 'primeng/splitter';
import { Button } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { KeyValuePipe, NgClass } from '@angular/common';
import { languages } from 'monaco-editor';
import JSONSchema = languages.json.JSONSchema;

import { JsonParser, ParserStrategyService } from '../services/json-strategy.service';
import { UndoRedoService } from '../services/undo-redo.service';
import { SaveService } from '../services/save.service';
import { schemaValidatorGetter } from '../validators/schema.validator';
import { JsonEditorComponent } from './components/json-editor/json-editor.component';
import { JsonToolbarComponent } from './components/json-toolbar/json-toolbar.component';

@Component({
  selector: 'app-json-tool',
  templateUrl: './json-tool.component.html',
  standalone: true,
  imports: [JsonEditorComponent, JsonToolbarComponent, SplitterModule, Button, TooltipModule, KeyValuePipe, NgClass],
  providers: [ParserStrategyService, SaveService],
})
export class JsonToolComponent implements AfterViewInit {
  readonly undoRedoService = inject(UndoRedoService);
  readonly saveService = inject(SaveService);
  readonly parserStrategyService = inject(ParserStrategyService);

  readonly schemaControl = new FormControl<string>('', null, schemaValidatorGetter('inmemory://model/1'));
  readonly jsonInputControl = new FormControl<string>('', null, schemaValidatorGetter('inmemory://model/2'));

  // TODO: move into const file
  private readonly jsonSchema = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "https://example.com/json-schema-schema",
    "title": "JSON Schema",
    "description": "A schema for defining JSON Schemas.",
    "type": "object",
    "properties": {
      "$id": {
        "type": "string",
        "format": "uri",
        "description": "A unique identifier for the schema."
      },
      "$schema": {
        "type": "string",
        "format": "uri",
        "description": "The meta-schema URI."
      },
      "title": {
        "type": "string",
        "description": "A short title for the schema."
      },
      "description": {
        "type": "string",
        "description": "A detailed description of the schema."
      },
      "type": {
        "type": "string",
        "enum": ["object", "array", "string", "number", "boolean", "null"],
        "description": "The type of data described by this schema."
      },
      "properties": {
        "type": "object",
        "additionalProperties": {
          "$ref": "#"
        },
        "description": "An object defining the properties of an object type."
      },
      "items": {
        "oneOf": [
          { "$ref": "#" },
          {
            "type": "array",
            "items": { "$ref": "#" }
          }
        ],
        "description": "Defines the items in an array."
      },
      "required": {
        "type": "array",
        "items": {
          "type": "string"
        },
        "description": "An array of required property names."
      },
      "enum": {
        "type": "array",
        "items": {
          "type": "string"
        },
        "description": "An array of allowed values for the data."
      },
      "default": {
        "type": ["string", "number", "boolean", "null", "object", "array"],
        "description": "The default value for the data."
      },
      "additionalProperties": {
        "$ref": "#",
        "description": "Defines the schema for additional properties."
      }
    },
    "required": ["type"],
    "additionalProperties": false
  }

  ngAfterViewInit() {
    this.initializeUndoRedo();
    this.initializeParserStrategy();
    this.initializeSchema()
  }

  private initializeParserStrategy() {
    this.parserStrategyService.setParserStrategy(new JsonParser(4));
  }

  private initializeUndoRedo() {
    const initialState = this.jsonInputControl.value ?? '';

    this.undoRedoService.initialize(initialState);

    this.jsonInputControl.valueChanges
      .pipe(
        debounceTime(200),
        tap((value) => this.undoRedoService.addState(value ?? '')),
        filter(Boolean)
      )
      .subscribe()
  }

  private initializeSchema() {
    merge(
      this.schemaControl.statusChanges,
      this.schemaControl.valueChanges,
    )
      .pipe(
        startWith({}),
        filter(() => this.schemaControl.valid),
        tap(() => {
          const parsedSchema = this.schemaControl.value
            ? this.parserStrategyService.parse(this.schemaControl.value) as JSONSchema
            : {}

          this.setSchema(parsedSchema);
          this.jsonInputControl.updateValueAndValidity();
        }),
      )
      .subscribe()
  }

  setSchema(schema: JSONSchema | null) {
    const schemas = [
      { uri: this.jsonSchema.$schema!, fileMatch: ['inmemory://model/1'], schema: this.jsonSchema },
      ...(schema ? [{ uri: schema.$schema!, fileMatch: ['inmemory://model/2'], schema }] : [])
    ]

    window.monaco.languages.json.jsonDefaults.setDiagnosticsOptions({ enableSchemaRequest: true, schemas });
  }
}
