import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, timer } from 'rxjs';
import { DbService } from './db.service';
import { DocumentType } from '../interfaces/document.interface';

@Injectable()
export class SaveService {
  private readonly dbService = inject(DbService);
  private documentId: number = 0;
  private currentDocument = new BehaviorSubject<string>('');

  readonly countdown = new BehaviorSubject<number>(0);
  readonly currentState$ = this.currentDocument.asObservable();
  readonly isSaving = new BehaviorSubject<boolean>(false);

  async initializeService(documentName: string): Promise<void> {
    await this.dbService.initialize();
    this.documentId = documentName.includes('Schema') ? 2 : 1;

    this.dbService.getDocument(this.documentId).subscribe({
      next: (doc) => {
        if (doc?.content) {
          this.currentDocument.next(doc.content);
        } else {
          this.initializeNewDocument();
        }
      },
      error: () => this.initializeNewDocument()
    });
  }

  private initializeNewDocument(): void {
    this.currentDocument.next('');
    this.saveState('');
  }

  saveState(content: string): void {
    this.startCountdown(content);
  }

  startCountdown(content: string): void {
    this.countdown.next(3);
    this.isSaving.next(true);

    timer(3000).subscribe(() => {
      this.dbService.saveDocument({
        id: this.documentId,
        content: content,
        type: this.documentId === 1 ? DocumentType.JSON : DocumentType.SCHEMA,
        lastModified: new Date()
      }).subscribe({
        next: () => {
          this.countdown.next(0);
          this.isSaving.next(false);
        },
        error: () => {
          this.handleSaveError();
          this.isSaving.next(false);
        }
      });
    });
  }

  private handleSaveError(): void {
    // Handle save errors, maybe retry or show notification
    this.countdown.next(-1);
  }
}
