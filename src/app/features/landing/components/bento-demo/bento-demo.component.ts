import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BentoItem } from '../../models/bento-item.model';
import { SpotlightComponent } from '../spotlight/spotlight.component';

@Component({
  selector: 'app-bento-demo',
  standalone: true,
  imports: [SpotlightComponent],
  templateUrl: './bento-demo.component.html',
  styleUrl: './bento-demo.component.css'
})
export class BentoDemoComponent implements OnInit, OnDestroy {
  @ViewChild('sectionRef', { static: true }) sectionRef!: ElementRef;

  isVisible = false;
  private observer!: IntersectionObserver;

  items: BentoItem[] = [
    { title: 'Microcontroladores',     description: 'ESP32, Arduino, Raspberry Pi y más componentes',          colSpan: 'md:col-span-1', descriptionColor: 'text-orange-400', banner: 'assets/banners/microcontroladores.png' },
    { title: 'Sensores',               description: 'Temperatura, humedad, movimiento y proximidad',            colSpan: 'md:col-span-1', descriptionColor: 'text-blue-400',   banner: 'assets/banners/sensores.png'           },
    { title: 'Componentes Pasivos',    description: 'Resistencias, capacitores, LEDs y conectores',             colSpan: 'md:col-span-1', descriptionColor: 'text-yellow-400', banner: 'assets/banners/componentes.png' },
    { title: 'Herramientas y Equipos', description: 'Todo lo que necesitas para tus proyectos electrónicos',   colSpan: 'md:col-span-2', descriptionColor: 'text-orange-400', banner: 'assets/banners/herramientas.png' },
    { title: 'Kits de Desarrollo',     description: 'Comienza tu viaje en la electrónica',                     colSpan: 'md:col-span-1', descriptionColor: 'text-blue-400', banner: 'assets/banners/kits.png' },
    { title: 'Robótica',               description: 'Motores, servos y controladores',                          colSpan: 'md:col-span-1', descriptionColor: 'text-yellow-400', banner: 'assets/banners/robotica.png' },
    { title: 'Envío Rápido',           description: 'Recibe tus componentes en tiempo récord',                  colSpan: 'md:col-span-2', descriptionColor: 'text-orange-400', banner: 'assets/banners/envios.png' },
  ];

  ngOnInit() {
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.isVisible = true;
          this.observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    this.observer.observe(this.sectionRef.nativeElement);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
