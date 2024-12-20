import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import { takeWhile, tap } from 'rxjs/operators';
import { LocalStorageService } from './local-storage.service';

@Injectable()
export class SaveService<SaveState> {
  readonly _currentState$ = new BehaviorSubject<SaveState>(null as SaveState);
  private readonly localStorageService = inject(LocalStorageService);
  private saveKey = 'DefaultSaveKey';

  private countdown$ = new BehaviorSubject<number>(0);
  private subscription: Subscription | null = null;

  initializeService(key: string) {
    this.saveKey = key;
    this._currentState$.next(this.localStorageService.get(this.saveKey) as SaveState);
  }

  get currentState$() {
    return this._currentState$.asObservable();
  }

  get currentState() {
    return this._currentState$.value;
  }

  get countdown() {
    return this.countdown$.asObservable();
  }

  saveState(state: SaveState) {
    this.localStorageService.save(this.saveKey, state);
    this._currentState$.next(state);
    this.countdown$.next(0);
  }

  startCountdown(saveState: SaveState) {
    this.countdown$.next(5);
    this.subscription?.unsubscribe();
    this.subscription = interval(1000)
      .pipe(
        takeWhile(() => this.countdown$.value > 0),
        tap(() => {
          const current = this.countdown$.value;

          current > 1
          ? this.countdown$.next(current - 1)
          : this.saveState(saveState);
        })
      )
      .subscribe();
  }
}
