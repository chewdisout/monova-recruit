import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'app-employers-page',
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './employers-page.component.html',
  styleUrls: ['./employers-page.component.scss'],
})
export class EmployersPageComponent {
  pillarKeys = ['CREATIVITY', 'CONSISTENCY', 'INNOVATION', 'MARKETING'];
  steps = [1, 2, 3, 4];
}
