import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { TopbarComponent } from "../../components/topbar/topbar.component";
import { PanelleftComponent } from "../../components/panelleft/panelleft.component";
import { FormComponent } from "../../components/form/form.component";
import { OauthComponent } from "../../components/oauth/oauth.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, TopbarComponent, PanelleftComponent, FormComponent, OauthComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})

export class LoginComponent {
 private readonly authService = inject(AuthService);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  onFormSubmit(credentials: { email: string; password: string }): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.login(credentials).subscribe({
      next: () => {
        this.isLoading.set(false);
        // TODO: redirect after login
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          err?.error?.message ?? 'Credenciales incorrectas. Intenta de nuevo.'
        );
      },
    });
  }

  loginWithGoogle(): void {
    this.authService.loginWithGoogle();
  }

  loginWithGithub(): void {
    this.authService.loginWithGithub();
  }
}