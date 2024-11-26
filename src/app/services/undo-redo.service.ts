import { Injectable } from '@angular/core';

@Injectable()
export class UndoRedoService {
  private undoStack: string[] = [];
  private redoStack: string[] = [];

  addState(state: string) {
    if (this.undoStack[this.undoStack.length - 1] !== state) {
      this.undoStack.push(state);
      this.redoStack = [];
    }
  }

  undo(): string | null {
    if (this.undoStack.length > 1) {
      const currentState = this.undoStack.pop();
      if (currentState) {
        this.redoStack.push(currentState);
      }
      return this.undoStack[this.undoStack.length - 1];
    }
    return null;
  }

  redo(): string | null {
    if (this.redoStack.length > 0) {
      const nextState = this.redoStack.pop();
      if (nextState) {
        this.undoStack.push(nextState);
      }
      return nextState as string | null;
    }
    return null;
  }

  clear() {
    this.undoStack = [];
    this.redoStack = [];
  }

  initialize(state: string) {
    this.clear();
    this.addState(state);
  }
}
