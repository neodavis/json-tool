import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DialogService } from 'primeng/dynamicdialog';
import { AuthService } from '../../../services/auth.service';
import { AuthDialogComponent } from '../../../auth-dialog/auth-dialog.component';
import { AsyncPipe, CommonModule } from '@angular/common';


@Component({
  selector: 'app-json-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    InputTextModule,
    TooltipModule,
    ReactiveFormsModule,
    FileUploadModule,
    SelectButtonModule,
    FormsModule,
    AsyncPipe,
  ],
  templateUrl: './json-toolbar.component.html',
  providers: [DialogService]
})
export class JsonToolbarComponent {
  protected auth = inject(AuthService);
  private dialogService = inject(DialogService);

  openAuthDialog() {
    this.dialogService.open(AuthDialogComponent, {
      header: 'Authentication',
      width: '400px'
    });
  }

  async signOut() {
    await this.auth.signOut();
  }
}
