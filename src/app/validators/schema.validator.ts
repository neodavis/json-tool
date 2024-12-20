import { AbstractControl } from '@angular/forms';
import { filter, from, map, Observable, of, switchMap } from 'rxjs';
import { editor } from 'monaco-editor';
import IMarker = editor.IMarker;

export const schemaValidatorGetter = (uri: string) => (control: AbstractControl) => {
  return !control.value ? of({ error: `Input is empty` }) : of(window.monaco)
    .pipe(
      filter(Boolean),
      switchMap(monaco => from(monaco.languages.json.getWorker())),
      switchMap((_worker) => from(_worker())),
      // ngx-monaco type differs from real one
      switchMap((worker) => from((worker as any).doValidation(uri)) as Observable<IMarker[]>),
      map((errors: IMarker[]) => {
        return errors.length
          // ngx-monaco type differs from real one
          ? errors.map(({ message, range }: any) =>
          `Line ${range.start.line}, Col ${range.start.character}: ${message}.`)
          : null;
      })
    )
}
