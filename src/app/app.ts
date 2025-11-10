import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavbarComponent } from './core/layout/navbar-component/navbar-component';
import { FooterComponent } from './core/layout/footer-component/footer-component';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
    isAdminRoute = false;
    private router = inject(Router);

    constructor() {
      this.router.events
        .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
        .subscribe(e => {
          this.isAdminRoute = e.urlAfterRedirects.startsWith('/admin');
        });
    }
}
