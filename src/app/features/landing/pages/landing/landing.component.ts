import { Component } from '@angular/core';
import { HeaderComponent } from "../../../../shared/components/header/header.component";
import { HeroComponent } from "../../components/hero/hero.component";
import { BentoDemoComponent } from "../../components/bento-demo/bento-demo.component";
import { PricingComponent } from "../../components/pricing/pricing.component";

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [HeaderComponent, HeroComponent, BentoDemoComponent, PricingComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {

}
