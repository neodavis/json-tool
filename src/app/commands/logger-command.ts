import { BaseCommand } from "./base-command";

export class LoggerCommand implements BaseCommand {
  constructor(private event: string, private action: string) {
  }

  execute(): void {
    if (window.__SHOW_LOGS__) {
      console.log(`[Log] [${this.event} Pattern] ${this.action}`);
    }
  }
}
