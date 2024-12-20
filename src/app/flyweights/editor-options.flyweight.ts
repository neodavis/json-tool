import { LoggerService } from "../services/logger.service";

export class EditorOptionsFlyweight {
  private static instances: Map<string, Record<string, unknown>> = new Map();

  static getOptions(language: string, loggerService: LoggerService): any {
    if (!this.instances.has(language)) {
      loggerService.log('Flyweight', `Editor options for ${language} initial creation`);

      this.instances.set(language, {
        automaticLayout: true,
        language
      });
    }

    loggerService.log('Flyweight', `Reusing editor options for ${language}`);

    return this.instances.get(language);
  }
}