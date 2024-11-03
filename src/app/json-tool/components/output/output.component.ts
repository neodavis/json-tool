import {
  AfterViewInit,
  Component,
  inject,
  Input,
  OnChanges,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import { ParserStrategyService } from '../../../services/json-strategy.service';

interface OutputComponentChanges extends SimpleChanges {
  data: SimpleChange
}

@Component({ template: '' })
export abstract class OutputComponent implements OnChanges, AfterViewInit {
  readonly parserStrategyService = inject(ParserStrategyService);

  @Input() data: string | null = null;
  @Input() invalid = false;

  ngOnChanges(changes: OutputComponentChanges) {
    if (changes.data && !changes.data?.firstChange) {
      this.processOutput(this.data ?? '');
    }
  }

  ngAfterViewInit() {
    this.processOutput(this.data ?? '');
  }

  private processOutput(value: string) {
    if (!value) {
      this.applyOutputView({}, '');
      return;
    }

    if (!this.parserStrategyService.parserStrategy || this.invalid) {
      return;
    }

    const parsed = this.parserStrategyService.parserStrategy.parse(value);
    const stringified = this.parserStrategyService.parserStrategy.stringify(parsed);

    this.applyOutputView(parsed, stringified);
  }

  abstract applyOutputView(parsed: object, stringifiedWithSyntax: string): void;
}
