import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  setItem<T>(key: string, value: T): void {
    const jsonData = JSON.stringify(value);
    localStorage.setItem(key, jsonData);
  }

  getItem<T>(key: string): T | null {
    const jsonData = localStorage.getItem(key);

    return jsonData ? JSON.parse(jsonData) : null;
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }

  hasKey(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }
}
