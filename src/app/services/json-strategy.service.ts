import { Injectable } from '@angular/core';

export interface ParserStrategy {
  parse(jsonString: string): object;
  stringify(jsonObject: object): string;
}

@Injectable()
export class ParserStrategyService {
  private _parserStrategy: ParserStrategy | null = null;

  parse(text: string) {
    return this._parserStrategy?.parse(text) ?? { };
  }

  stringify(object: object): string {
    return this._parserStrategy?.stringify(object) ?? '';
  }

  setParserStrategy(parserStrategy: ParserStrategy | null) {
    this._parserStrategy = parserStrategy;
  }
}

export class JsonParser implements ParserStrategy {
  private readonly tabSize: number;

  constructor(tabSize: number = 2) {
    this.tabSize = tabSize;
  }

  parse(jsonString: string): object {
    return JSON.parse(jsonString);
  }

  stringify(jsonObject: object): string {
    return JSON.stringify(jsonObject, null, this.tabSize);
  }
}
