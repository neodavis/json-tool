import { Subject } from './base-observer';
import { LoggerCommand } from "../commands/logger-command";

export class ThemeChangeSubject extends Subject<string> {
    constructor() {
        super();
    }
        
    override next(state: string): void {
        new LoggerCommand('Theme Observer', 'Notifying state change to observers').execute();    
        super.next(state);
    }
}