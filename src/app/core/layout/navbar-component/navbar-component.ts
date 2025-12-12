import { Component, HostListener, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../../services/auth/auth.services';
import { NgClass } from '@angular/common';

type NavItem = {
  label: string;
  link: string;
};

type LangDef = {
  code: string;
  name: string;
  flag: string;
};

@Component({
  selector: 'mnv-navbar',
  imports: [RouterLink, RouterLinkActive, TranslatePipe, NgClass],
  templateUrl: './navbar-component.html',
  styleUrls: ['./navbar-component.scss'],
})
export class NavbarComponent {
  readonly auth = inject(AuthService);

  drawerOpen = false;
  langMenuOpen = false;
  isScrolled = false;

  constructor(public translate: TranslateService) {
    const langsCodes = ['en', 'pl', 'ee', 'ru', 'lv', 'lt'];
    translate.addLangs(langsCodes);
    translate.setFallbackLang('en');

    const saved = (typeof localStorage !== 'undefined'
      ? localStorage.getItem('mnv-lang')
      : null) as string | null;

    const startLang = saved && langsCodes.includes(saved) ? saved : 'en';

    this.setLang(startLang.toUpperCase());
  }

  ngOnInit(): void {
    // Set correct state on initial load / reload
    this.updateScrolledState();
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.updateScrolledState();
  }

  private updateScrolledState(): void {
    const y =
      window.scrollY ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;

    const next = y > 40;

    // tiny optimization to avoid pointless change detection
    if (next !== this.isScrolled) {
      this.isScrolled = next;
    }
  }

  // SIMPLE MENU – “Jobs” goes to all jobs
  menu: NavItem[] = [
    { label: 'NAV.JOBS', link: '/jobs' },
    { label: 'NAV.FAQ', link: '/faq' },
    { label: 'NAV.CONTACTS', link: '/contacts' },
    { label: 'REFERRAL.TITLE', link: '/referral' },
  ];

  // ICON-ONLY LANG DEFINITIONS (adjust paths to your flags)
  langs: LangDef[] = [
    { code: 'EN', name: 'English',   flag: 'gb' },
    { code: 'PL', name: 'Polish',    flag: 'pl' },
    { code: 'EE', name: 'Estonian',  flag: 'ee' },
    { code: 'RU', name: 'Russian',   flag: 'ru' },
    { code: 'LV', name: 'Latvian',   flag: 'lv' },
    { code: 'LT', name: 'Lithuanian',flag: 'lt' },
  ];

  activeLang: LangDef['code'] = 'EN';
  activeLangDef: LangDef = this.langs[0];

  // ========== NAV BEHAVIOUR ==========

  toggleDrawer() {
    this.drawerOpen = !this.drawerOpen;
    if (!this.drawerOpen) {
      this.langMenuOpen = false;
    }
  }

  closeDrawer() {
    this.drawerOpen = false;
    this.langMenuOpen = false;
  }

  onLogout() {
    this.auth.logout();
    this.closeDrawer();
  }

  // ========== LANGUAGE HANDLING ==========

  toggleLangMenu() {
    this.langMenuOpen = !this.langMenuOpen;
  }

  setLang(code: string) {
    const lower = code.toLowerCase();
    this.translate.use(lower);
    this.activeLang = code as typeof this.activeLang;

    const found = this.langs.find(l => l.code === code);
    if (found) {
      this.activeLangDef = found;
    }

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('mnv-lang', lower);
    }

    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', lower);
    }

    this.langMenuOpen = false;
  }
}
