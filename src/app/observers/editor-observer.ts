import { LoggerService } from "../services/logger.service";

// src/app/observers/editor-observer.ts
export interface EditorStateObserver {
  onStateChange(state: string): void;
}
  
export class EditorStateSubject {
  private observers: EditorStateObserver[] = [];
  private loggerService: LoggerService;

  constructor(loggerService: LoggerService) {
    this.loggerService = loggerService;
  }
  
  observe(observer: EditorStateObserver): void {
    this.observers.push(observer);
  }
  
  notify(state: string): void {
    this.loggerService.log('Observer', 'Notifying state change to observers');    
    this.observers.forEach(observer => observer.onStateChange(state));
  }
}