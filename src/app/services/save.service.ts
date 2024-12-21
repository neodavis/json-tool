import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, interval, Subscription, takeWhile, tap } from "rxjs";
import { LocalStorageService } from "./local-storage.service";

@Injectable()
export class SaveService<SaveState> {
  private readonly _currentState$ = new BehaviorSubject<SaveState>(null as SaveState);
  private readonly countdown$ = new BehaviorSubject<number>(0);
  private readonly localStorageService = inject(LocalStorageService);
  private saveKey = 'DefaultSaveKey';
  private subscription: Subscription | null = null;

  initializeService(key: string) {
    this.saveKey = key;
    const savedState = this.localStorageService.get(this.saveKey) as SaveState;
    if (savedState) {
      this._currentState$.next(savedState);
    }
  }

  startCountdown(saveState: SaveState) {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    
    this.countdown$.next(5);
    
    this.subscription = interval(1000).pipe(
      takeWhile(() => this.countdown$.value > 0),
      tap(() => {
        const currentCount = this.countdown$.value;
        if (currentCount === 1) {
          this.saveState(saveState);
        } else {
          this.countdown$.next(currentCount - 1);
        }
      })
    ).subscribe();
  }

  saveState(state: SaveState) {
    this.localStorageService.save(this.saveKey, state);
    this._currentState$.next(state);
    this.countdown$.next(0);
    
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

  get currentState$() {
    return this._currentState$.asObservable();
  }

  get countdown() {
    return this.countdown$.asObservable();
  }
}