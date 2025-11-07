import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';

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
        { label: 'Germany', link: '/jobs?country=DE' },
        { label: 'Netherlands', link: '/jobs?country=NL' },
        { label: 'Finland', link: '/jobs?country=FI' }
      ]
    },
    { label: 'NAV.SERVICES', link: '/services' },
    { label: 'NAV.FAQ',      link: '/faq' },
    { label: 'NAV.CONTACTS', link: '/contacts' },
  ];

  socials = [
    { key: 'tiktok',   href: 'https://www.tiktok.com/@monova',    label: 'TikTok' },
    { key: 'linkedin', href: 'https://www.linkedin.com/company/', label: 'LinkedIn' },
    { key: 'facebook', href: 'https://facebook.com/',             label: 'Facebook' },
    { key: 'instagram',href: 'https://instagram.com/',            label: 'Instagram' },
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