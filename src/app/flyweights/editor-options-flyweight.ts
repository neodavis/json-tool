import { Injectable } from "@angular/core";

import { Flyweight } from "./base-flyweight";

@Injectable({ providedIn: 'root' })
export class EditorOptionsFlyweight implements Flyweight<Record<string, unknown>> {
  private instances: Map<string, Record<string, unknown>> = new Map();

  getOptions(language: string): Record<string, unknown> {
    if (!this.instances.has(language)) {

      this.instances.set(language, {
        automaticLayout: true,
        language,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
      });
    }

    return this.instances.get(language)!;
  }

  getKey(): string {
    return 'options';
  }

  getValue(): Record<string, unknown> {
    return Object.fromEntries(this.instances);
  }
}
