export interface Observer<T> {
  next(value: T): void;
  error?(error: Error): void;
}

export class Subject<T> {
  private observers: Observer<T>[] = [];
  
  subscribe(observer: Observer<T>): void {
    this.observers.push(observer);
  }
  
  next(value: T): void {
    this.observers.forEach(observer => observer.next(value));
  }

  error(error: Error): void {
    this.observers.forEach(observer => observer.error?.(error));
  }
}