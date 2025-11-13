import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'app-referral-page',
  imports: [CommonModule, TranslatePipe],
  templateUrl: './referral-page.component.html',
  styleUrls: ['./referral-page.component.scss'],
})
export class ReferralPageComponent {}
