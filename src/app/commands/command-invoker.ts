import { Injectable, inject } from '@angular/core';
import { BaseCommand } from './base-command';
import { NotificationService } from '../services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class CommandInvoker {
  private notification = inject(NotificationService);

  execute(command: BaseCommand): void {
    command.execute();
    
    this.notification.showNotification(command.getDescription());
  }
}
