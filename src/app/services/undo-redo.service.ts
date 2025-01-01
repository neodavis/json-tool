import { Injectable } from '@angular/core';

@Injectable()
export class UndoRedoService {
  private undoStack: string[] = [];
  private redoStack: string[] = [];
  private currentState: string = '';

  addState(state: string) {
    // Don't add if state hasn't changed
    if (this.currentState === state) return;
    
    this.undoStack.push(this.currentState);
    this.currentState = state;
    // Clear redo stack when new state is added
    this.redoStack = [];
  }

  undo(): string | null {
    if (this.undoStack.length > 0) {
      const previousState = this.undoStack.pop()!;
      this.redoStack.push(this.currentState);
      this.currentState = previousState;
      return previousState;
    }
    return null;
  }

  redo(): string | null {
    if (this.redoStack.length > 0) {
      const nextState = this.redoStack.pop()!;
      this.undoStack.push(this.currentState);
      this.currentState = nextState;
      return nextState;
    }
    return null;
  }

  clear() {
    this.undoStack = [];
    this.redoStack = [];
    this.currentState = '';
  }

  initialize(state: string) {
    this.clear();
    this.currentState = state;
  }

  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  canRedo(): boolean {
    return this.redoStack.length > 0;
  }
}
