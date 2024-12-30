import { Component, inject } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FirestoreService } from '../services/firestore.service';
import { TableModule } from 'primeng/table';
import { DatePipe, SlicePipe } from '@angular/common';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-history-modal',
  template: `
    <div class="flex flex-col gap-4">
      <p-table [value]="versions" [loading]="loading">
        <ng-template pTemplate="header">
          <tr>
            <th>Date</th>
            <th>Content Preview</th>
            <th>Action</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-version>
          <tr>
            <td>{{version.timestamp.toDate() | date:'medium'}}</td>
            <td>{{version.content | slice:0:50}}...</td>
            <td>
              <p-button
                label="Load"
                (onClick)="loadVersion(version)">
              </p-button>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  `,
  standalone: true,
  imports: [
    TableModule,
    DatePipe,
    SlicePipe,
    Button,
]
})
export class HistoryModalComponent {
  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);
  private firestore = inject(FirestoreService);

  versions: any[] = [];
  loading = true;

  ngOnInit() {
    this.loadVersions();
  }

  async loadVersions() {
    const { type, userId } = this.config.data;
    const snapshot = await this.firestore.getLastVersions(type, userId);
    const [currentItem, ...collection] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    this.versions = collection
    this.loading = false;
  }

  loadVersion(version: any) {
    this.ref.close(version);
  }
}
