import { Component, ElementRef, Inject, PLATFORM_ID, signal, ViewChild  } from '@angular/core';
import { RouterLink } from '@angular/router';
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

  @ViewChild('heroVideo') heroVideo!: ElementRef<HTMLVideoElement>;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

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
