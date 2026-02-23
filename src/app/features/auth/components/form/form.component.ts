import { Component, inject, input, output, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { RouterModule } from '@angular/router';

function passwordStrengthValidator(control: AbstractControl) {
  const value: string = control.value || '';
  const hasUpperCase = /[A-Z]/.test(value);
  const hasMinLength = value.length >= 6;

  if (!hasMinLength) return { minLength: true };
  if (!hasUpperCase) return { noUpperCase: true };
  return null;
}

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})

export class FormComponent {
private readonly fb = inject(FormBuilder);

  // Inputs desde el padre
  isLoading = input<boolean>(false);
  errorMessage = input<string | null>(null);

  // Outputs hacia el padre
  submitted = output<{ email: string; password: string }>();

  showPassword = signal(false);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, passwordStrengthValidator]],
  });

  get email() {
    return this.loginForm.get('email')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((v) => !v);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.submitted.emit(this.loginForm.value);
  }
}
