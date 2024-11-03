import { Injectable } from '@angular/core';

export interface ParserStrategy {
  parse(jsonString: string): object;
  stringify(jsonObject: object): string;
}

@Injectable()
export class ParserStrategyService implements ParserStrategy {
  private _parserStrategy: ParserStrategy | null = null;

  get parserStrategy(): ParserStrategy | null {
    return this._parserStrategy;
  }

  setParserStrategy(parserStrategy: ParserStrategy | null) {
    this._parserStrategy = parserStrategy;
  }

  parse(jsonString: string): object {
    return JSON.parse(jsonString);
  }

  stringify(jsonObject: object): string {
    return JSON.stringify(jsonObject, null, 2);
  }
}

export class JsonParser implements ParserStrategy {
  parse(jsonString: string): object {
    return JSON.parse(jsonString);
  }

  stringify(jsonObject: object): string {
    return JSON.stringify(jsonObject, null, 2);
  }
}
