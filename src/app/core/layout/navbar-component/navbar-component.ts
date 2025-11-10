import { Component, HostListener, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../../services/auth/auth.services';

type NavItem = {
  label: string;
  link?: string;
  children?: { label: string; link: string }[];
  key?: string;
};

@Component({
  selector: 'mnv-navbar',
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './navbar-component.html',
  styleUrls: ['./navbar-component.scss'],
})
export class NavbarComponent {
  readonly auth = inject(AuthService);

  isOpen = false;
  openKey: string | null = 'jobs';
  drawerOpen = false;

  constructor(public translate: TranslateService) {
    const langs = ['en', 'pl', 'ee', 'ru', 'lv', 'lt'];
    translate.addLangs(langs);
    translate.setFallbackLang('en');

    const saved = (typeof localStorage !== 'undefined'
      ? localStorage.getItem('mnv-lang')
      : null) as string | null;

    const startLang =
      saved && langs.includes(saved) ? saved : 'en';

    this.setLang(startLang.toUpperCase());
  }

  menu: NavItem[] = [
    {
      label: 'NAV.JOBS',
      key: 'jobs',
      children: [
        { label: 'MAIN.GERMANY', link: 'DE' },
        { label: 'MAIN.NETHERLANDS', link: 'NL' },
        { label: 'MAIN.FINLAND', link: 'FI' },
        { label: 'MAIN.BELGIUM', link: 'BE' },
        { label: 'MAIN.FRANCE', link: 'FR' },
      ]
    },
    { label: 'NAV.FAQ',      link: '/faq' },
    { label: 'NAV.CONTACTS', link: '/contacts' },
  ];

  socials = [
    { key: 'tiktok',   href: 'https://www.tiktok.com/@monovarecruit?_r=1&_t=ZN-91HcctpOzji',    label: 'TikTok' },
    { key: 'linkedin', href: 'https://www.linkedin.com/company/monova-recruitment/', label: 'LinkedIn' },
    { key: 'facebook', href: 'https://facebook.com/', label: 'Facebook' },
    { key: 'instagram',href: 'https://www.instagram.com/monovarecruit?igsh=MW12dDd4MTczd3dweA%3D%3D&utm_source=qr', label: 'Instagram' },
  ];

  langs = [
    { code: 'EN', name: 'English' },
    { code: 'PL', name: 'Polish' },
    { code: 'EE', name: 'Estonian' },
    { code: 'RU', name: 'Russian' },
    { code: 'LV', name: 'Latvian' },
    { code: 'LT', name: 'Lithuanian' },
  ];

  activeLang = 'EN';

  toggle() { this.isOpen = !this.isOpen; }
  close() { this.isOpen = false; }
  @HostListener('document:keydown.escape') onEsc() { this.close(); }

  toggleSection(key?: string) {
    if (!key) return;
    this.openKey = this.openKey === key ? null : key;
  }

  toggleDrawer() { this.drawerOpen = !this.drawerOpen; }
  closeDrawer()  { this.drawerOpen = false; }

  toggleTheme() {
    const el = document.documentElement;
    el.setAttribute(
      'data-theme',
      el.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
    );
  }

  setLang(code: string) {
    const lower = code.toLowerCase();
    this.translate.use(lower);
    this.activeLang = code as typeof this.activeLang;

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('mnv-lang', lower);
    }

    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', lower);
    }
  }
}