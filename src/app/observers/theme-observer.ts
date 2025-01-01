import { Subject } from './base-observer';

export class ThemeChangeSubject extends Subject<string> {
  override next(state: string): void {
    super.next(state);
  }
}
