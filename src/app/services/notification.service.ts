import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private messageService: MessageService) {}

  showNotification(description: string) {
    this.messageService.add({
      key: 'main',
      severity: 'info',
      summary: 'Action completed',
      detail: description,
      life: 3000
    });
  }
}
