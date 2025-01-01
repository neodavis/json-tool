import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, Auth, User } from 'firebase/auth';
import { FirebaseApp } from '@angular/fire/app';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userSubject = new BehaviorSubject<User | null>(null);

  readonly user$ = this.userSubject.asObservable();

  private readonly auth!: Auth;
  private readonly errorHandler = inject(ErrorHandlerService);

  constructor() {
    const app = inject(FirebaseApp);
    this.auth = getAuth(app);

    this.auth.onAuthStateChanged(user => {
      this.userSubject.next(user);
    });
  }

  async signIn(email: string, password: string) {
    try {
      return signInWithEmailAndPassword(this.auth, email, password);
    } catch (error) {
      this.errorHandler.handleError(error);
      throw error;
    }
  }

  async signUp(email: string, password: string) {
    try {
      return createUserWithEmailAndPassword(this.auth, email, password);
    } catch (error) {
      this.errorHandler.handleError(error);
      throw error;
    }
  }

  async signOut() {
    try {
      return signOut(this.auth);
    } catch (error) {
      this.errorHandler.handleError(error);
      throw error;
    }
  }

  isAuthenticated() {
    return this.userSubject.getValue() !== null;
  }
}
