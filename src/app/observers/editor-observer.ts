import { Subject } from "./base-observer";


export class EditorStateSubject extends Subject<string> {
  override next(state: string): void {
    super.next(state);
  }
}
