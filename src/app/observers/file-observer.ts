import { Subject } from './base-observer';

export class FileChangeSubject extends Subject<string> {
  override next(state: string): void {
    super.next(state);
  }
}
