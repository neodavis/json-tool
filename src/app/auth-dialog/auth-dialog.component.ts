import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-auth-dialog',
  template: `
    <form [formGroup]="form" class="flex flex-col gap-4 p-4">
      <span>
        <label for="email">Email</label>
        <input pInputText id="email" class="w-full" formControlName="email" />
      </span>

      <span>
        <label for="password">Password</label>
        <input pInputText type="password" id="password" class="w-full" formControlName="password" />
      </span>

      <div class="flex gap-2">
        <p-button
          label="Sign In"
          class="w-full"
          styleClass="w-full"
          [loading]="signInLoading"
          (onClick)="signIn()"
          [disabled]="form.invalid">
        </p-button>
        <p-button
          label="Sign Up"
          class="w-full"
          styleClass="w-full"
          [loading]="signUpLoading"
          (onClick)="signUp()"
          [disabled]="form.invalid">
        </p-button>
      </div>
    </form>
  `,
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ReactiveFormsModule,
    InputTextModule,
  ]
})
export class AuthDialogComponent {
  form: FormGroup;
  signInLoading = false;
  signUpLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private ref: DynamicDialogRef
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async signIn() {
    if (this.form.valid) {
      this.signInLoading = true;
      try {
        const { email, password } = this.form.value;
        await this.authService.signIn(email, password);
        this.ref.close(true);
      } catch (error) {
        console.error(error);
      } finally {
        this.signInLoading = false;
      }
    }
  }

  async signUp() {
    if (this.form.valid) {
      this.signUpLoading = true;
      try {
        const { email, password } = this.form.value;
        await this.authService.signUp(email, password);
        this.ref.close(true);
      } catch (error) {
        console.error(error);
      } finally {
        this.signUpLoading = false;
      }
    }
  }
}
