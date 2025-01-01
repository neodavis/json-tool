import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, EMPTY, from, map, of, switchMap, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { DocumentType } from '../interfaces/document.interface';
import { FirestoreService } from './firestore.service';
import { ErrorHandlerService } from './error-handler.service';

@Injectable()
export class SaveService {
  private currentDocument = new BehaviorSubject<string>('');
  private readonly auth = inject(AuthService);
  private readonly firestore = inject(FirestoreService);
  private readonly errorHandler = inject(ErrorHandlerService);
  private documentType!: DocumentType;

  readonly currentState$ = this.currentDocument.asObservable();
  readonly isSaving = new BehaviorSubject<boolean>(false);
  readonly canSave$ = this.auth.user$.pipe(map(user => !!user));
  readonly saveError$ = new BehaviorSubject<object | null>(null);

  initializeService(documentType: DocumentType) {
    this.documentType = documentType;

    this.auth.user$
      .pipe(
        switchMap(user => {
          if (!user) {
            this.currentDocument.next('');
            return EMPTY;
          }

          return from(this.firestore.getLastVersions(this.documentType, user.uid, 1))
            .pipe(
              map(snapshot => {
                if (snapshot.empty) return '';
                return snapshot.docs[0].data().content;
              }),
              catchError(error => {
                console.error('Error loading initial data:', error);
                return of('');
              })
            );
        })
      )
      .subscribe(content => {
        this.currentDocument.next(content);
      });
  }

  async saveState(content: string) {
    if (!this.auth.isAuthenticated()) return;

    this.isSaving.next(true);
    try {
      const user = this.auth.userSubject.value;

      const latestVersions = await this.firestore.getLastVersions(this.documentType, user!.uid, 1);
      const latestVersion = latestVersions.docs[0]?.data();

      if (latestVersion && latestVersion.content === content) {
        console.log('[Save Service] Content unchanged, skipping save');
        return;
      }

      await this.firestore.saveDocument(this.documentType, content, user!.uid);
      this.saveError$.next(null);
    } catch(error) {
      this.errorHandler.handleError(error);
      this.saveError$.next(error as object);
    } finally {
      this.isSaving.next(false);
    }
  }
}
