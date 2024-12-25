import { Subject } from './base-observer';
import { LoggerCommand } from "../commands/logger-command";

export class FileChangeSubject extends Subject<string> {
  override next(state: string): void {
    new LoggerCommand('File Observer', 'Notifying state change to observers').execute();
    super.next(state);
  }
}
