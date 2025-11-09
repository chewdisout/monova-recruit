import { Component, inject } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-faq-page',
  imports: [CommonModule, TranslateModule],
  templateUrl: './faq-page.component.html',
  styleUrls: ['./faq-page.component.scss'],
})
export class FaqPageComponent {
  private translate = inject(TranslateService);

  get faqs() {
    return this.translate.instant('FAQ.QUESTIONS') || [];
  }
}
