import { Injectable } from "@angular/core";
import { editor } from "monaco-editor";
import * as githubDark from 'monaco-themes/themes/GitHub Dark.json';
import * as githubLight from 'monaco-themes/themes/GitHub Light.json';

import { LoggerCommand } from "../commands/logger-command";
import { Flyweight } from "./base-flyweight";

@Injectable({ providedIn: 'root' })
export class EditorThemeFlyweight implements Flyweight<Map<string, editor.IStandaloneThemeData>> {
  private instances: Map<string, editor.IStandaloneThemeData> = new Map();

  private readonly defaultThemes: Record<string, editor.IStandaloneThemeData> = {
    'githubDark': githubDark as editor.IStandaloneThemeData,
    'githubLight': githubLight as editor.IStandaloneThemeData
  };

  constructor() {
    this.initializeDefaultThemes();
  }

  getTheme(themeName: string): editor.IStandaloneThemeData {
    if (!this.instances.has(themeName)) {
      new LoggerCommand('Flyweight', `Theme ${themeName} not found, using default`).execute();
      return this.instances.get('githubDark')!;
    }

    new LoggerCommand('Flyweight', `Reusing theme ${themeName}`).execute();
    return this.instances.get(themeName)!;
  }

  registerTheme(themeName: string, themeData: editor.IStandaloneThemeData): void {
    if (this.instances.has(themeName)) {
      new LoggerCommand('Flyweight', `Theme ${themeName} already exists`).execute();
      return;
    }

    this.validateTheme(themeData);
    this.instances.set(themeName, themeData);
    new LoggerCommand('Flyweight', `Registered new theme ${themeName}`).execute();
  }

  getKey(): string {
    return 'theme';
  }

  getValue(): Map<string, editor.IStandaloneThemeData> {
    return this.instances;
  }

  private validateTheme(theme: editor.IStandaloneThemeData): void {
    if (!theme.base || !['vs', 'vs-dark', 'hc-black'].includes(theme.base)) {
      throw new Error('Invalid theme base');
    }
  }

  private initializeDefaultThemes(): void {
    Object.entries(this.defaultThemes).forEach(([name, theme]) => {
      this.instances.set(name, theme);
    });
  }
}