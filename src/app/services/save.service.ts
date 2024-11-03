import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageService } from './local-storage.service';

@Injectable()
export class SaveService<SaveState> {
  readonly _currentState$ = new BehaviorSubject<SaveState>(null as SaveState);

  private readonly localStorageService = inject(LocalStorageService);
  private readonly SAVE_KEY = 'SavedData';

  constructor() {
    this._currentState$.next(this.localStorageService.getItem(this.SAVE_KEY) as SaveState);
  }

  get currentState$() {
    return this._currentState$.asObservable();
  }

  get currentState() {
    return this._currentState$.value;
  }

  saveState(state: SaveState) {
    this.localStorageService.setItem(this.SAVE_KEY, state);
    this._currentState$.next(state);
  }
}
