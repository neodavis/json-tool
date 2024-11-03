import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'isObject', standalone: true })
export class isObjectPipe implements PipeTransform {
  transform(value: unknown): boolean {
    return !!value && typeof value === 'object';
  }
}
