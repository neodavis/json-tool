import { inject, Injectable } from '@angular/core';
import { SHOW_LOGS } from '../tokens/logger.token';

@Injectable({ providedIn: 'root' })
export class LoggerService {
  private readonly showLogs = inject(SHOW_LOGS);

  log(event: string, action: string): void {
    if (this.showLogs) {
      console.log(`[${event} Pattern] ${action}`);
    }
  }
}