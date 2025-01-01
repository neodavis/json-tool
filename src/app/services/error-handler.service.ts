import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  private readonly firebaseErrors: Record<string, string> = {
    'auth/invalid-email': 'Invalid email address format',
    'auth/user-disabled': 'This account has been disabled',
    'auth/user-not-found': 'No account found with this email',
    'auth/wrong-password': 'Incorrect password',
    'auth/email-already-in-use': 'Email is already registered',
    'auth/weak-password': 'Password should be at least 6 characters',
    'auth/network-request-failed': 'Network error. Please check your connection',
    'auth/too-many-requests': 'Too many attempts. Please try again later',
    'auth/requires-recent-login': 'Please sign in again to complete this action',
    'auth/invalid-login-credentials': 'Invalid login credentials',
    'permission-denied': 'You don\'t have permission to perform this action',
    'unavailable': 'Service is temporarily unavailable',
    'not-found': 'The requested resource was not found'
  };

  constructor(private messageService: MessageService) {}

  handleError(error: any) {
    console.log(error.code);
    
    const errorCode = error?.code || 'unknown';
    const message = this.firebaseErrors[errorCode] || error?.message || 'An unexpected error occurred';
    
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
      life: 5000
    });
    
    return message;
  }
}
