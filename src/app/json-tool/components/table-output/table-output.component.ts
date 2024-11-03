import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { OutputComponent } from '../output/output.component';
import { AsyncPipe, JsonPipe, NgForOf, NgIf } from '@angular/common';
import { BehaviorSubject, map } from 'rxjs';
import { GetTypePipe } from './pipes/get-type.pipe';

@Component({
  selector: 'app-table-output',
  standalone: true,
  templateUrl: './table-output.component.html',
  styleUrls: ['./table-output.component.css'],
  imports: [NgIf, NgForOf, AsyncPipe, GetTypePipe, JsonPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableOutputComponent extends OutputComponent {
  readonly data$ = new BehaviorSubject<object>([]);
  readonly flatData$ = this.data$.pipe(
    map(data => this.flattenData(data as Record<string, unknown>))
  );

  private changeDetectorRef = inject(ChangeDetectorRef);

  applyOutputView(parsed: object) {
    this.data$.next(parsed);
    this.changeDetectorRef.detectChanges();
  }

  flattenData(object: Record<string, unknown>, prefix = ''): Array<{ key: string, value: unknown }> {
    return Object
      .entries(object)
      .reduce((flatData, [key, value]) => {
        const newKey = prefix ? `${prefix}["${key}"]` : `["${key}"]`;

        if (typeof value === 'object' && value !== null) {
          return flatData.concat(this.flattenData(value as Record<string, unknown>, newKey));
        } else {
          flatData.push({ key: newKey, value: value });

          return flatData;
        }
        }, [] as Array<{ key: string, value: unknown }>);
      }
}
