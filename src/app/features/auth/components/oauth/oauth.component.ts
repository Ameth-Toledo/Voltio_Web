import { Component, output } from '@angular/core';

@Component({
  selector: 'app-oauth',
  standalone: true,
  imports: [],
  templateUrl: './oauth.component.html',
  styleUrl: './oauth.component.css'
})
export class OauthComponent {
  googleLogin = output<void>();
  githubLogin = output<void>();
}
