import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, Auth, User } from 'firebase/auth';
import { FirebaseApp } from '@angular/fire/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userSubject = new BehaviorSubject<User | null>(null);

  readonly user$ = this.userSubject.asObservable();

  private readonly auth!: Auth;

  constructor() {
    const app = inject(FirebaseApp);
    this.auth = getAuth(app);

    this.auth.onAuthStateChanged(user => {
      this.userSubject.next(user);
    });
  }

  async signIn(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async signUp(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  async signOut() {
    return signOut(this.auth);
  }

  isAuthenticated() {
    return this.userSubject.getValue() !== null;
  }
}
