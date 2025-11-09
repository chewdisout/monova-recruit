import { Component, signal  } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

type CountryKey = 'de' | 'fi' | 'fr' | 'nl';

@Component({
  selector: 'app-home-page-component',
  imports: [RouterLink, CommonModule, TranslatePipe],
  templateUrl: './home-page-component.html',
  styleUrl: './home-page-component.scss',
})
export class HomePageComponent {
  steps = [1, 2, 3, 4];
}
