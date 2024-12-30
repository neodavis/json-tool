import { Injectable } from '@angular/core';
import { from, Observable, throwError } from 'rxjs';
import { retryWhen, delay, take, catchError } from 'rxjs/operators';
import { Document, DocumentType } from '../interfaces/document.interface';
import { LoggerCommand } from '../commands/logger-command';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  private readonly DB_NAME = 'JsonToolDB';
  private readonly DB_VERSION = 1;
  private db: IDBDatabase | null = null;

  async initialize(): Promise<void> {
    if (this.db) return Promise.resolve();

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = () => {
        this.handleError(request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('documents')) {
          db.createObjectStore('documents', { keyPath: 'id' });
        }
      };
    });
  }

  private handleError(error: Error | null): void {
    new LoggerCommand('Database', `Error: ${error?.message}`).execute();
    this.db = null;
  }

  saveDocument(document: Document): Observable<void> {
    if (!this.db) return throwError(() => new Error('Database not initialized'));

    return from(new Promise<void>((resolve, reject) => {
      const transaction = this.db!.transaction(['documents'], 'readwrite');
      const store = transaction.objectStore('documents');
      const request = store.put({
        ...document,
        lastModified: new Date()
      });

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    })).pipe(
      retryWhen(errors => errors.pipe(delay(1000), take(3))),
      catchError(error => throwError(() => error))
    );
  }

  getDocument(id: number): Observable<Document> {
    if (!this.db) return throwError(() => new Error('Database not initialized'));

    return from(new Promise<Document>((resolve, reject) => {
      const transaction = this.db!.transaction(['documents'], 'readonly');
      const store = transaction.objectStore('documents');
      const request = store.get(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || this.createEmptyDocument(id));
    })).pipe(
      retryWhen(errors => errors.pipe(delay(1000), take(3))),
      catchError(error => throwError(() => error))
    );
  }

  private createEmptyDocument(id: number): Document {
    return {
      id,
      content: '',
      type: id === 1 ? DocumentType.JSON : DocumentType.SCHEMA,
      lastModified: new Date()
    };
  }
}
