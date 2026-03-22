import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule, Eye, EyeOff, UserPlus } from 'lucide-angular';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LucideAngularModule  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  showPassword = false;
  readonly Eye = Eye;
  readonly EyeOff = EyeOff;
  readonly UserPlus = UserPlus;

  readonly form;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/[A-Z]/),
        ],
      ],
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  sendToHome(event: Event) {
    event.preventDefault();
    this.router.navigate(['']);
  }

  get passwordStrength(): { width: string; color: string } {
    const password = this.form.get('password')?.value ?? '';
    const hasLength = password.length >= 6;
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^a-zA-Z0-9]/.test(password);
    const score = [hasLength, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;

    if (score === 0) return { width: '0%', color: 'bg-gray-200' };
    if (score === 1) return { width: '25%', color: 'bg-red-400' };
    if (score === 2) return { width: '50%', color: 'bg-yellow-400' };
    if (score === 3) return { width: '75%', color: 'bg-blue-400' };
    return { width: '100%', color: 'bg-green-400' };
  }
}