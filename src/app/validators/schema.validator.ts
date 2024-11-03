import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ParserStrategy } from '../services/json-strategy.service';

export const schemaValidatorGetter = (parserStrategy: ParserStrategy) =>
  (control: AbstractControl): ValidationErrors | null => {
    try {
      if (control.value) {
        parserStrategy.parse(control.value);
      }

      return null;
    } catch (e) {
      return { parserError: true };
    }
  }
