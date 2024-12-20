import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  save<T>(key: string, value: T): void {
    const jsonData = JSON.stringify(value);
    localStorage.setItem(key, jsonData);
  }

  get<T>(key: string): T | null {
    const jsonData = localStorage.getItem(key);

    return jsonData ? JSON.parse(jsonData) : null;
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }

  hasKey(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }
}
