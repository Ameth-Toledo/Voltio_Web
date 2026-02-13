import { Component } from '@angular/core';
import { HeaderComponent } from "../../../../shared/components/header/header.component";
import { HeroComponent } from "../../components/hero/hero.component";

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [HeaderComponent, HeroComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {

}
