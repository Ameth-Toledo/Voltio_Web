import { Injectable } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Injectable({
  providedIn: 'root'
})
export class AnimationService {

  constructor() {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Animar elemento con scroll trigger
  animateOnScroll(
    element: HTMLElement,
    scrollConfig: {
      trigger?: string | HTMLElement;
      start?: string;
      end?: string;
      scrub?: boolean | number;
      onUpdate?: (self: any) => void;
    },
    animationProps: gsap.TweenVars
  ) {
    return gsap.to(element, {
      scrollTrigger: scrollConfig,
      ...animationProps
    });
  }

  // Animar propiedades de un elemento
  animate(element: HTMLElement, props: gsap.TweenVars) {
    return gsap.to(element, props);
  }

  // Animación fade in
  fadeIn(element: HTMLElement, delay: number = 0) {
    return gsap.fromTo(element,
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        delay,
        ease: 'power2.out' 
      }
    );
  }

  //Crear timeline para animaciones secuenciales
  createTimeline(config?: gsap.TimelineVars) {
    return gsap.timeline(config);
  }

  // Animar desde un estado inicial a uno final
  fromTo(element: HTMLElement, from: gsap.TweenVars, to: gsap.TweenVars) {
    return gsap.fromTo(element, from, to);
  }

  // Limpiar todas las animaciones y ScrollTriggers
  cleanup() {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }

  // Limpiar ScrollTriggers de un elemento específico
  cleanupElement(element: HTMLElement) {
    ScrollTrigger.getAll().forEach(trigger => {
      if (trigger.vars.trigger === element) {
        trigger.kill();
      }
    });
  }
}