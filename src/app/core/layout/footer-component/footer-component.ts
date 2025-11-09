import { UpperCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'mnv-footer',
  imports: [RouterLink, TranslateModule, UpperCasePipe],
  templateUrl: './footer-component.html',
  styleUrls: ['./footer-component.scss'],
})
export class FooterComponent {
  readonly year = new Date().getFullYear();

  socials = [
    { key: 'tiktok',   href: 'https://www.tiktok.com/@monova' },
    { key: 'linkedin', href: 'https://www.linkedin.com/company/' },
    { key: 'facebook', href: 'https://facebook.com/' },
    { key: 'instagram',href: 'https://instagram.com/' },
  ];
}
