import { Observer, Subject } from './base-observer';
import { LoggerCommand } from "../commands/logger-command";

export class FileChangeSubject extends Subject<string> {
  constructor() {
    super();
  }
  
  override next(state: string): void {
    new LoggerCommand().execute('File Observer', 'Notifying state change to observers');    
    super.next(state);
  }
}