import { Component, HostListener  } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

type NavItem = {
  label: string;
  link?: string;
  children?: { label: string; link: string }[];
  key?: string;
};

@Component({
  selector: 'mnv-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar-component.html',
  styleUrls: ['./navbar-component.scss'],
})
export class NavbarComponent {
  isOpen = false;

  toggle() {
    this.isOpen = !this.isOpen;
  }

  close() {
    this.isOpen = false;
  }

  @HostListener('document:keydown.escape')
  onEsc() {
    this.close();
  }

  menu: NavItem[] = [
    {
      label: 'Job Opportunities',
      key: 'jobs',
      children: [
        { label: 'Germany',    link: '/jobs?country=DE' },
        { label: 'Netherlands',link: '/jobs?country=NL' },
        { label: 'Finland',    link: '/jobs?country=FI' },
      ]
    },
    { label: 'Services', link: '/services' },
    { label: 'FAQ',      link: '/faq' },
    { label: 'Contacts', link: '/contacts' },
  ];

  socials = [
    { key: 'tiktok',   href: 'https://www.tiktok.com/@monova',    label: 'TikTok' },
    { key: 'linkedin', href: 'https://www.linkedin.com/company/', label: 'LinkedIn' },
    { key: 'facebook', href: 'https://facebook.com/',             label: 'Facebook' },
    { key: 'instagram',href: 'https://instagram.com/',            label: 'Instagram' },
  ];

  langs = [
    { code: 'PL', name: 'Polish' },
    { code: 'EE', name: 'Estonian' },
    { code: 'RU', name: 'Russian' },
    { code: 'LV', name: 'Latvian' },
    { code: 'LT', name: 'Lithuanian' },
  ];
  activeLang = 'EN';

  openKey: string | null = 'jobs';
  drawerOpen = false;

  toggleSection(key?: string) {
    if (!key) return;
    this.openKey = this.openKey === key ? null : key;
  }

  setLang(code: string) {
    this.activeLang = code;
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
}
