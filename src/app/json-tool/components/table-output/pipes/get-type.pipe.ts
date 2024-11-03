import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'getType', standalone: true })
export class GetTypePipe implements PipeTransform {
  transform(value: any): ReturnType<typeof value> {
    if (value === null) {
      return 'null'
    }

    return typeof value;
  }
}
