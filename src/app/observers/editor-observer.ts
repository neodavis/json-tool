import { LoggerCommand } from "../commands/logger-command";
import { Subject } from "./base-observer";


export class EditorStateSubject extends Subject<string> {
  constructor() {
    super();
  }
  
  override next(state: string): void {
    new LoggerCommand('Editor Observer', 'Notifying state change to observers').execute();    
    super.next(state);
  }
}