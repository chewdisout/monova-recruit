import { Component, ElementRef, inject, Inject, PLATFORM_ID, signal, ViewChild  } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { InViewDirective } from '../../core/shared/directives/in-view.directive';

@Component({
  selector: 'app-home-page-component',
  imports: [RouterLink, CommonModule, TranslatePipe, InViewDirective],
  templateUrl: './home-page-component.html',
  styleUrls: ['./home-page-component.scss', './home-page-sections.scss'],
})
export class HomePageComponent {
  steps = [1, 2, 3, 4];
  hoveredCountry: string | null = null;
  tooltipX = 0;
  tooltipY = 0;

  @ViewChild('heroVideo') heroVideo!: ElementRef<HTMLVideoElement>;

  private router = inject(Router);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  onMapMouseMove(event: MouseEvent) {
    const target = event.target as Element | null;
    if (!target) {
      this.hoveredCountry = null;
      return;
    }

    const countryEl = target.closest('.hero-map-country') as SVGElement | null;

    if (!countryEl) {
      this.hoveredCountry = null;
      return;
    }

    const label =
      countryEl.getAttribute('data-name') ||
      countryEl.id ||
      'Job opportunities';

    this.hoveredCountry = label;

    // position tooltip relative to the hero__map container
    const mapContainer = (event.currentTarget as SVGElement).parentElement;
    if (!mapContainer) return;

    const rect = mapContainer.getBoundingClientRect();

    this.tooltipX = event.clientX - rect.left + 12; // +12px to the right
    this.tooltipY = event.clientY - rect.top - 28;  // a bit above the cursor
    console.log(this.hoveredCountry, this.tooltipX, this.tooltipY);

  }

  onMapLeave() {
    this.hoveredCountry = null;
  }

  onMapClick(event: MouseEvent) {
    const target = event.target as SVGElement | null;
    if (!target?.classList?.contains('hero-map-country')) return;

    const countryId = target.id;
    this.router.navigate(['/jobs'], {
      queryParams: { country: countryId }
    });
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    setTimeout(() => {
        const video = this.heroVideo?.nativeElement;
        if (!video) return;

        video.muted = true;
        video.autoplay = true;
        video.playsInline = true;

        const playPromise = video.play();

        if (playPromise) {
          playPromise
            .then(() => {
              console.log('Hero video autoplay started');
            })
            .catch(err => {
              console.warn('Hero video autoplay blocked:', err);
            });
        }
    }, 0);
  }
}
