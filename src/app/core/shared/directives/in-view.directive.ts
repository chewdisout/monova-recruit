import { Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[appInView]',
})
export class InViewDirective implements OnInit, OnDestroy {
  @Input() appInViewOnce = true;
  private observer?: IntersectionObserver;

  constructor(
    private el: ElementRef<HTMLElement>,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.renderer.addClass(this.el.nativeElement, 'is-animatable');

    this.observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.renderer.addClass(this.el.nativeElement, 'is-visible');

            if (this.appInViewOnce) {
              this.observer?.disconnect();
            }
          }
        });
      },
      { threshold: 0.25 }
    );

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
