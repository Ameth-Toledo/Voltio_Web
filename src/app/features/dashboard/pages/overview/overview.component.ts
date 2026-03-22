import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { LucideAngularModule, Plus, Star, TrendingUp, Package, ShoppingCart } from 'lucide-angular';
import { ProductCardComponent } from "../../components/product-card/product-card.component";
import { Product } from '../../models/Product';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, NavbarComponent, LucideAngularModule, ProductCardComponent],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css'
})
export class OverviewComponent {
  userName = 'Ameth';

  readonly Plus = Plus;
  readonly Star = Star;
  readonly TrendingUp = TrendingUp;
  readonly Package = Package;
  readonly ShoppingCart = ShoppingCart;

  products: Product[] = [
    { imgSrc: 'assets/hardware/esp32.webp', name: 'ESP32 DevKit v1', category: 'Microcontroladores', rating: '4.8' },
    { imgSrc: 'assets/hardware/arduino.webp', name: 'Arduino Uno R3', category: 'Microcontroladores', rating: '4.9' },
    { imgSrc: 'assets/hardware/esp32.webp', name: 'Sensor DHT22 Temperatura y Humedad', category: 'Sensores', rating: '4.7' },
    { imgSrc: 'assets/hardware/esp32.webp', name: 'Sensor Ultrasónico HC-SR04', category: 'Sensores', rating: '4.6' },
    { imgSrc: 'assets/hardware/capacitor.webp', name: 'Kit Resistencias 1/4W 600 piezas', category: 'Componentes', rating: '4.8' },
    { imgSrc: 'assets/hardware/capacitor.webp', name: 'Capacitores Electrolíticos Kit 200pz', category: 'Componentes', rating: '4.7' },
    { imgSrc: 'assets/hardware/cautin.webp', name: 'Soldador de Temperatura Variable 60W', category: 'Herramientas y Equipos', rating: '4.9' },
    { imgSrc: 'assets/hardware/cautin.webp', name: 'Multímetro Digital DT830B', category: 'Herramientas y Equipos', rating: '4.8' },
    { imgSrc: 'assets/hardware/esp32.webp', name: 'Kit Iniciador Arduino Completo', category: 'Kits de Desarrollo', rating: '4.9' },
    { imgSrc: 'assets/hardware/esp32.webp', name: 'Kit IoT ESP32 con Sensores', category: 'Kits de Desarrollo', rating: '4.8' },
    { imgSrc: 'assets/hardware/esp32.webp', name: 'Brazo Robótico 4DOF Kit', category: 'Robótica', rating: '4.7' },
    { imgSrc: 'assets/hardware/esp32.webp', name: 'Servo Motor SG90 Pack 5pz', category: 'Robótica', rating: '4.6' },
  ];
}