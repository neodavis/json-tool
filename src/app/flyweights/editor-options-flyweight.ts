import { Injectable } from "@angular/core";

import { Flyweight } from "./base-flyweight";
import { LoggerCommand } from "../commands/logger-command";
import { EditorThemeFlyweight } from "./editor-theme-flyweight";
import { DEFAULT_THEME } from "../tokens/theme.token";

@Injectable({ providedIn: 'root' })
export class EditorOptionsFlyweight implements Flyweight<Record<string, unknown>> {
  private instances: Map<string, Record<string, unknown>> = new Map();

  getOptions(language: string): Record<string, unknown> {
    if (!this.instances.has(language)) {
      new LoggerCommand('Flyweight', `Creating editor options for ${language}`).execute();
      
      this.instances.set(language, {
        automaticLayout: true,
        language,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
      });
    }

    new LoggerCommand('Flyweight', `Reusing editor options for ${language}`).execute();
    return this.instances.get(language)!;
  }

  getKey(): string {
    return 'options';
  }

  getValue(): Record<string, unknown> {
    return Object.fromEntries(this.instances);
  }
}