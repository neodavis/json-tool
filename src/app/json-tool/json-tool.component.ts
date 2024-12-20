import { AfterViewInit, Component, inject } from '@angular/core';
import { FormControl } from '@angular/forms';

import { filter, merge, startWith, tap } from 'rxjs';
import { SplitterModule } from 'primeng/splitter';
import { Button } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { KeyValuePipe, NgClass } from '@angular/common';
import { languages } from 'monaco-editor';
import JSONSchema = languages.json.JSONSchema;

import { SaveService } from '../services/save.service';
import { schemaValidatorGetter } from '../validators/schema.validator';
import { JsonEditorComponent } from './components/json-editor/json-editor.component';
import { JsonToolbarComponent } from './components/json-toolbar/json-toolbar.component';

@Component({
  selector: 'app-json-tool',
  templateUrl: './json-tool.component.html',
  standalone: true,
  imports: [JsonEditorComponent, JsonToolbarComponent, SplitterModule, TooltipModule],
  providers: [SaveService],
})
export class JsonToolComponent implements AfterViewInit {
  readonly schemaControl = new FormControl<string>('', null, schemaValidatorGetter('inmemory://model/1'));
  readonly jsonInputControl = new FormControl<string>('', null, schemaValidatorGetter('inmemory://model/2'));

  // TODO: move into const file
  private readonly schema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "$id": "http://json-schema.org/draft-07/schema#",
    "title": "Core schema meta-schema",
    "definitions": {
      "schemaArray": {
        "type": "array",
        "minItems": 1,
        "items": { "$ref": "#" }
      },
      "nonNegativeInteger": {
        "type": "integer",
        "minimum": 0
      },
      "nonNegativeIntegerDefault0": {
        "allOf": [
          { "$ref": "#/definitions/nonNegativeInteger" },
          { "default": 0 }
        ]
      },
      "simpleTypes": {
        "enum": [
          "array",
          "boolean",
          "integer",
          "null",
          "number",
          "object",
          "string"
        ]
      },
      "stringArray": {
        "type": "array",
        "items": { "type": "string" },
        "uniqueItems": true,
        "default": []
      }
    },
    "type": ["object", "boolean"],
    "properties": {
      "$id": {
        "type": "string",
        "format": "uri-reference"
      },
      "$schema": {
        "type": "string",
        "format": "uri"
      },
      "$ref": {
        "type": "string",
        "format": "uri-reference"
      },
      "$comment": {
        "type": "string"
      },
      "title": {
        "type": "string"
      },
      "description": {
        "type": "string"
      },
      "default": true,
      "readOnly": {
        "type": "boolean",
        "default": false
      },
      "writeOnly": {
        "type": "boolean",
        "default": false
      },
      "examples": {
        "type": "array",
        "items": true
      },
      "multipleOf": {
        "type": "number",
        "exclusiveMinimum": 0
      },
      "maximum": {
        "type": "number"
      },
      "exclusiveMaximum": {
        "type": "number"
      },
      "minimum": {
        "type": "number"
      },
      "exclusiveMinimum": {
        "type": "number"
      },
      "maxLength": { "$ref": "#/definitions/nonNegativeInteger" },
      "minLength": { "$ref": "#/definitions/nonNegativeIntegerDefault0" },
      "pattern": {
        "type": "string",
        "format": "regex"
      },
      "additionalItems": { "$ref": "#" },
      "items": {
        "anyOf": [
          { "$ref": "#" },
          { "$ref": "#/definitions/schemaArray" }
        ],
        "default": true
      },
      "maxItems": { "$ref": "#/definitions/nonNegativeInteger" },
      "minItems": { "$ref": "#/definitions/nonNegativeIntegerDefault0" },
      "uniqueItems": {
        "type": "boolean",
        "default": false
      },
      "contains": { "$ref": "#" },
      "maxProperties": { "$ref": "#/definitions/nonNegativeInteger" },
      "minProperties": { "$ref": "#/definitions/nonNegativeIntegerDefault0" },
      "required": { "$ref": "#/definitions/stringArray" },
      "additionalProperties": { "$ref": "#" },
      "definitions": {
        "type": "object",
        "additionalProperties": { "$ref": "#" },
        "default": {}
      },
      "properties": {
        "type": "object",
        "additionalProperties": { "$ref": "#" },
        "default": {}
      },
      "patternProperties": {
        "type": "object",
        "additionalProperties": { "$ref": "#" },
        "propertyNames": { "format": "regex" },
        "default": {}
      },
      "dependencies": {
        "type": "object",
        "additionalProperties": {
          "anyOf": [
            { "$ref": "#" },
            { "$ref": "#/definitions/stringArray" }
          ]
        }
      },
      "propertyNames": { "$ref": "#" },
      "const": true,
      "enum": {
        "type": "array",
        "items": true,
        "minItems": 1,
        "uniqueItems": true
      },
      "type": {
        "anyOf": [
          { "$ref": "#/definitions/simpleTypes" },
          {
            "type": "array",
            "items": { "$ref": "#/definitions/simpleTypes" },
            "minItems": 1,
            "uniqueItems": true
          }
        ]
      },
      "format": { "type": "string" },
      "contentMediaType": { "type": "string" },
      "contentEncoding": { "type": "string" },
      "if": { "$ref": "#" },
      "then": { "$ref": "#" },
      "else": { "$ref": "#" },
      "allOf": { "$ref": "#/definitions/schemaArray" },
      "anyOf": { "$ref": "#/definitions/schemaArray" },
      "oneOf": { "$ref": "#/definitions/schemaArray" },
      "not": { "$ref": "#" }
    },
    "default": true
  }

  ngAfterViewInit() {
    this.initializeSchema()
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
            ? JSON.parse(this.schemaControl.value) as JSONSchema
            : {}

          this.setSchema(parsedSchema);
          this.jsonInputControl.updateValueAndValidity();
        }),
      )
      .subscribe()
  }

  setSchema(schema: JSONSchema | null) {
    const schemas = [
      { uri: 'inmemory://model/1', fileMatch: ['inmemory://model/1'], schema: this.schema },
      ...(schema ? [{ uri: 'inmemory://model/2', fileMatch: ['inmemory://model/2'], schema }] : [])
    ]

    window.monaco.languages.json.jsonDefaults.setDiagnosticsOptions({ validate: true, schemas });
  }
}
