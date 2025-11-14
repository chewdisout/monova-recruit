import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-referral-page',
  imports: [CommonModule, TranslatePipe, RouterLink],
  templateUrl: './referral-page.component.html',
  styleUrls: ['./referral-page.component.scss'],
})
export class ReferralPageComponent {}
